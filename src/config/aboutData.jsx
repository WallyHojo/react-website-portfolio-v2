// Data for the About page (guiding principles and value/impact sections)

import { ReactComponent as CreativityIcon } from "../assets/images/icons/creativity.svg";
import { ReactComponent as DesignIcon } from "../assets/images/icons/design.svg";
import { ReactComponent as UXIcon } from "../assets/images/icons/ux.svg";
import { ReactComponent as TeamworkIcon } from "../assets/images/icons/teamwork.svg";

import "../assets/styles/cards.css";

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
