import React, { useRef } from "react";
import { Link } from "react-router-dom";
import "./Home.css";
import "../../assets/styles/noise.css";
import { useMagneticSVG } from "../../hooks/useMagneticSVG";
import { useMarqueeScroll, Marquee } from "../../hooks/useMarqueeScroll";
import { useDotGrid, DotGrid } from "../../hooks/useDotGrid";
import { useTypewriterHeading } from "../../hooks/useTypewriterHeading";
import { useHorizontalScroll } from "../../hooks/useHorizontalScroll";
import heroBg from "../../assets/images/hero_bg.webp";
import diagnalLines from "../../assets/images/diagnal-lines.svg";
import handleDots from "../../assets/images/handle-dots.svg";
import arrowDown from "../../assets/images/arrow-down.svg";
import arrowRight from "../../assets/images/arrow-right.svg";

// SVG imports for skill icons
import { ReactComponent as JsonIcon } from "../../assets/images/icons/json.svg";
import { ReactComponent as ResponsiveMobileIcon } from "../../assets/images/icons/responsive-mobile.svg";
import { ReactComponent as BugIcon } from "../../assets/images/icons/bug.svg";
import { ReactComponent as ReliabilityIcon } from "../../assets/images/icons/reliability.svg";
import { ReactComponent as TeamworkIcon } from "../../assets/images/icons/teamwork.svg";
import { ReactComponent as CreativityIcon } from "../../assets/images/icons/creativity.svg";
import { ReactComponent as ReactIcon } from "../../assets/images/icons/react.svg";
import { ReactComponent as SolvingIcon } from "../../assets/images/icons/solving.svg";
import { ReactComponent as GithubIcon } from "../../assets/images/icons/github.svg";
import { ReactComponent as WebDevelopmentIcon } from "../../assets/images/icons/web.svg";
import { ReactComponent as JiraIcon } from "../../assets/images/icons/jira.svg";
import { ReactComponent as CommunicationIcon } from "../../assets/images/icons/communication.svg";
import { ReactComponent as WebSupportIcon } from "../../assets/images/icons/support.svg";
import { ReactComponent as WebServicesIcon } from "../../assets/images/icons/server.svg";
import { ReactComponent as ApplicationIcon } from "../../assets/images/icons/application.svg";
import { ReactComponent as OrganizationIcon } from "../../assets/images/icons/organization.svg";
import { ReactComponent as CustomerSupportIcon } from "../../assets/images/icons/customer.svg";
import { ReactComponent as ProgrammingIcon } from "../../assets/images/icons/programming.svg";
import { ReactComponent as WebBuildingIcon } from "../../assets/images/icons/building.svg";
import { ReactComponent as WordpressIcon } from "../../assets/images/icons/wordpress.svg";
import { ReactComponent as UserInterfaceDesignIcon } from "../../assets/images/icons/interface.svg";
import { ReactComponent as XSLTIcon } from "../../assets/images/icons/xslt.svg";
import { ReactComponent as XMLIcon } from "../../assets/images/icons/xml.svg";
import { ReactComponent as ZurbIcon } from "../../assets/images/icons/zurb.svg";
import { ReactComponent as SEOIcon } from "../../assets/images/icons/seo.svg";
import { ReactComponent as DesignIcon } from "../../assets/images/icons/design.svg";
import { ReactComponent as ResponsiveDesignIcon } from "../../assets/images/icons/responsive-design.svg";
import { ReactComponent as MobileIcon } from "../../assets/images/icons/mobile.svg";
import { ReactComponent as UIIcon } from "../../assets/images/icons/ui.svg";
import { ReactComponent as UXIcon } from "../../assets/images/icons/ux.svg";
import { ReactComponent as XDIcon } from "../../assets/images/icons/xd.svg";
import { ReactComponent as BootstrapIcon } from "../../assets/images/icons/bootstrap.svg";
import { ReactComponent as IllustratorIcon } from "../../assets/images/icons/illustrator.svg";
import { ReactComponent as CSSIcon } from "../../assets/images/icons/css.svg";
import { ReactComponent as HTMLIcon } from "../../assets/images/icons/html.svg";
import { ReactComponent as JQUERYIcon } from "../../assets/images/icons/jquery.svg";
import { ReactComponent as PHPIcon } from "../../assets/images/icons/php.svg";
import { ReactComponent as PhotoshopIcon } from "../../assets/images/icons/photoshop.svg";

