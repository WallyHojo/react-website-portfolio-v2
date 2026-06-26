import workECPrecisionShine from "../assets/images/work/cards/ec-precision-shine_img.webp";
import workCalibright from "../assets/images/work/cards/calibright_img.webp";
import workEnhancedLeads from "../assets/images/work/cards/enhanced-automotive-leads_img.webp";
import workUIExplorer from "../assets/images/work/cards/ui-explorer_img.webp";

import "../assets/styles/cards.css";

export const PROJECT_CATEGORIES = ["All", "Web", "Dashboard"];

export const WORK_HIGHLIGHTS = [
  {
    id: "scale",
    index: "01",
    title: "600+ Sites Modernized",
    description:
      "Led responsive transitions across hundreds of dealership websites, unifying desktop and mobile into cohesive, maintainable experiences.",
  },
  {
    id: "conversion",
    index: "02",
    title: "Conversion-Focused Systems",
    description:
      "Built lead-generation tools with trade-in valuations and payment estimators designed to turn browsing into qualified inquiries.",
  },
  {
    id: "workflow",
    index: "03",
    title: "Technician Workflow Portals",
    description:
      "Delivered ADAS calibration dashboards that streamline diagnostics, scheduling, and service management for field teams.",
  },
  {
    id: "craft",
    index: "04",
    title: "Design-to-Code Precision",
    description:
      "Translated high-fidelity concepts into production interfaces with token-aligned styling, accessible patterns, and performance budgets.",
  },
];

const sharedStack = {
  frontend: ["React", "JavaScript", "HTML", "CSS / SCSS"],
  tooling: ["Vite", "Git", "Figma"],
};

