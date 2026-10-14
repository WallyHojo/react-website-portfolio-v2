// Resume content, transcribed from public/walter-carlson-resume.pdf.
// Plain data (no JSX / asset imports) so scripts/prerender.js can read it too.
// Phone and email are intentionally left out of the web page; the contact form
// and the downloadable PDF cover those.

export const RESUME_PDF = "/walter-carlson-resume.pdf";

export const RESUME_SUMMARY = {
  headline: "Design Engineer",
  body: "Design Engineer with 10+ years of experience blending front-end development and UI/UX design to build responsive, user-centered web applications. Proven ability to design, develop, and optimize high-performing interfaces across hundreds of client websites. Strong background in visual design, accessibility, and performance tuning, with a track record of improving usability and delivering scalable digital solutions.",
  facts: [
    { label: "Location", value: "Bellevue, Washington" },
    { label: "Availability", value: "October 2026" },
    { label: "Work authorization", value: "US Citizen" },
    { label: "LinkedIn", value: "in/walter-carlson-918b6b305", href: "https://www.linkedin.com/in/walter-carlson-918b6b305/" },
  ],
};

// Figures quoted directly from the experience bullets below
export const RESUME_STATS = [
  { key: "sites-owned", label: "Client websites owned", value: "600", suffix: "+" },
  { key: "redesigned", label: "Legacy sites made responsive", value: "300", suffix: "+" },
  { key: "page-time", label: "Faster page creation", value: "70", prefix: "~", suffix: "%" },
  { key: "update-points", label: "Fewer manual update points", value: "83", prefix: "~", suffix: "%" },
];

export const RESUME_EXPERIENCE = [
  {
    id: "dealeron",
    role: "Web Designer / UI Engineer",
    company: "DealerOn",
    location: "Rockville, MD (Remote)",
    start: "Jan 2025",
    end: "Dec 2025",
    highlights: [
      "Led full-cycle website migration projects, preserving SEO rankings, design integrity, and content structure through complex platform transitions.",
      "Developed a custom browser extension to automate bulk field page edits within the CMS during website migrations, reducing manual work by approximately ~22%.",
      "Centralized dealer data in a global JSON structure, cutting manual update points by ~83% for multi-page data instances.",
      "Customized layouts and templates to align with client branding and UX requirements, delivering both CMS-based and custom-coded solutions.",
      "Diagnosed and resolved cross-device UI issues, improving accessibility and mobile responsiveness across desktop, tablet, and mobile experiences.",
      "Collaborated with developers, project managers, and stakeholders to deliver high-quality user experiences.",
      "Mentored junior and mid-level designers, improving UI consistency, code quality, and troubleshooting of console and visual errors.",
      "Migrated and rebuilt WordPress content while preserving visual consistency with existing themes, minimizing disruption to live, in-production client sites.",
    ],
  },
  {
    id: "fusionzone",
    role: "Senior Frontend Web Developer / UI Engineer",
    company: "fusionZONE",
    location: "Lakeland, FL (Remote)",
    start: "May 2018",
    end: "July 2024",
    highlights: [
      "Owned UI/UX and front-end performance for 600+ client websites, ensuring scalability, usability, and consistent updates at scale.",
      "Built custom UI components and widgets to integrate product features and streamline development workflows.",
      "Designed and developed a touch-optimized navigation system for automotive platforms, cutting browsing time by an estimated ~12% and improving mobile usability.",
      "Designed a multi-tab, enhanced form lead generator in Adobe XD, covering data capture and payment interface flows for a user-focused experience.",
      "Led modernization initiatives by migrating legacy web systems to responsive, mobile-first architectures using modern HTML5 standards.",
      "Delivered responsive WordPress solutions for automotive service and trade businesses, partnering with My Shop Manager, Lead Revenue, and Bolt On Media to improve digital presence and customer engagement.",
      "Collaborated with back-end teams to redesign applications, moving from Foundation to Bootstrap frameworks to improve long-term maintainability.",
      "Mentored three junior developers in HTML/CSS best practices, responsive design, and UI consistency, raising the technical bar across the team.",
      "Provided front-end support for automotive inventory systems, enhancing usability and interface clarity.",
    ],
  },
  {
    id: "motorwebs",
    role: "Frontend Web Developer",
    company: "Motorwebs",
    location: "Redmond, WA (On-site)",
    start: "May 2008",
    end: "May 2018",
    highlights: [
      "Managed and maintained 400+ client websites, ensuring performance, reliability, and high-quality user experiences at scale.",
      "Redesigned 300+ legacy websites into responsive, mobile-friendly interfaces using Bootstrap, modernizing the majority of the active client base.",
      "Developed jQuery automation scripts to parse manufacturer HTML data, reducing vehicle landing and incentive page creation time by ~70%.",
      "Designed and developed promotional UI elements and graphics using Adobe Photoshop to enhance engagement.",
      "Built SEO-optimized content structures to improve search visibility and user reach.",
      "Customized UI layouts based on client needs, improving usability and overall user satisfaction.",
    ],
  },
];

export const RESUME_SKILLS = [
  { id: "front-end", title: "Front-End Development", items: ["HTML5", "CSS3", "JavaScript", "jQuery", "JSON", "React", "Responsive Design"] },
  { id: "ui-ux", title: "UI/UX Design", items: ["User Interface Design", "User Experience Design (UX)", "Wireframing", "Prototyping", "Accessibility (a11y)", "Interaction Design"] },
  { id: "frameworks", title: "Frameworks & Tools", items: ["Bootstrap", "Foundation", "Figma", "Adobe XD", "Adobe Photoshop"] },
  { id: "dev-tools", title: "Development Tools", items: ["Git", "Visual Studio", "Adobe Dreamweaver"] },
  { id: "cms", title: "CMS & Platforms", items: ["WordPress", "Custom CMS"] },
  { id: "optimization", title: "Optimization & Performance", items: ["Performance Tuning", "Cross-Browser Compatibility", "Mobile Optimization", "SEO Best Practices"] },
];

export const RESUME_PROJECTS = [
  {
    id: "automotive-platform",
    title: "Responsive Automotive Website Platform",
    highlights: [
      "Designed mobile-first UI systems tailored for dealership websites.",
      "Improved user interaction through touch-friendly navigation and optimized layouts.",
    ],
  },
  {
    id: "custom-cms",
    title: "Custom CMS UI Development",
    highlights: [
      "Built reusable UI components for faster content deployment.",
      "Enhanced editor workflows and reduced development turnaround time.",
    ],
  },
];

export const RESUME_EDUCATION = {
  credential: "Multimedia Design AA, Web Page, Digital/Multimedia and Information Resources Design",
  school: "Lake Washington Institute of Technology",
  location: "Kirkland, WA",
  gpa: "3.8",
  honors: ["Phi Theta Kappa Honor Society"],
};
