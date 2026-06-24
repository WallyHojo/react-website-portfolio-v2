import { ReactComponent as ReactIcon } from "../assets/images/icons/react.svg";
import { ReactComponent as BootstrapIcon } from "../assets/images/icons/bootstrap.svg";
import { ReactComponent as FoundationIcon } from "../assets/images/icons/zurb.svg";
import { ReactComponent as HTMLIcon } from "../assets/images/icons/html.svg";
import { ReactComponent as CSSIcon } from "../assets/images/icons/css.svg";
import { ReactComponent as JqueryIcon } from "../assets/images/icons/jquery.svg";
import { ReactComponent as JavascriptIcon } from "../assets/images/icons/javascript.svg";
import { ReactComponent as TypescriptIcon } from "../assets/images/icons/typescript.svg";
import { ReactComponent as ViteIcon } from "../assets/images/icons/vite.svg";
import { ReactComponent as GitIcon } from "../assets/images/icons/git.svg";
import { ReactComponent as PHPIcon } from "../assets/images/icons/php.svg";
import { ReactComponent as GithubIcon } from "../assets/images/icons/github.svg";
import { ReactComponent as NPMIcon } from "../assets/images/icons/npm.svg";
import { ReactComponent as ElementorIcon } from "../assets/images/icons/elementor.svg";
import { ReactComponent as CPANELIcon } from "../assets/images/icons/cpanel.svg";
import { ReactComponent as DealerdotcomIcon } from "../assets/images/icons/dealerdotcom.svg";
import { ReactComponent as DealersocketIcon } from "../assets/images/icons/dealersocket.svg";
import { ReactComponent as HomenetIcon } from "../assets/images/icons/homenet.svg";
import { ReactComponent as VAUTOIcon } from "../assets/images/icons/vauto.svg";
import { ReactComponent as WordpressIcon } from "../assets/images/icons/wordpress.svg";
import { ReactComponent as JSONIcon } from "../assets/images/icons/json.svg";
import { ReactComponent as XMLIcon } from "../assets/images/icons/xml.svg";
import { ReactComponent as XSLTIcon } from "../assets/images/icons/xslt.svg";
import { ReactComponent as FitmaIcon } from "../assets/images/icons/figma.svg";
import { ReactComponent as XDIcon } from "../assets/images/icons/xd.svg";
import { ReactComponent as PhotoshopIcon } from "../assets/images/icons/photoshop.svg";
import { ReactComponent as IllustratorIcon } from "../assets/images/icons/illustrator.svg";
import { ReactComponent as InkscapeIcon } from "../assets/images/icons/inkscape.svg";
import { ReactComponent as VSIcon } from "../assets/images/icons/vs.svg";

import { ReactComponent as DesignIcon } from "../assets/images/icons/design.svg";
import { ReactComponent as ResponsiveDesignIcon } from "../assets/images/icons/responsive-design.svg";
import { ReactComponent as UIIcon } from "../assets/images/icons/ui.svg";
import { ReactComponent as ApplicationIcon } from "../assets/images/icons/application.svg";
import { ReactComponent as ProgrammingIcon } from "../assets/images/icons/programming.svg";
import { ReactComponent as BugIcon } from "../assets/images/icons/bug.svg";
import { ReactComponent as CreativityIcon } from "../assets/images/icons/creativity.svg";
import { ReactComponent as TeamworkIcon } from "../assets/images/icons/teamwork.svg";
import { ReactComponent as UXIcon } from "../assets/images/icons/ux.svg";

import "../assets/styles/cards.css";