export const PROJECTS = [
  {
    slug: "ec-precision-shine",
    title: "EC Precision Shine",
    shortTitle: "Precision Shine",
    tag: "Web",
    category: "Web",
    year: "2025",
    featured: true,
    featuredOrder: 1,
    image: workECPrecisionShine,
    heroImage: workECPrecisionShine,
    backgroundColor: "#191919",
    accentColor: "#2979ff",
    role: "UI Engineer & Front-End Developer",
    timeline: "8 weeks",
    overview:
      "A premium automotive detailing brand needed a digital presence that matched the craftsmanship of their ceramic coating and restoration work, refined, confident, and built to convert high-intent visitors.",
    technologies: ["React", "CSS Architecture", "Responsive Design", "Performance Optimization", "WordPress"],
    summary: {
      challenge:
        "The existing site undersold the brand's premium positioning. Photography was strong, but the interface felt generic, weak hierarchy, slow load times, and no clear path from inspiration to booking.",
      goals: [
        "Elevate brand perception through editorial layout and typography",
        "Create a mobile-first experience that showcases services clearly",
        "Improve inquiry flow without adding friction",
      ],
      objectives: [
        "Reduce time-to-first-meaningful-paint on mobile",
        "Establish a reusable component structure for future service pages",
        "Align visual language with in-person brand quality",
      ],
    },
    discovery: {
      problem:
        "High-end detailing clients research extensively before committing. The site needed to communicate expertise, build trust quickly, and guide visitors toward consultation, not overwhelm them with options.",
      research: [
        "Competitive audit of premium automotive service sites",
        "Content hierarchy mapping for service tiers and packages",
        "Mobile scroll behavior analysis for image-heavy layouts",
      ],
      planning: [
        "Defined a content-first page architecture before visual design",
        "Mapped primary user journeys: discover → evaluate → inquire",
        "Established performance budgets aligned with image-rich storytelling",
      ],
    },
    design: {
      wireframes:
        "Low-fidelity layouts focused on service hierarchy and CTA placement, testing whether editorial full-bleed imagery or contained galleries better supported conversion.",
      exploration:
        "Explored dark, gallery-forward aesthetics with high-contrast typography to mirror the studio's premium atmosphere while keeping body copy readable across devices.",
      decisions: [
        "Large-format imagery with restrained UI chrome",
        "Service cards with scannable benefit lines, not dense paragraphs",
        "Sticky inquiry CTA on mobile after scroll threshold",
      ],
      systems:
        "Token-based spacing and type scale ensured consistency across service, gallery, and contact pages without one-off CSS exceptions.",
    },
    development: {
      architecture:
        "Component-driven React structure with route-level code splitting. Shared layout primitives for hero, service grid, and testimonial modules.",
      decisions: [
        "CSS custom properties for theming and responsive spacing",
        "Semantic HTML landmarks for accessibility and SEO structure",
        "Optimized image delivery with responsive srcsets",
      ],
      performance: [
        "Lazy-loaded below-fold imagery",
        "Minimal runtime JavaScript for static content sections",
        "Font subsetting and preloaded critical assets",
      ],
      challenges: [
        "Balancing image quality with mobile bandwidth constraints",
        "Maintaining visual drama without sacrificing load performance",
        "Cross-browser consistency for scroll-driven reveal animations",
      ],
    },
    features: [
      {
        title: "Editorial Service Showcase",
        description:
          "Full-width imagery paired with concise service descriptions, designed to feel like a curated portfolio, not a price list.",
      },
      {
        title: "Guided Inquiry Flow",
        description:
          "Context-aware CTAs placed at natural decision points, reducing drop-off between inspiration and contact.",
      },
      {
        title: "Responsive Gallery System",
        description:
          "Adaptive image grids that preserve aspect ratios and visual rhythm from mobile through desktop breakpoints.",
      },
    ],
    results: {
      achievements: [
        "Delivered a production-ready interface aligned with premium brand positioning",
        "Established a component library reusable across future service expansions",
        "Improved mobile readability and navigation clarity",
      ],
      improvements: [
        "Faster perceived load through progressive image rendering",
        "Clearer service differentiation for first-time visitors",
        "More consistent cross-page visual language",
      ],
      lessons: [
        "Premium brands benefit more from editorial restraint than feature density",
        "Performance and aesthetics are not opposing goals when planned early",
      ],
    },
    gallery: [
      { src: workECPrecisionShine, alt: "EC Precision Shine homepage hero", caption: "Homepage hero with editorial service positioning" },
      { src: workECPrecisionShine, alt: "EC Precision Shine service layout", caption: "Service showcase with high-contrast typography" },
    ],
    stack: [
      { category: "Interface", items: ["React", "CSS Architecture", "Responsive Layouts"] },
      { category: "Content", items: ["WordPress", "Optimized Media", "Semantic HTML"] },
      { category: "Quality", items: ["Accessibility", "Performance Budgets", "Cross-browser QA"] },
    ],
    seo: {
      title: "EC Precision Shine ,  Case Study | Walter Carlson",
      description:
        "Premium automotive detailing website, editorial design, responsive architecture, and performance-focused front-end development.",
    },
  },
  {
    slug: "calibright-adas-portal",
    title: "Calibright ADAS Portal",
    shortTitle: "ADAS Portal",
    tag: "Dashboard",
    category: "Dashboard",
    year: "2026",
    featured: true,
    featuredOrder: 2,
    image: workCalibright,
    heroImage: workCalibright,
    backgroundColor: "#84431d",
    accentColor: "#e8a87c",
    role: "UI Engineer & Product Interface Developer",
    timeline: "12 weeks",
    overview:
      "An ADAS calibration portal built for technician workflows, diagnostics, scheduling, and service management unified in a dashboard designed for speed, clarity, and field usability.",
    technologies: ["React", "TypeScript", "Dashboard UI", "Component Architecture", "Accessibility"],
    summary: {
      challenge:
        "Technicians needed a single interface to manage calibration workflows, but existing tools were fragmented, slow to navigate, visually inconsistent, and difficult to use under time pressure.",
      goals: [
        "Consolidate critical workflow actions into a scannable dashboard",
        "Reduce cognitive load during high-stakes diagnostic sessions",
        "Build a scalable component system for future module expansion",
      ],
      objectives: [
        "Achieve sub-second interaction feedback on primary actions",
        "Support keyboard and screen reader navigation for all core flows",
        "Design data-dense views that remain legible on mid-size screens",
      ],
    },
    discovery: {
      problem:
        "Field technicians operate in interrupt-driven environments. The portal had to surface status, next actions, and diagnostic context without requiring deep navigation.",
      research: [
        "Workflow shadowing with calibration technicians",
        "Task analysis for scheduling, diagnostics, and reporting paths",
        "Audit of existing tool pain points and error recovery patterns",
      ],
      planning: [
        "Prioritized information hierarchy by frequency and urgency",
        "Defined dashboard zones: status, actions, detail, history",
        "Mapped role-based views for technicians vs. service managers",
      ],
    },
    design: {
      wireframes:
        "Explored dense data table layouts vs. card-based status modules, testing which format supported faster scan times for active job queues.",
      exploration:
        "Warm neutral palette with high-contrast status indicators. Deliberately avoided generic SaaS blue to differentiate workflow states clearly.",
      decisions: [
        "Persistent status rail for at-a-glance job health",
        "Progressive disclosure for secondary diagnostic details",
        "Consistent action placement across all module views",
      ],
      systems:
        "Dashboard component primitives, status chips, data panels, action bars, documented with variant APIs for team extension.",
    },
    development: {
      architecture:
        "Modular React architecture with typed props, shared layout shells, and lazy-loaded feature modules to keep initial bundle lean.",
      decisions: [
        "Container/presentational split for testable UI logic",
        "Optimistic UI patterns for scheduling actions",
        "Centralized token system for spacing, color, and elevation",
      ],
      performance: [
        "Virtualized lists for large job histories",
        "Memoized selectors for dashboard aggregate views",
        "Route-based code splitting per workflow module",
      ],
      challenges: [
        "Presenting dense diagnostic data without overwhelming technicians",
        "Maintaining state consistency across concurrent workflow updates",
        "Designing touch-friendly targets for workshop tablet usage",
      ],
    },
    features: [
      {
        title: "Unified Workflow Dashboard",
        description:
          "Single-view access to active jobs, diagnostic status, and scheduling, reducing context switching during service sessions.",
      },
      {
        title: "Diagnostic Context Panels",
        description:
          "Expandable detail regions that surface technical data on demand without cluttering the primary workspace.",
      },
      {
        title: "Scheduling & Service Management",
        description:
          "Integrated calendar and job queue views with clear status semantics and actionable next-step prompts.",
      },
    ],
    results: {
      achievements: [
        "Delivered a cohesive portal replacing fragmented workflow tools",
        "Reduced navigation depth for core technician tasks",
        "Established a dashboard design system for future modules",
      ],
      improvements: [
        "Faster scan times for active job status",
        "Clearer error states and recovery paths",
        "More consistent interaction patterns across modules",
      ],
      lessons: [
        "Operational UIs require ruthless hierarchy, every pixel must earn its place",
        "Design systems accelerate dashboard work when tokens precede components",
      ],
    },
    gallery: [
      { src: workCalibright, alt: "Calibright ADAS Portal dashboard", caption: "Primary dashboard with status rail and job queue" },
      { src: workCalibright, alt: "Calibright diagnostic workflow", caption: "Diagnostic context panel with progressive disclosure" },
    ],
    stack: [
      { category: "Application", items: ["React", "TypeScript", "Component Architecture"] },
      { category: "Experience", items: ["Dashboard UI", "Data Visualization", "Responsive Layouts"] },
      { category: "Standards", items: ["Accessibility", "Design Tokens", "Performance"] },
    ],
    seo: {
      title: "Calibright ADAS Portal ,  Case Study | Walter Carlson",
      description:
        "ADAS calibration portal for technician workflows, dashboard design, component architecture, and accessible interface engineering.",
    },
  },
  {
    slug: "enhanced-auto-leads",
    title: "Enhanced Auto Leads",
    shortTitle: "Lead Generator",
    tag: "Web",
    category: "Web",
    year: "2023",
    featured: true,
    featuredOrder: 3,
    image: workEnhancedLeads,
    heroImage: workEnhancedLeads,
    backgroundColor: "#2d5476",
    accentColor: "#4c94ff",
    role: "Front-End Developer & UI Engineer",
    timeline: "10 weeks",
    overview:
      "An automotive lead-generation platform combining trade-in valuations, payment estimators, and conversion tools, engineered to turn dealership traffic into qualified customer inquiries.",
    technologies: ["React", "JavaScript", "Form Architecture", "Responsive Design", "Performance"],
    summary: {
      challenge:
        "Dealership sites needed embedded tools that felt native to the brand while reliably capturing leads. Existing widgets were either visually disjointed or too friction-heavy to complete on mobile.",
      goals: [
        "Build high-converting estimator tools with minimal friction",
        "Ensure visual consistency across diverse dealership brands",
        "Maintain performance when embedded in third-party environments",
      ],
      objectives: [
        "Reduce form abandonment on mobile completion flows",
        "Create a theming layer adaptable per dealership",
        "Validate inputs with clear, accessible error messaging",
      ],
    },
    discovery: {
      problem:
        "Car shoppers evaluate payments and trade-in value early in their journey. Tools needed to deliver instant feedback while capturing enough data for sales follow-up.",
      research: [
        "Funnel analysis of existing lead form completion rates",
        "Mobile form usability testing across device sizes",
        "Dealership brand audit for theming requirements",
      ],
      planning: [
        "Separated calculator logic from presentation layer",
        "Designed multi-step flows with save-state persistence",
        "Defined embed contract for host site integration",
      ],
    },
    design: {
      wireframes:
        "Tested single-page vs. stepped form patterns, measuring completion rates and perceived effort on mobile devices.",
      exploration:
        "Clean, trust-forward UI with prominent result displays. Minimized decorative elements to keep focus on numbers and next actions.",
      decisions: [
        "Stepped flows with visible progress indicators",
        "Inline validation with human-readable error copy",
        "Results screen as conversion moment with clear CTA",
      ],
      systems:
        "Theme tokens for color, radius, and typography allowed per-dealership customization without forked codebases.",
    },
    development: {
      architecture:
        "Embeddable React widgets with isolated styles and configurable theme props. Shared validation and calculation utilities across estimator types.",
      decisions: [
        "Controlled form state with accessible field associations",
        "Debounced calculations to reduce unnecessary re-renders",
        "Graceful degradation when embedded in legacy host pages",
      ],
      performance: [
        "Lightweight bundle footprint for embed scenarios",
        "Deferred loading of non-critical UI enhancements",
        "Optimized re-render paths for live calculation updates",
      ],
      challenges: [
        "Styling isolation within unpredictable host environments",
        "Balancing data collection depth with form completion rates",
        "Cross-browser consistency for numeric input behaviors",
      ],
    },
    features: [
      {
        title: "Trade-In Valuation Tool",
        description:
          "Guided input flow delivering instant valuation feedback with dealership-branded presentation.",
      },
      {
        title: "Payment Estimator",
        description:
          "Real-time payment calculations with transparent breakdowns that build buyer confidence.",
      },
      {
        title: "Lead Capture Integration",
        description:
          "Seamless handoff from calculator results to qualified inquiry submission.",
      },
    ],
    results: {
      achievements: [
        "Shipped embeddable tools deployed across multiple dealership properties",
        "Improved mobile form completion through stepped flow design",
        "Built theming system supporting brand variation without code forks",
      ],
      improvements: [
        "Clearer validation feedback reduced user error loops",
        "Faster time-to-result on calculator interactions",
        "More consistent embed behavior across host environments",
      ],
      lessons: [
        "Conversion tools succeed when friction is removed step by step, not all at once",
        "Embeddable architecture demands strict style isolation from day one",
      ],
    },
    gallery: [
      { src: workEnhancedLeads, alt: "Enhanced Auto Leads platform", caption: "Lead-generation platform with estimator tools" },
      { src: workEnhancedLeads, alt: "Payment estimator interface", caption: "Payment estimator with stepped form flow" },
    ],
    stack: [
      { category: "Interface", items: [...sharedStack.frontend] },
      { category: "Conversion", items: ["Form Architecture", "Input Validation", "Multi-step Flows"] },
      { category: "Deployment", items: ["Embeddable Widgets", "Theme Tokens", "Performance"] },
    ],
    seo: {
      title: "Enhanced Auto Leads ,  Case Study | Walter Carlson",
      description:
        "Automotive lead-generation platform with trade-in valuations and payment estimators, conversion-focused front-end engineering.",
    },
  },
  {
    slug: "interactive-component-explorer",
    title: "Interactive Component Explorer",
    shortTitle: "UI Explorer",
    tag: "Web",
    category: "Web",
    year: "2026",
    featured: true,
    featuredOrder: 4,
    image: workUIExplorer,
    heroImage: workUIExplorer,
    backgroundColor: "#1a1a2a",
    accentColor: "#7b8cff",
    role: "UI Engineer & Creative Developer",
    timeline: "6 weeks",
    overview:
      "A living component explorer for interactive UI patterns, responsive layouts, animation systems, theme switching, and real-time behavior previews in a single curated environment.",
    technologies: ["React", "CSS Architecture", "Animation", "Design Systems", "Accessibility"],
    summary: {
      challenge:
        "Documenting interactive components in static screenshots failed to communicate behavior. The team needed a live environment to preview, test, and share UI patterns with accurate motion and state.",
      goals: [
        "Create an interactive catalog of production-ready components",
        "Demonstrate responsive and motion behavior in real time",
        "Provide a reference tool for design-to-code alignment",
      ],
      objectives: [
        "Support theme switching without full page reload",
        "Ensure keyboard navigability across all demo interactions",
        "Keep demo pages performant despite animation-heavy previews",
      ],
    },
    discovery: {
      problem:
        "Scattered component examples across repos and Storybook instances created inconsistency. A unified explorer would centralize patterns and raise the bar for interaction quality.",
      research: [
        "Inventory of existing components and undocumented variants",
        "Developer and designer interviews on documentation gaps",
        "Benchmarking of live component gallery experiences",
      ],
      planning: [
        "Categorized components by interaction type and complexity",
        "Defined demo templates: isolated, composed, and scroll-driven",
        "Established motion guidelines for consistent preview behavior",
      ],
    },
    design: {
      wireframes:
        "Sidebar navigation with live preview canvas, testing split-pane vs. overlay navigation for mobile demo browsing.",
      exploration:
        "Dark interface with accent-driven focus states. Preview canvas treated as a stage with minimal chrome to spotlight component behavior.",
      decisions: [
        "Persistent nav with filterable component categories",
        "Live theme toggle demonstrating token-driven styling",
        "Code-adjacent layout pairing preview with usage context",
      ],
      systems:
        "Documented token layers and component APIs alongside each preview, bridging design system specs and implementation.",
    },
    development: {
      architecture:
        "Route-per-component demos with shared preview shell. Centralized theme provider and motion configuration injected into all examples.",
      decisions: [
        "CSS custom properties for runtime theme switching",
        "Shared scroll-animation attributes matching portfolio motion language",
        "Isolated demo state to prevent cross-component interference",
      ],
      performance: [
        "Lazy-loaded demo modules per navigation entry",
        "Reduced-motion media query respected across all animations",
        "GPU-friendly transforms for preview interactions",
      ],
      challenges: [
        "Keeping demo complexity representative without bloating bundles",
        "Synchronizing theme changes across disparate component styles",
        "Documenting behavior that only emerges during interaction",
      ],
    },
    features: [
      {
        title: "Live Component Previews",
        description:
          "Interactive demos with real states, hover behaviors, and transitions, not static thumbnails.",
      },
      {
        title: "Theme & Token Switching",
        description:
          "Runtime theme controls demonstrating how design tokens propagate through component variants.",
      },
      {
        title: "Motion Showcase",
        description:
          "Scroll-driven and interaction-led animation examples aligned with portfolio motion principles.",
      },
    ],
    results: {
      achievements: [
        "Centralized component reference used across design and development handoffs",
        "Reduced ambiguity in motion and state behavior expectations",
        "Created a reusable template for documenting future components",
      ],
      improvements: [
        "Faster onboarding for new UI patterns",
        "More consistent animation language across projects",
        "Clearer design-to-code alignment on variant APIs",
      ],
      lessons: [
        "Live behavior documentation prevents costly misinterpretation during handoff",
        "The best component galleries are curated, not exhaustive",
      ],
    },
    gallery: [
      { src: workUIExplorer, alt: "UI Explorer component catalog", caption: "Component explorer with live preview canvas" },
      { src: workUIExplorer, alt: "UI Explorer theme switching", caption: "Theme switching demonstrating design token propagation" },
    ],
    stack: [
      { category: "Interface", items: ["React", "CSS Architecture", "Animation Systems"] },
      { category: "Systems", items: ["Design Tokens", "Component APIs", "Theme Provider"] },
      { category: "Documentation", items: ["Live Previews", "Accessibility", "Motion Guidelines"] },
    ],
    seo: {
      title: "Interactive Component Explorer ,  Case Study | Walter Carlson",
      description:
        "Live UI component explorer with responsive layouts, animation systems, and theme switching, design system engineering in practice.",
    },
  },
];

