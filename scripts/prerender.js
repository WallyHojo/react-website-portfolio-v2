/**
 * Post-build: write one HTML file per route (build/about.html, build/work/<slug>.html, …).
 *
 * The site is client-rendered, so every URL used to return the same empty
 * index.html. Link previews (LinkedIn, Slack, iMessage) and crawlers that don't
 * run JavaScript therefore saw no title, description or content. Each file
 * written here is the normal index.html — same bundle, same app — with that
 * route's <title>, description, canonical URL and social tags, plus a plain
 * text snapshot of the page inside #root for readers without JavaScript.
 * React replaces the snapshot as soon as it mounts.
 *
 * Content comes from the same config files the pages render (seo.js,
 * resumeData.js, projects.jsx), so there is nothing to keep in sync by hand.
 *
 * ponytail: text snapshot, not a full DOM render. Full prerendering would need
 * a headless browser in the build environment; upgrade if that ever matters.
 *
 * Runs automatically after `npm run build` via the "postbuild" script.
 */
const fs = require("fs");
const path = require("path");
const babel = require("@babel/core");

const ROOT = path.resolve(__dirname, "..");
const SRC = fs.realpathSync(path.join(ROOT, "src")); // real path: module filenames are resolved
const BUILD = path.join(ROOT, "build");

/* ---- Load the app's config modules (ESM/JSX + asset imports) in Node ---- */

process.env.BABEL_ENV = "test"; // babel-preset-react-app emits CommonJS for Node in "test"
const assetStub = (module, file) => {
  module.exports = path.basename(file);
};
for (const ext of [".css", ".svg", ".png", ".jpg", ".jpeg", ".gif", ".webp", ".mp4", ".webm", ".woff", ".woff2"]) {
  require.extensions[ext] = assetStub;
}
const loadJs = require.extensions[".js"];
for (const ext of [".js", ".jsx"]) {
  require.extensions[ext] = (module, file) => {
    if (!file.startsWith(SRC)) return loadJs(module, file);
    const { code } = babel.transformFileSync(file, {
      babelrc: false,
      configFile: false,
      presets: [[require.resolve("babel-preset-react-app"), { runtime: "automatic" }]],
    });
    module._compile(code, file);
  };
}

const { SITE_URL, SITE_NAME, PAGE_SEO } = require(path.join(SRC, "config/seo.js"));
const resume = require(path.join(SRC, "config/resumeData.js"));
const { PROJECTS } = require(path.join(SRC, "config/projects.jsx"));

/* ---- Helpers ---- */

const esc = (value = "") =>
  String(value).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const list = (items = []) => (items.length ? `<ul>${items.map((i) => `<li>${esc(i)}</li>`).join("")}</ul>` : "");

const nav = `<nav aria-label="Site"><ul>${Object.values(PAGE_SEO)
  .map((p) => `<li><a href="${p.path}">${p.path === "/" ? "Home" : esc(p.title.replace(` | ${SITE_NAME}`, ""))}</a></li>`)
  .join("")}</ul></nav>`;

const snapshot = (heading, description, body = "") =>
  `<div class="prerender">${nav}<h1>${esc(heading)}</h1><p>${esc(description)}</p>${body}</div>`;

/* ---- Page bodies ---- */

const workBody = `<ul>${PROJECTS.map(
  (p) => `<li><a href="/work/${p.slug}">${esc(p.title)}</a> — ${esc(p.overview)}</li>`
).join("")}</ul>`;

const resumeBody = [
  `<h2>Summary</h2><p>${esc(resume.RESUME_SUMMARY.body)}</p>`,
  `<ul>${resume.RESUME_SUMMARY.facts.map((f) => `<li>${esc(f.label)}: ${esc(f.value)}</li>`).join("")}</ul>`,
  `<h2>Experience</h2>`,
  ...resume.RESUME_EXPERIENCE.map(
    (j) => `<h3>${esc(j.role)} — ${esc(j.company)}</h3><p>${esc(j.location)} · ${esc(j.start)} – ${esc(j.end)}</p>${list(j.highlights)}`
  ),
  `<h2>Core Skills</h2>`,
  ...resume.RESUME_SKILLS.map((g) => `<h3>${esc(g.title)}</h3>${list(g.items)}`),
  `<h2>Project Highlights</h2>`,
  ...resume.RESUME_PROJECTS.map((p) => `<h3>${esc(p.title)}</h3>${list(p.highlights)}`),
  `<h2>Education</h2><p>${esc(resume.RESUME_EDUCATION.credential)}, ${esc(resume.RESUME_EDUCATION.school)}</p>`,
  `<p><a href="${resume.RESUME_PDF}">Download the resume (PDF)</a></p>`,
].join("");