// Data for marquee skill chips
const marqueeRow1 = [
  { label: "JSON", icon: <JsonIcon width={34} height={34} /> },
  { label: "Responsive Design", icon: <ResponsiveMobileIcon width={34} height={34} /> },
  { label: "Testing & Debugging", icon: <BugIcon width={34} height={34} /> },
  { label: "Reliability", icon: <ReliabilityIcon width={34} height={34} /> },
  { label: "Teamwork", icon: <TeamworkIcon width={34} height={34} /> },
  { label: "Creativity & Innovation", icon: <CreativityIcon width={34} height={34} /> },
  { label: "React.js", icon: <ReactIcon width={34} height={34} /> },
  { label: "Problem Solving", icon: <SolvingIcon width={34} height={34} /> },
  { label: "GitHub", icon: <GithubIcon width={34} height={34} /> },
  { label: "Web Development", icon: <WebDevelopmentIcon width={34} height={34} /> },
  { label: "Jira", icon: <JiraIcon width={34} height={34} /> },
  { label: "Communication", icon: <CommunicationIcon width={34} height={34} /> },
  { label: "Web Support", icon: <WebSupportIcon width={34} height={34} /> },
  { label: "Web Services", icon: <WebServicesIcon width={34} height={34} /> },
  { label: "Web Applications", icon: <ApplicationIcon width={34} height={34} /> },
  { label: "Organization Skills", icon: <OrganizationIcon width={34} height={34} /> },
  { label: "Customer Support", icon: <CustomerSupportIcon width={34} height={34} /> },
  { label: "JQUERY", icon: <JQUERYIcon width={34} height={34} /> },
];

// Second row of marquee skills
const marqueeRow2 = [
  { label: "WordPress", icon: <WordpressIcon width={34} height={34} /> },
  { label: "User Interface Design", icon: <UserInterfaceDesignIcon width={34} height={34} /> },
  { label: "User Experience (UX)", icon: <UXIcon width={34} height={34} /> },
  { label: "XSLT", icon: <XSLTIcon width={34} height={34} /> },
  { label: "XML", icon: <XMLIcon width={34} height={34} /> },
  { label: "ZURB Foundation", icon: <ZurbIcon width={34} height={34} /> },
  { label: "SEO", icon: <SEOIcon width={34} height={34} /> },
  { label: "Web Design", icon: <DesignIcon width={34} height={34} /> },
  { label: "Responsive Web Design", icon: <ResponsiveDesignIcon width={34} height={34} /> },
  { label: "Mobile Web Design", icon: <MobileIcon width={34} height={34} /> },
  { label: "Web Interface Design", icon: <UIIcon width={34} height={34} /> },
  { label: "Adobe XD", icon: <XDIcon width={34} height={34} /> },
  { label: "Bootstrap", icon: <BootstrapIcon width={34} height={34} /> },
  { label: "Adobe Illustrator", icon: <IllustratorIcon width={34} height={34} /> },
  { label: "CSS3", icon: <CSSIcon width={34} height={34} /> },
  { label: "HTML5", icon: <HTMLIcon width={34} height={34} /> },
  { label: "Website Building", icon: <WebBuildingIcon width={34} height={34} /> },
  { label: "Programming", icon: <ProgrammingIcon width={34} height={34} /> },
  { label: "PHP", icon: <PHPIcon width={34} height={34} /> },
  { label: "Adobe Photoshop", icon: <PhotoshopIcon width={34} height={34} /> },
];

// Component for individual skill chips in the marquee
function SkillChip({ label, icon }) {
  return (
    <>
      <span className='skill-chip' aria-label={label} sa='fade glacial mirror delay-200'>
        <span className='skill-chip__label'>{label}</span>
        <span className='skill-chip__icon' aria-hidden='true'>
          {icon}
        </span>
      </span>
      <span className='divider' aria-hidden='true' sa='fade glacial mirror delay-600'>
        &bull;
      </span>
    </>
  );
}