export function getProjectBySlug(slug) {
  return PROJECTS.find((project) => project.slug === slug) ?? null;
}

export function getFeaturedProjects() {
  return [...PROJECTS]
    .filter((project) => project.featured)
    .sort((a, b) => a.featuredOrder - b.featuredOrder);
}

export function getProjectsByCategory(category) {
  if (category === "All") return PROJECTS;
  return PROJECTS.filter((project) => project.category === category);
}

export function getAdjacentProjects(slug) {
  const index = PROJECTS.findIndex((project) => project.slug === slug);
  if (index === -1) return { prev: null, next: null };

  return {
    prev: index > 0 ? PROJECTS[index - 1] : null,
    next: index < PROJECTS.length - 1 ? PROJECTS[index + 1] : null,
  };
}

/** Home page horizontal scroll ,  includes explore CTA card */
export function toWorkListEntries() {
  const entries = PROJECTS.map((project) => ({
    label: project.title,
    title: project.shortTitle,
    tag: project.tag,
    image: project.image,
    description: project.overview,
    link: `/work/${project.slug}`,
    backgroundColor: project.backgroundColor,
  }));

  entries.push({
    label: "Explore Work",
    title: "Explore Work",
    tag: "Legacy",
    description:
      "View all projects and discover the process behind the work, from strategy and design to final implementation.",
    symbol: ">",
    link: "/work",
    linkLabel: "View work",
    backgroundColor: "#ffffff15",
  });

  return entries;
}