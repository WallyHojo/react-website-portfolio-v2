import React, { useRef } from "react";
import { Link } from "react-router-dom";
import ContactForm from '../../components/Form/Form.js';
import { MARQUEE_ROW1, MARQUEE_ROW2, WEB_EXPERIENCES } from "../../config/skillChips.js";
import { WORK_LIST } from "../../config/workList.js";
import "./Home.css";
import "../../assets/styles/noise.css";

// Hooks
import { useMagneticSVG } from "../../hooks/useMagneticSVG";
import { useMarqueeScroll, Marquee } from "../../hooks/useMarqueeScroll";
import { useDotGrid, DotGrid } from "../../hooks/useDotGrid";
import { useTypewriterHeading } from "../../hooks/useTypewriterHeading";
import { useHorizontalScroll } from "../../hooks/useHorizontalScroll";

// Assets
import heroBg from "../../assets/images/hero_bg.webp";
import handleDots from "../../assets/images/handle-dots.svg";
import arrowDown from "../../assets/images/arrow-down.svg";
import arrowRight from "../../assets/images/arrow-right.svg";
import diagnalLines from "../../assets/images/diagnal-lines.svg";
import wsBG from "../../assets/images/workstation/bg.webp";
import wsChair from "../../assets/images/workstation/chair_img.webp";
import wsKeyboardMouse from "../../assets/images/workstation/keyboard-mouse_img.webp";
import wsMoniterLeft from "../../assets/images/workstation/monitor-left_img.webp";
import wsMoniterRight from "../../assets/images/workstation/monitor-right_img.webp";
import wsTower from "../../assets/images/workstation/tower_img.webp";

// Component for individual skill chips in the marquee
const SkillChip = React.memo(({ label, icon, color }) => {
  return (
    <>
      <span
        className='skill-chip'
        aria-label={label}
        style={{ "--shadow-color": color }}
      >
        <span className='skill-chip__label'>{label}</span>
        <span className='skill-chip__icon' aria-hidden='true'>
          {icon}
        </span>
      </span>

      <span className='divider' aria-hidden='true'>
        &bull;
      </span>
    </>
  );
});

const ExperienceSkillChip = React.memo(({ label, icon, color, number }) => {
  return (
    <>
      <span className='skill' data-chip={number}>
        <span
          className='skill-chip'
          aria-label={label}
          style={{ "--shadow-color": color }}
        >
          <span className='skill-chip__label'>{label}</span>
          <span className='skill-chip__icon' aria-hidden='true'>
            {icon}
          </span>
        </span>
      </span>
    </>
  );
});