function Home() {
  useMarqueeScroll();
  useDotGrid();

  // Refs for magnetic slats
  const SLAT_COUNT = 5;
  const magSlatRefs = useRef(Array.from({ length: SLAT_COUNT }, () => ({ current: null })));
  const slatRefs = useRef(Array.from({ length: SLAT_COUNT }, () => ({ current: null })));

  useMagneticSVG(magSlatRefs.current, slatRefs.current, 10);

  // Typewriter effect for hero heading
  const displayHeading = useTypewriterHeading(["Design Systems", "Accessible Interfaces", "Performance-Focused UI", "Frontend Architecture"]);

  // Refs for hero scroll effect
  const wrapRef = useRef(null);
  const stageRef = useRef(null);

  useHorizontalScroll(wrapRef, stageRef);

  return (
    <>
      <section className='section section__hero section-grain grain-medium section-padding height-viewport'>
        <div className='hero__content flex-all flex-vert-bottom height-full'>
          <div className='hero-content__left' sa='up-long fade glacial'>
            <h1 className='heading' sa='up slower delay-200'>
              {displayHeading}
            </h1>

            <h2 className='h3 sub-heading' sa='up slower delay-400'>
              <strong>Hi, I'm Walter Carlson, a UI Engineer</strong> focused on building accessible and scalable user interfaces that bridge design and engineering.
            </h2>
            <p className='text-muted' sa='up slower delay-600'>
              With a strong focus on performance, usability, and maintainable code, I transform design concepts into polished, production-ready interfaces that deliver consistent experiences across devices.
            </p>
            <Link to='/Contact' className='btn btn-primary' sa='up glacial delay-800' data-cursor='light'>
              <span className='btn__text'>Get in Touch</span>
              <span className='btn__arrow'>
                <svg xmlns='http://www.w3.org/2000/svg' width='15' height='16' viewBox='0 0 15 16' fill='none'>
                  <g clipPath='url(#clip0_388_188)'>
                    <path
                      d='M12.6346 2H5.3634C5.2665 2 5.17356 2.0417 5.10503 2.11593C5.03651 2.19017 4.99801 2.29085 4.99801 2.39582C4.99801 2.5008 5.03651 2.60148 5.10503 2.67571C5.17356 2.74995 5.2665 2.79165 5.3634 2.79165H11.7545L1.10661 14.3269C1.07281 14.3635 1.046 14.407 1.02771 14.4548C1.00941 14.5027 1 14.5539 1 14.6057C1 14.6575 1.00941 14.7088 1.02771 14.7566C1.046 14.8044 1.07281 14.8479 1.10661 14.8845C1.14041 14.9211 1.18053 14.9502 1.22469 14.97C1.26885 14.9898 1.31619 15 1.36398 15C1.41178 15 1.45911 14.9898 1.50328 14.97C1.54744 14.9502 1.58756 14.9211 1.62136 14.8845L12.2692 3.34855V10.2726C12.2692 10.3776 12.3077 10.4782 12.3762 10.5525C12.4448 10.6267 12.5377 10.6684 12.6346 10.6684C12.7315 10.6684 12.8245 10.6267 12.893 10.5525C12.9615 10.4782 13 10.3776 13 10.2726V2.39438C12.9993 2.28977 12.9605 2.18968 12.8921 2.11584C12.8237 2.042 12.7312 2.00038 12.6346 2Z'
                      fill='var(--color-text-primary)'
                    />
                  </g>

                  <defs>
                    <clipPath id='clip0_388_188'>
                      <rect width='15' height='16' fill='white' />
                    </clipPath>
                  </defs>
                </svg>
              </span>
            </Link>
          </div>
        </div>

        <div className='hero__decor'>
          <DotGrid color='overlay' pattern='diagonal' size='small' cols={30} count={400} className='backdrop-dots hidden-xs' />
          
          <div className='decor__shape dots--1' sa='float float-y float-y-loop delay-1000'>
            <img src={handleDots} alt='Handle dots' sa='up-long glacial delay-800' />
          </div>
          <div className='decor__shape dots--2' sa='float float-y float-y-loop delay-1200'>
            <img src={handleDots} alt='Handle dots' sa='down-long glacial delay-1000' />
          </div>
          <div className='decor__shape arrow-down-svg arrow-down--1' sa='float float-x float-x-loop delay-1400'>
            <img src={arrowRight} alt='Arrow down drop' sa='right-long glacial delay-1200' />
          </div>
          <div className='decor__shape arrow-down-svg arrow-down--2' sa='float float-y float-y-loop delay-1600'>
            <img src={arrowDown} alt='Arrow down drop' sa='down-long glacial delay-1400' />
          </div>

          <div className='decor__shape slats-bg slats-bg--hero'>
            <img src={diagnalLines} alt='diagonal lines' width='903' height='730' sa='up glacial delay-600' />
          </div>          

          <svg className='decor__shape slats-svg' xmlns='http://www.w3.org/2000/svg' aria-hidden='true'>
            <defs>
              <mask id='slats-mask' maskUnits='userSpaceOnUse' x='0' y='0' width='100%' height='100%'>
                <g className='slat'>
                  <g transform='rotate(45, 770, 170)'>
                    <g ref={(el) => (slatRefs.current[0].current = el)} style={{ transform: "translate(var(--mag-x, 0px), var(--mag-y, 0px))" }}>
                      <rect x='500' y='-60' width='140' height='100vh' rx='70' ry='70' fill='white' />
                    </g>
                  </g>
                </g>

                <g className='slat'>
                  <g transform='rotate(45, 970, 205)'>
                    <g ref={(el) => (slatRefs.current[1].current = el)} style={{ transform: "translate(var(--mag-x, 0px), var(--mag-y, 0px))" }}>
                      <rect x='705' y='-60' width='140' height='100vh' rx='70' ry='70' fill='white' />
                    </g>
                  </g>
                </g>

                <g className='slat'>
                  <g transform='rotate(45, 1170, 210)'>
                    <g ref={(el) => (slatRefs.current[2].current = el)} style={{ transform: "translate(var(--mag-x, 0px), var(--mag-y, 0px))" }}>
                      <rect x='930' y='60' width='140' height='130vh' rx='70' ry='70' fill='white' />
                    </g>
                  </g>
                </g>

                <g className='slat'>
                  <g transform='rotate(45, 1370, 200)'>
                    <g ref={(el) => (slatRefs.current[3].current = el)} style={{ transform: "translate(var(--mag-x, 0px), var(--mag-y, 0px))" }}>
                      <rect x='1165' y='200' width='140' height='100vh' rx='70' ry='70' fill='white' />
                    </g>
                  </g>
                </g>

                <g className='slat'>
                  <g transform='rotate(45, 1370, 200)'>
                    <g ref={(el) => (slatRefs.current[4].current = el)} style={{ transform: "translate(var(--mag-x, 0px), var(--mag-y, 0px))" }}>
                      <rect x='1335' y='60' width='140' height='100vh' rx='70' ry='70' fill='white' />
                    </g>
                  </g>
                </g>
              </mask>
            </defs>

            {/* The masked image */}
            <image href={heroBg} x='0' y='0' width='130%' height='160%' preserveAspectRatio='xMidYMid slice' mask='url(#slats-mask)' />

            {/*
              Overlay rects — outside <defs> and <mask>, rendered on top of the image.
              Identical transforms to the mask rects so hit zones align exactly.
              fill='transparent' makes them invisible but still hit-testable.
              pointer-events='all' is required on SVG elements — unlike HTML,
              SVG ignores pointer events on transparent fills by default.
            */}

            <g transform='rotate(45, 770, 170)'>
              <rect className='magnetic magnetic--strong' ref={(el) => (magSlatRefs.current[0].current = el)} x='500' y='-60' width='140' height='100vh' rx='70' ry='70' fill='transparent' pointerEvents='all' />
            </g>

            <g transform='rotate(45, 970, 205)'>
              <rect className='magnetic magnetic--strong' ref={(el) => (magSlatRefs.current[1].current = el)} x='705' y='-60' width='140' height='100vh' rx='70' ry='70' fill='transparent' pointerEvents='all' />
            </g>

            <g transform='rotate(45, 1170, 210)'>
              <rect className='magnetic magnetic--strong' ref={(el) => (magSlatRefs.current[2].current = el)} x='930' y='60' width='140' height='130vh' rx='70' ry='70' fill='transparent' pointerEvents='all' />
            </g>

            <g transform='rotate(45, 1370, 200)'>
              <rect className='magnetic magnetic--strong' ref={(el) => (magSlatRefs.current[3].current = el)} x='1165' y='200' width='140' height='100vh' rx='70' ry='70' fill='transparent' pointerEvents='all' />
            </g>

            <g transform='rotate(45, 1370, 200)'>
              <rect className='magnetic magnetic--strong' ref={(el) => (magSlatRefs.current[4].current = el)} x='1335' y='60' width='140' height='100vh' rx='70' ry='70' fill='transparent' pointerEvents='all' />
            </g>
          </svg>
        </div>
      </section>

      <section className='section section__skills'>
        <div className='section__skills-marquee section-padding'>
          <div className='section__label'>
            <h2 className='section__title' sa='up slower mirror delay-200'>Skills</h2>
            <span className='section__count' sa='right-long glacial mirror delay-400'>01 toolset</span>
          </div>
    
          <div className='skills__marquee-wrap'>
            <Marquee speed='35s' rtl faded pauseOnHover>
              {marqueeRow1.map((item) => (
                <SkillChip key={item.label} {...item} />
              ))}
            </Marquee>

            <Marquee speed='35s' ltr faded pauseOnHover>
              {marqueeRow2.map((item) => (
                <SkillChip key={item.label} {...item} />
              ))}
            </Marquee>
          </div>
         
        </div>

         <div className='hero__decor relative'>
            <div className='decor__shape slats-bg slats-bg--skills'>
              <img src={diagnalLines} alt='diagonal lines' width='903' height='730' sa='fade slow' />
            </div>
          </div>         

        <div className='skills__intro-wrapper section-padding'>
          <div className='skills__intro-container'>
            <div className='skills__intro-text'>
              <h3 className='sub-heading' sa='up slower mirror delay-200'><strong>Built for <span className='text-primary'>Modern Web Experiences</span></strong></h3>
              <p sa='up slower mirror delay-400'>With strengths in concept development, wireframing, prototyping, visual design, and front-end execution, I bring ideas to life through thoughtful problem-solving and user-centered design. Every stage is guided by usability, responsiveness, and precision.</p>        
            </div>
            <div className='skills__intro-decor'>
              <div className='morph-image'>
              <img
                className='morph-image__img'
                src='https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1800&q=80'
                alt='Mountain landscape at golden hour'
              />
              </div>
            </div>
          </div>
        </div>         
                
      </section>
    
      <section className='section section__work'>
        <div className='work__wrap' ref={wrapRef}>
          <div className='work__stage' ref={stageRef}>
            <div className='section__label section-padding'>
              <h2 className='section__title' sa='up slower mirror delay-200'>Projects</h2>
              <span className='section__count' sa='right-long glacial mirrordelay-400'>02 works</span>
              <div className='work__progress'>
                <div className='work__progress-fill'></div>
              </div>
            </div>

            <div className='work__track section-padding'>              
              <div className='work__card magnetic magnetic--subtle'>
                <div className='work__card-bg-num'>1</div>
                <div className='work__card-top'>
                  <span className='work__card-index'>01 / 05</span>
                  <span className='work__card-tag'>Branding</span>
                </div>
                <div className='work__card-bottom'>
                  <h2 className='work__card-title'>
                    Meridian
                    <br />
                    Identity
                  </h2>
                  <p className='work__card-body'>A complete brand system for a next-generation infrastructure company. Mark, motion, and voice.</p>
                </div>
              </div>

              <div className='work__card magnetic magnetic--subtle'>
                <div className='work__card-bg-num'>2</div>
                <div className='work__card-top'>
                  <span className='work__card-index'>02 / 05</span>
                  <span className='work__card-tag'>Product</span>
                </div>
                <div className='work__card-bottom'>
                  <h2 className='work__card-title'>
                    Folio
                    <br />
                    Dashboard
                  </h2>
                  <p className='work__card-body'>End-to-end product design for a portfolio management platform used by 40,000+ investors.</p>
                </div>
              </div>

              <div className='work__card magnetic magnetic--subtle'>
                <div className='work__card-bg-num'>3</div>
                <div className='work__card-top'>
                  <span className='work__card-index'>03 / 05</span>
                  <span className='work__card-tag'>Web</span>
                </div>
                <div className='work__card-bottom'>
                  <h2 className='work__card-title'>
                    Solaris
                    <br />
                    Campaign
                  </h2>
                  <p className='work__card-body'>Interactive launch site for a climate-tech startup. 3D environments, scroll storytelling, zero JS frameworks.</p>
                </div>
              </div>

              <div className='work__card magnetic magnetic--subtle'>
                <div className='work__card-bg-num'>4</div>
                <div className='work__card-top'>
                  <span className='work__card-index'>04 / 05</span>
                  <span className='work__card-tag'>Motion</span>
                </div>
                <div className='work__card-bottom'>
                  <h2 className='work__card-title'>
                    Atlas
                    <br />
                    Title Seq.
                  </h2>
                  <p className='work__card-body'>Opening title sequence for a feature-length documentary. Type, texture, and sound in lockstep.</p>
                </div>
              </div>

              <div className='work__card magnetic magnetic--subtle'>
                <div className='work__card-bg-num'>5</div>
                <div className='work__card-top'>
                  <span className='work__card-index'>05 / 05</span>
                  <span className='work__card-tag'>Editorial</span>
                </div>
                <div className='work__card-bottom'>
                  <h2 className='work__card-title'>
                    Kin
                    <br />
                    Magazine
                  </h2>
                  <p className='work__card-body'>Art direction and layout design for an independent print publication celebrating slow culture.</p>
                </div>
              </div>

              <div className='work__card magnetic magnetic--subtle'>
                <div className='work__card-bg-num'>&gt;</div>
                <div className='work__card-top'>
                  <span className='work__card-index'>08 / 10</span>
                  <span className='work__card-tag'>Legacy</span>
                </div>
                <div className='work__card-bottom'>
                  <h2 className='work__card-title'>
                    Explore
                    <br />
                    Work
                  </h2>
                  <p className='work__card-body'>View all projects and discover the process behind the work, from strategy and design to final implementation.</p>
                </div>
              </div>              
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default Home;