export const CORE_EXPERTISE = [
  {
    id: "ui-ux",
    title: "UI / UX Design",
    summary: "Designing intuitive digital experiences that balance user needs, business goals, and visual clarity.",
    focus: ["User flows", "Wireframing", "Interaction design"],
  },
  {
    id: "webdesign",
    title: "Web Design",
    summary: "Creating modern, responsive websites that strengthen brands and improve the user journey.",
    focus: ["Visual design", "Design systems", "Conversion-focused layouts"],
  },
  {
    id: "frontend",
    title: "Front-End Development",
    summary: "Translating designs into responsive, production-ready experiences with clean, maintainable code.",
    focus: ["HTML5 & CSS3", "JavaScript", "Cross-browser support", "Component-driven UI", "State & data flow"],
  },
  {
    id: "responsive",
    title: "Responsive Design",
    summary: "Building seamless experiences across desktop, tablet, and mobile through mobile-first thinking.",
    focus: ["Adaptive layouts", "Mobile optimization", "Touch-first experiences", "Container queries"],
  },
  {
    id: "animation",
    title: "Animation & Motion",
    summary: "Scroll-driven and interaction-led motion that guides attention without stealing focus.",
    focus: ["View timelines", "Micro-interactions", "Reduced-motion respect"],
  },
  {
    id: "wordpress",
    title: "WordPress Development",
    summary: "Customizing and managing scalable WordPress websites that balance flexibility and performance.",
    focus: ["Theme customization", "Content migrations", "CMS optimization"],
  },
  {
    id: "a11y",
    title: "Accessibility",
    summary: "Designing and developing inclusive experiences that improve usability for all users.",
    focus: ["WCAG standards", "ARIA semantics", "Semantic structure", "Keyboard navigation", "Screen reader clarity"],
  },
  {
    id: "performance",
    title: "Performance Optimization",
    summary: "Improving speed, stability, and user experience through thoughtful optimization strategies.",
    focus: ["Core Web Vitals", "Code splitting", "Lazy loading", "Asset optimization", "Technical SEO"],
  },
  {
    id: "systems",
    title: "Design Systems",
    summary: "Creating scalable design foundations that promote consistency across products and teams.",
    focus: ["Component libraries", "Variant APIs", "Style standards", "Documentation"],
  },
  {
    id: "mentor",
    title: "Collaboration & Leadership",
    summary: "Partnering with stakeholders, developers, and designers while mentoring teams and driving quality.",
    focus: ["Cross-functional teams", "Client collaboration", "Mentorship"],
  },
];

export const CAPABILITY_CALLOUT = [
  {
    id: "interface",
    label: "Interface Layer",
    tag: "UI",
    description: "Where design intent becomes interactive, tactile surfaces, layout, typography, and component behavior working as one system.",
    capabilities: ["Component composition", "Layout systems", "Visual hierarchy", "Interaction states"],
    related: ["react", "css", "responsive"],
    base: "var(--base-1)",
    accent: "var(--accent-1)",
  },
  {
    id: "architecture",
    label: "Architecture",
    tag: "SYS",
    description: "The structural backbone, how code is organized, shared, and extended without creating fragility downstream.",
    capabilities: ["Folder conventions", "Shared primitives", "Config-driven UI", "Composable hooks"],
    related: ["react", "js-ts", "systems"],
    base: "var(--base-2)",
    accent: "var(--accent-2)",
  },
  {
    id: "experience",
    label: "Experience",
    tag: "UX",
    description: "Motion, feedback, and flow that make interfaces feel intentional, never decorative for decoration's sake.",
    capabilities: ["Scroll choreography", "State transitions", "Loading patterns", "Error recovery"],
    related: ["motion", "a11y", "perf"],
    base: "var(--base-3)",
    accent: "var(--accent-3)",
  },
  {
    id: "delivery",
    label: "Delivery",
    tag: "SHIP",
    description: "From Figma frames to production deploys, tight design-to-code loops with quality gates at every handoff.",
    capabilities: ["Design handoff", "Build pipelines", "QA workflows", "Release readiness"],
    related: ["frontend", "perf", "systems"],
    base: "var(--base-4)",
    accent: "var(--accent-4)",
  },
  {
    id: "craft",
    label: "Craft",
    tag: "REFINE",
    description: "The details that separate good from exceptional, spacing rhythm, contrast, polish, and accessibility as craft.",
    capabilities: ["Pixel refinement", "Token alignment", "Edge-case handling", "Documentation"],
    related: ["css", "a11y", "responsive"],
    base: "var(--base-5)",
    accent: "var(--accent-5)",
  },
];