// Component for individual work cards in the Projects section
const WorkCard = React.memo(({ title, description, tag, number, total, symbol }) => {
  const formattedIndex = `${String(number).padStart(2, '0')} / ${String(total).padStart(2, '0')}`;
  return (
    <>
      <div className='work__card magnetic magnetic--subtle' role='listitem' aria-label={`Project ${number}: ${title}`}>
        <div className='work__card-bg-num'>{symbol || number}</div>
        <div className='work__card-top'>
          <span className='work__card-index'>{formattedIndex}</span>
          <span className='work__card-tag'>{tag}</span>
        </div>
        <div className='work__card-bottom'>
          <h2 className='work__card-title'>{title}</h2>
          <p className='work__card-body'>{description}</p>
        </div>
      </div>
    </>
  );
});

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
      <section className='section section__hero section__grain --grain-medium section-padding h-viewport-dynamic' aria-label='Introduction and Hero'>
        <div className='section__decor'>
          <DotGrid color='surface' pattern='scatter' size='small' cols={30} count={500} className='backdrop-dots hidden-xs' />
          
          <div className='decor__shape dots--1' sa='float float-y float-y-loop delay-1000'>
            <img src={handleDots} width='52' height='33' alt='Handle dots' sa='up-long glacial delay-800' />
          </div>
          <div className='decor__shape dots--2' sa='float float-y float-y-loop delay-1200'>
            <img src={handleDots} width='52' height='33' alt='Handle dots' sa='down-long glacial delay-1000' />
          </div>
          <div className='decor__shape arrow-down-svg arrow-down--1' sa='float float-x float-x-loop delay-1400'>
            <img src={arrowRight} width='54' height='16' alt='Arrow down drop' sa='right-long glacial delay-1200' />
          </div>
          <div className='decor__shape arrow-down-svg arrow-down--2' sa='float float-y float-y-loop delay-1600'>
            <img src={arrowDown} width='16' height='54' alt='Arrow down drop' sa='down-long glacial delay-1400' />
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

        <div className='hero__content flex-all flex-vert-bottom h-full'>
          <div className='content__left' sa='fade glacial'>
            <h1 className='heading'>
              {displayHeading}
            </h1>

            <h2 className='h3 sub-heading'>
              <strong>Hi, I'm Walter Carlson, a UI Engineer</strong> focused on building accessible and scalable user interfaces that bridge design and engineering.
            </h2>
            <p className='text-muted'>
              With a strong focus on performance, usability, and maintainable code, I transform design concepts into polished, production-ready interfaces that deliver consistent experiences across devices.
            </p>
            <Link to='/contact' className='btn btn-primary' data-cursor='light'>
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
      </section>

      <section className='section section__overview section-padding' aria-label='Professional Overview'>
        <div className='section__overview-inner'>
          <ul className='overview__list'>
            <li sa='diag-tr-bl slow delay-200'>
              <div className='overview__list-stat'>
                <div className='stat__number'>
              <span className='stat__value' sa='count mirror delay-400' data-sa-to='18'></span>
              <span className='stat__suffix'>+</span>
              </div>
              <p className='stat__label'>Years of Experience</p>
              </div>
            </li>
            <li sa='diag-tr-bl slow delay-400'>
              <div className='overview__list-stat'>
                <div className='stat__number'>
              <span className='stat__value' sa='count mirror delay-400' data-sa-to='600'></span>
              <span className='stat__suffix'>+</span>
              </div>
              <p className='stat__label'>Websites Delivered</p>
              </div>
            </li>
            <li sa='diag-tr-bl slow delay-600'>
              <div className='overview__list-stat'>
                <div className='stat__number'>
              <span className='stat__value' sa='count mirror delay-400' data-sa-to='120'></span>
              <span className='stat__suffix'>+</span>
              </div>
              <p className='stat__label'>Happy Clients</p>
              </div>
            </li>
            <li sa='diag-tr-bl slow delay-800'>
              <div className='overview__list-stat'>
                <div className='stat__number'>
              <span className='stat__value' sa='count mirror delay-400' data-sa-to='6'></span>
              <span className='stat__suffix'>+</span>
              </div>
              <p className='stat__label'>Automotive Verticals</p>
              </div>
            </li>
          </ul>
        </div>
      </section>

      <section className='section section__skills section-padding' aria-label='Skills and Expertise'>

        <div className='section__skills-marquee section-padding'>
          <div className='section__label'>
            <h2 className='section__title' sa='up slower mirror delay-200'>Skills</h2>
            <span className='section__count' sa='right glacial mirror delay-400'>01 toolset</span>
          </div>
    
          <div className='skills__marquee-wrap'>
            <Marquee rtl faded>
              {MARQUEE_ROW1.map((item) => (
                <SkillChip key={item.label} {...item} />
              ))}
            </Marquee>

            <Marquee ltr faded>
              {MARQUEE_ROW2.map((item) => (
                <SkillChip key={item.label} {...item} />
              ))}
            </Marquee>
          </div>
        </div>

        <div className='skills__intro-wrapper relative'>
          <div className='section__decor'>
            <DotGrid color='surface' pattern='scatter' size='small' cols={30} count={2000} className='backdrop-dots hidden-xs' />            
          </div>

          <div className='skills__intro-container h-viewport-small sticky'>
            <div className='skills__intro-text' sa='down-long glacial mirror'>
              <h3 className='sub-heading'><strong>Built for <span className='text-primary'>Modern Web Experiences</span></strong></h3>
              <p>With strengths in concept development, wireframing, prototyping, visual design, and front-end execution, I bring ideas to life through thoughtful problem-solving and user-centered design. Every stage is guided by usability, responsiveness, and precision.</p>        
            </div>
            <div className='skills__intro-decor h-full relative'>
              <div className='background__ellipse background__ellipse-1 skills__ellipse-1 ellipse--blue ellipse--medium hidden-xs'></div>
              <div className='background__ellipse background__ellipse-1 skills__ellipse-1 ellipse--blue ellipse--small visible-xs'></div>                         
              <div className='decor__image-wrapper h-full'>
                <div className='decor-image'>
                  <img src={wsChair} width='773' height='723' alt='workstation chair img' className='decor-image__img --chair' />                 
                  <img src={wsTower} width='773' height='723' alt='workstation tower img' className='decor-image__img --tower' />
                  <img src={wsKeyboardMouse} width='773' height='723' alt='workstation keyboard mouse img' className='decor-image__img --keyboard' />
                  <img src={wsMoniterRight} width='773' height='723' alt='workstation monitor right img' className='decor-image__img --monitorRight' />
                  <img src={wsMoniterLeft} width='773' height='723' alt='workstation monitor left img' className='decor-image__img --monitorLeft' />
                  <img src={wsBG} width='773' height='723' alt='workstation background img' className='decor-image__img --bg' />
                </div>
              </div>             
              {WEB_EXPERIENCES.map((item, index) => (
                <ExperienceSkillChip key={item.label} {...item} number={index + 1} />
              ))}                
            </div>
          </div>
        </div>
      </section>
    
      <section className='section section__work' aria-label='Featured Projects'>
        <div className='work__wrap' ref={wrapRef} role='region' aria-roledescription='horizontal scroll'>
          <div className='work__stage h-viewport-small sticky section-padding' ref={stageRef}>
            <div className='section__label' role='presentation'>
              <h2 className='section__title' sa='up slower mirror delay-200'>Projects</h2>
              <span className='section__count' sa='right glacial mirror delay-400'>02 works</span>
              <div className='work__progress' aria-hidden='true'>
                <div className='work__progress-fill'></div>
              </div>
            </div>

            <div className='work__track' role='list' aria-label='Project cards'>    
              {WORK_LIST.map((item, index) => (
                <WorkCard key={item.label} {...item} number={index + 1} total={WORK_LIST.length} />
              ))}     
            </div>

          </div>
        </div>
      </section>

      <section className="section section__contact section__grain --grain-medium section-padding relative"
        aria-label="Contact Information"
      >
        <div className="section__decor">
          <div className="decor__shape slats-bg slats-bg--contact">
            <img
              src={diagnalLines}
              alt="diagonal lines"
              width="903"
              height="730"
              sa="diag-bl-tr glacial mirror delay-400"
            />
          </div>
        </div>
        <div className="section__label">
          <h2 className="section__title" sa="up slower mirror delay-200">
            Contact
          </h2>
          <span
            className="section__count"
            sa="right glacial mirror delay-400"
          >
            03 form
          </span>
        </div>
        <div className="contact__container flex-all flex-direction-row flex-space-between flex-wrap">
          <div className="contact__content flex-all flex-direction-column" sa="up slower mirror delay-400">
            <div class="menu__eyebrow flex-all flex-vert-center sa-visible sa-enter-up" sa="left slow delay-200"><span class="menu__eyebrow-icon flex-all flex-vert-center"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M16.6808 0C17.0307 0 17.3662 0.138986 17.6136 0.386383C17.861 0.633779 18 0.969321 18 1.31919V11.8727C18 12.2226 17.861 12.5581 17.6136 12.8055C17.3662 13.0529 17.0307 13.1919 16.6808 13.1919C16.3309 13.1919 15.9954 13.0529 15.748 12.8055C15.5006 12.5581 15.3616 12.2226 15.3616 11.8727V4.50372L2.23565 17.6297C1.98685 17.87 1.65362 18.003 1.30773 17.9999C0.961841 17.9969 0.630971 17.8582 0.386382 17.6136C0.141793 17.369 0.00305554 17.0382 4.9869e-05 16.6923C-0.0029558 16.3464 0.130011 16.0132 0.370313 15.7643L13.4963 2.63838H6.12727C5.7774 2.63838 5.44186 2.4994 5.19446 2.252C4.94706 2.00461 4.80808 1.66906 4.80808 1.31919C4.80808 0.969321 4.94706 0.633779 5.19446 0.386383C5.44186 0.138986 5.7774 0 6.12727 0H16.6808Z" fill="#2979FF"></path></svg></span><span class="menu__eyebrow-text">Get in Touch</span></div>
            <p>Whether you're reaching out about a role, a team, or a potential fit, I’m always open to meaningful conversations around web development opportunities.</p>
          </div>
          <div className="contact__form relative">
            <ContactForm />
          </div>
        </div>
      </section>
    </>
  );
}

export default Home;