// Single source for page titles, descriptions and social previews.
// Used by the pages at runtime and by scripts/prerender.js at build time,
// so keep it plain data (no JSX / asset imports).
// Case-study SEO lives on each project in projects.jsx (project.seo).

export const SITE_URL = "https://v2.waltercarlson.dev";
export const SITE_NAME = "Walter Carlson";
// Social preview image: public/og-image.png (1200x630), referenced in public/index.html

export const PAGE_SEO = {
  home: {
    path: "/",
    title: "Walter Carlson",
    description: "Walter Carlson is a UI Engineer building accessible, scalable interfaces that bridge design and engineering, from wireframes to production-ready front-end.",
  },
  skills: {
    path: "/skills",
    title: "Skills | Walter Carlson",
    description: "Walter Carlson's skills across the modern web stack: design systems, component architecture, performant front-end engineering, tooling and collaboration.",
  },
  work: {
    path: "/work",
    title: "Work | Walter Carlson",
    description: "Case studies by Walter Carlson, from automotive platforms and dashboards to interactive design systems, covering research, design and front-end execution.",
  },
  about: {
    path: "/about",
    title: "About | Walter Carlson",
    description: "Walter Carlson's path from graphic designer to UI engineer, creating responsive custom websites and intuitive, meaningful digital experiences.",
  },
  contact: {
    path: "/contact",
    title: "Contact | Walter Carlson",
    description: "Contact Walter Carlson about UI engineering and front-end roles. Send a message through the form and expect a reply within 24 hours.",
  },
  resume: {
    path: "/resume",
    title: "Resume | Walter Carlson",
    description: "Resume of Walter Carlson, Design Engineer: front-end development and UI/UX roles at DealerOn, fusionZONE and Motorwebs, core skills and education. PDF download.",
  },
};