export const TECH_STACK = [
  {
    id: "frontend",
    label: "Languages",
    items: [
      { id: "html", name: "HTML5", icon: <HTMLIcon /> },
      { id: "css", name: "CSS / SCSS", icon: <CSSIcon /> },
      { id: "js", name: "JavaScript", icon: <JavascriptIcon /> },
      { id: "ts", name: "TypeScript", icon: <TypescriptIcon /> },
      { id: "php", name: "PHP", icon: <PHPIcon /> },
      { id: "json",  name: "JSON", icon: <JSONIcon /> },
      { id: "xml",   name: "XML", icon: <XMLIcon /> },
      { id: "xslt",  name: "XSLT", icon: <XSLTIcon /> },      
    ],
  },
  {
    id: "frameworks",
    label: "Frameworks & Libraries",
    items: [
      { id: "react", name: "React", icon: <ReactIcon /> },
      { id: "jq", name: "jQuery", icon: <JqueryIcon /> },
      { id: "bootstrap", name: "Bootstrap", icon: <BootstrapIcon /> },
      { id: "foundation", name: "Foundation", icon: <FoundationIcon /> },
    ],
  },
  {
    id: "platforms",
    label: "Platforms & CMS",
    items: [
      { id: "wordpress", name: "WordPress", icon: <WordpressIcon /> },
      { id: "elementor", name: "Elementor", icon: <ElementorIcon /> },
      { id: "cpanel", name: "cPanel / WHM", icon: <CPANELIcon /> },
      { id: "dealers", name: "Dealer.com", icon: <DealerdotcomIcon /> },
      { id: "dealerdotcom", name: "DealerSocket", icon: <DealersocketIcon /> },
      { id: "homenet", name: "Homenet", icon: <HomenetIcon /> },
      { id: "vauto", name: "vAuto", icon: <VAUTOIcon /> },
    ],
  },
  {
    id: "creative",
    label: "Design Tools",
    items: [
      { id: "figma", name: "Figma", icon: <FitmaIcon /> },
      { id: "xd", name: "Adobe XD", icon: <XDIcon /> },
      { id: "photoshop", name: "Photoshop", icon: <PhotoshopIcon /> },
      { id: "illustrator", name: "Illustrator", icon: <IllustratorIcon /> },
      { id: "inkscape", name: "Inkscape", icon: <InkscapeIcon /> },
    ],
  },
  {
    id: "delivery",
    label: "Build & Workflow",
    items: [
      { id: "vite", name: "Vite", icon: <ViteIcon /> },
      { id: "git", name: "Git", icon: <GitIcon /> },
      { id: "github", name: "GitHub", icon: <GithubIcon /> },
      { id: "vs", name: "VS Code", icon: <VSIcon /> },
      { id: "npm", name: "npm", icon: <NPMIcon /> },
    ],
  },
  {
    id: "ai",
    label: "AI Tools",
    items: [
      { id: "claude", name: "Claude" },
      { id: "gpt", name: "ChatGPT" },
      { id: "ollama", name: "Ollama" },
      { id: "grok", name: "Grok" },
      { id: "codex", name: "Codex" },
    ],
  },
];

export const EXPERIENCE_HIGHLIGHTS = [
  {
    id: "production",
    index: "01",
    title: "Production Applications",
    description: "Shipping responsive, high-traffic interfaces for automotive and enterprise clients—600+ sites modernized and maintained in production.",
    icon: <ApplicationIcon />,
  },
  {
    id: "design-code",
    index: "02",
    title: "Design-to-Code Workflows",
    description: "Translating Figma systems into token-aligned component libraries with pixel fidelity and developer-friendly APIs.",
    icon: <DesignIcon />,
  },
  {
    id: "performance",
    index: "03",
    title: "Performance Optimization",
    description: "Auditing render paths, bundle weight, and interaction latency—making measurable gains in load time and scroll smoothness.",
    icon: <ResponsiveDesignIcon />,
  },
  {
    id: "components",
    index: "04",
    title: "Component Architecture",
    description: "Building composable, documented primitives that teams can extend without breaking visual or behavioral consistency.",
    icon: <UIIcon />,
  },
  {
    id: "ui-engineering",
    index: "05",
    title: "UI Engineering",
    description: "Bridging design and engineering—owning the full surface from layout logic to interaction polish and accessibility.",
    icon: <ProgrammingIcon />,
  },
  {
    id: "interactive",
    index: "06",
    title: "Interactive Experiences",
    description: "Scroll-driven narratives, magnetic interactions, and motion systems that reinforce content without overwhelming it.",
    icon: <BugIcon />,
  },
];