const projectBody = (p) =>
  [
    `<dl><dt>Role</dt><dd>${esc(p.role)}</dd><dt>Timeline</dt><dd>${esc(p.timeline)}</dd><dt>Technologies</dt><dd>${esc(
      (p.technologies || []).join(", ")
    )}</dd></dl>`,
    p.summary?.challenge ? `<h2>Challenge</h2><p>${esc(p.summary.challenge)}</p>` : "",
    p.summary?.goals ? `<h2>Goals</h2>${list(p.summary.goals)}` : "",
    p.results?.achievements ? `<h2>Results</h2>${list(p.results.achievements)}` : "",
    p.url ? `<p><a href="${esc(p.url)}">Visit the live site</a></p>` : "",
    `<p><a href="/work">All work</a></p>`,
  ].join("");

/* ---- Routes ---- */

const routes = [
  { ...PAGE_SEO.home, heading: SITE_NAME },
  { ...PAGE_SEO.skills, heading: "Skills" },
  { ...PAGE_SEO.work, heading: "Work", body: workBody },
  { ...PAGE_SEO.about, heading: "About" },
  { ...PAGE_SEO.contact, heading: "Contact", body: `<p><a href="/contact">Use the contact form</a> — replies within 24 hours.</p>` },
  { ...PAGE_SEO.resume, heading: "Resume", body: resumeBody },
  ...PROJECTS.map((p) => ({
    path: `/work/${p.slug}`,
    title: p.seo?.title ?? `${p.title} | ${SITE_NAME}`,
    description: p.seo?.description ?? p.overview,
    heading: p.title,
    body: projectBody(p),
  })),
];

/* ---- Write files ---- */

const template = fs.readFileSync(path.join(BUILD, "index.html"), "utf8");

function setTag(html, pattern, replacement, label) {
  if (!pattern.test(html)) throw new Error(`prerender: ${label} not found in build/index.html`);
  return html.replace(pattern, replacement);
}

function render(route) {
  const url = `${SITE_URL}${route.path === "/" ? "/" : route.path}`;
  const meta = (attr, key, value) => [
    new RegExp(`<meta ${attr}="${key}" content="[^"]*"\\s*/?>`),
    `<meta ${attr}="${key}" content="${esc(value)}"/>`,
    key,
  ];

  let html = template;
  for (const [pattern, replacement, label] of [
    [/<title>[^<]*<\/title>/, `<title>${esc(route.title)}</title>`, "title"],
    meta("name", "description", route.description),
    [/<link rel="canonical" href="[^"]*"\s*\/?>/, `<link rel="canonical" href="${url}"/>`, "canonical"],
    meta("property", "og:title", route.title),
    meta("property", "og:description", route.description),
    meta("property", "og:url", url),
    meta("name", "twitter:title", route.title),
    meta("name", "twitter:description", route.description),
  ]) {
    html = setTag(html, pattern, replacement, label);
  }

  return setTag(
    html,
    /<div id="root"><\/div>/,
    `<div id="root">${snapshot(route.heading, route.description, route.body)}</div>`,
    "#root"
  );
}

for (const route of routes) {
  // "/" → index.html; "/about" → about.html; "/work/x" → work/x.html
  // (Cloudflare Pages serves /about from about.html; every file boots the same app)
  const file = route.path === "/" ? "index.html" : `${route.path.slice(1)}.html`;
  const out = path.join(BUILD, file);
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, render(route));
}

console.log(`prerender: wrote ${routes.length} route files (${routes.map((r) => r.path).join(", ")})`);