export const DEV_PHILOSOPHY = [
  {
    id: "intent",
    title: "Intent before implementation",
    body: "Every interface decision should trace back to a user need or business goal. Code is the medium—not the message.",
  },
  {
    id: "systems",
    title: "Systems over one-offs",
    body: "Reusable patterns, shared tokens, and documented components compound over time. One-off solutions create long-term debt.",
  },
  {
    id: "accessible",
    title: "Accessible by default",
    body: "Accessibility isn't a final pass—it's woven into structure, interaction, and motion from the first commit.",
  },
  {
    id: "motion",
    title: "Motion with purpose",
    body: "Animation should clarify hierarchy and guide attention. If it doesn't serve the content, it doesn't belong.",
  },
  {
    id: "craft",
    title: "Craft in the details",
    body: "Spacing rhythm, typographic nuance, and edge-case handling are what separate polished interfaces from merely functional ones.",
  },
  {
    id: "iterate",
    title: "Ship, measure, refine",
    body: "Production feedback beats theoretical perfection. Iterate with data, user signals, and team input—not assumptions.",
  },
];

export const ABOUT_PRINCIPLES = [
  {
    id: "clarity",
    title: "Clarity before execution",
    body: "I focus on understanding the problem deeply before jumping into solutions. Clear goals, expectations, and constraints prevent most downstream issues.",
  },
  {
    id: "structure",
    title: "Structure enables speed",
    body: "Good systems, clean communication, and well-defined ownership create momentum. I believe speed comes from stability, not chaos.",
  },
  {
    id: "people",
    title: "People over process",
    body: "I prioritize healthy collaboration and trust, while ensuring enough process exists to keep work predictable and scalable.",
  },
  {
    id: "calm",
    title: "Stay calm, solve early",
    body: "I don’t react to pressure, I reduce it. I aim to spot friction early, de-escalate when needed, and keep teams focused on forward progress.",
  },
];

export const ABOUT_WHAT = [
  {
    id: "impact",
    title: "Value Delivered",
    body: ["Beyond design and development, I bring a strong understanding of how digital products are planned, delivered, and maintained. Throughout my career, I've worked closely with designers, developers, marketers, product owners, and stakeholders to align business goals with user needs.", "I enjoy bringing clarity to complex projects, whether that means establishing design standards, improving development workflows, mentoring team members, or helping teams make thoughtful technical decisions. My goal is always the same: build products that are easier to use, easier to maintain, and easier for teams to evolve over time."],
    icon: <CreativityIcon />,
  },
  {
    id: "intent",
    title: "Designing With Purpose",
    body: ["Good interfaces are not just visually appealing; they help people accomplish tasks with confidence.", "Every design decision should serve a purpose. Whether I'm creating a landing page, a product feature, or a complete website experience, I focus on usability, accessibility, performance, and long-term maintainability. I believe the best experiences often feel effortless because the complexity has been thoughtfully solved behind the scenes.", "The details matter, but only when they support the larger experience."],
    icon: <DesignIcon />,
  },
  {
    id: "stewardship",
    title: "Leadership & Mentorship",
    body: ["Over the years, my role has expanded beyond individual contributions into helping others succeed.", "I've mentored designers and developers, guided project teams, reviewed work, and helped establish standards that improve consistency across products. I enjoy creating environments where people can do their best work by providing structure, support, and clear communication.", "Leadership, to me, is not about directing every decision. It's about creating clarity, removing obstacles, and helping teams move forward together."],
    icon: <UXIcon />,
  },
  {
    id: "collaboration",
    title: "Working Together",
    body: ["I value transparency, accountability, and collaboration.", "The best projects happen when people communicate openly, challenge ideas respectfully, and stay focused on shared goals. I enjoy working with teams that care deeply about quality while remaining practical about timelines, priorities, and business needs.", "Whether I'm contributing as a designer, developer, technical lead, or collaborator, I strive to be someone people can rely on when projects become complex or challenging."],
    icon: <TeamworkIcon />,
  },
];