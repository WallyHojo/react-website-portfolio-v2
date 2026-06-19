import React, { useRef } from "react";

import { useMarqueeScroll, Marquee } from "../../hooks/useMarqueeScroll";
/*import { useTypewriterHeading } from "../../hooks/useTypewriterHeading";*/
import { useHorizontalScroll } from "../../hooks/useHorizontalScroll.jsx";
import { useIsMobile } from "../../hooks/useIsMobile.jsx";
import Btn from "../../components/ui/Buttons";
import HeroSection from "../../components/ui/HeroSection";
import SectionLabel from "../../components/ui/SectionLabel";
import OverviewList from "../../components/ui/OverviewList";
import ContactForm from "../../components/ui/ContactForm/Form.jsx";
import { MARQUEE_ROW1, MARQUEE_ROW2, WEB_EXPERIENCES } from "../../config/skillChips.jsx";
import { WORK_LIST } from "../../config/workList.jsx";
import { MAIN_OVERVIEW_STATS } from "../../config/overviewStats.jsx";
import heroVideo from "../../assets/images/grok-video-9bcac0f6-ad9a-4660-a249-34424dfab915.mp4";
import "./Home.css";
import "../../assets/styles/noise.css";

// Component for individual skill chips in the marquee
const SkillChip = React.memo(({ label, icon, shadow }) => {
  return (
    <>
      <span className="skill-chip" aria-label={label} style={{ "--shadow-color": shadow }}>
        <span className="skill-chip__label">{label}</span>
        <span className="skill-chip__icon" aria-hidden="true">
          {icon}
        </span>
      </span>

      {/*<span className="divider" aria-hidden="true">
        &bull;
      </span>*/}
    </>
  );
});

const ExperienceSkillChip = React.memo(({ image, alt, number }) => {

  const isMobile = useIsMobile();

  return (
    <>
      {!isMobile && (
      <div className="skill absolute" data-chip={number}>
        <span className="skill-chip">
          <img src={image} alt={alt} />
        </span>
      </div>
      )}
    </>
  );
});

// Component for individual work cards in the Projects section
const WorkCard = React.memo(({ title, description, tag, image, number, total, symbol, link, linkLabel, backgroundColor }) => {
  const formattedIndex = `${String(number).padStart(2, "0")} / ${String(total).padStart(2, "0")}`;
  return (
    <>
      <div className="magnetic magnetic--subtle" role="listitem" aria-label={`Project ${number}: ${title}`} style={{ "--card-background": backgroundColor }}>
        <Btn to={link} plain className="work__card flex-all flex-direction-column flex-space-between relative overflow-hidden">
          <div className="work__card-bg-num absolute">{symbol || number}</div>
          <div className="work__card--top relative overflow-hidden" data-cursor="accent">          
            <div className="work__card-img"><img src={image} alt={title} /></div>
          </div>
          <div className="work__card--bottom flex-all flex-direction-column relative" data-cursor="light">          
            <div className="work__card-data--top flex-all flex-space-between flex-vert-center absolute">
              <span className="work__card-tag">{tag}</span>
            </div>          
            <h2 className="work__card-title">{title}</h2>
            <p className="work__card-body">{description}</p>
            <div className="work__card-data--bottom flex-all flex-space-between flex-vert-center mt-auto">
              
              <div className="work__card-link">
                <button className='btn'>
                  <span className='btn__text relative'>{linkLabel || "View case study"}</span>
                  <span className='btn__arrow'>
                    <svg xmlns='http://www.w3.org/2000/svg' width='18' height='18' viewBox='0 0 18 18' fill='none'>
                      <path
                        d='M16.6808 0C17.0307 0 17.3662 0.138986 17.6136 0.386383C17.861 0.633779 18 0.969321 18 1.31919V11.8727C18 12.2226 17.861 12.5581 17.6136 12.8055C17.3662 13.0529 17.0307 13.1919 16.6808 13.1919C16.3309 13.1919 15.9954 13.0529 15.748 12.8055C15.5006 12.5581 15.3616 12.2226 15.3616 11.8727V4.50372L2.23565 17.6297C1.98685 17.87 1.65362 18.003 1.30773 17.9999C0.961841 17.9969 0.630971 17.8582 0.386382 17.6136C0.141793 17.369 0.00305554 17.0382 4.9869e-05 16.6923C-0.0029558 16.3464 0.130011 16.0132 0.370313 15.7643L13.4963 2.63838H6.12727C5.7774 2.63838 5.44186 2.4994 5.19446 2.252C4.94706 2.00461 4.80808 1.66906 4.80808 1.31919C4.80808 0.969321 4.94706 0.633779 5.19446 0.386383C5.44186 0.138986 5.7774 0 6.12727 0H16.6808Z'
                        fill='var(--color-bg-inverse)'
                      />
                    </svg>
                  </span>
                </button>
              </div>

              <span className="work__card-index">{formattedIndex}</span>
            </div>
          </div>
        </Btn>
      </div>
    </>
  );
});

function Home() {
  useMarqueeScroll();

  // Typewriter effect for hero heading
  /*
  const displayHeading = useTypewriterHeading(["Design Systems", "Accessible Interfaces", "Performance-Focused UI", "Frontend Architecture"]);
  */

  // Refs for hero scroll effect
  const wrapRef = useRef(null);
  const stageRef = useRef(null);

  useHorizontalScroll(wrapRef, stageRef, WORK_LIST.length);

  return (
    <>
      {/* Hero Section */}
      <HeroSection
        variant="home"
        title="Walter Carlson"
        titleClassName="nowrap"
        subtitle={
          <h2 className="h3 sub-heading">
            A <strong className="text-primary">UI Engineer {/*displayHeading*/}</strong> focused on building accessible and scalable user interfaces that bridge design and engineering.
          </h2>
        }
        description={
          <p className="text-muted">With a strong focus on performance, usability, and maintainable code, I transform design concepts into polished, production-ready interfaces that deliver consistent experiences across devices.</p>
        }
        videoSrc={heroVideo}
      >

        <Btn to="/contact" primary className="magnetic magnetic--subtle" data-cursor="accent">Get in Touch</Btn>
      </HeroSection>

      {/* Overview Section */}
      <section className="section section__overview overview--home section-padding overflow-hidden" aria-label="Professional Overview">
        <div className="section__overview-inner absolute">
          <OverviewList items={MAIN_OVERVIEW_STATS} />
        </div>
      </section>

      {/* About Section */}
      <section className="section section__about relative h-viewport flex-all flex-direction-column flex-vert-center flex-horz-center section-padding" aria-label="About Me and Skills">
        <div className="about__intro-container relative">
          <div className="section__decor flex-all flex-horz-center absolute overflow-visible">
            <div className="background__ellipse background__ellipse-1 about__ellipse ellipse--blue ellipse--medium absolute hidden-mobile" sa="rise-long glacial mirror"></div>
            <div className="background__ellipse background__ellipse-1 about__ellipse ellipse--blue ellipse--small absolute hidden-tablet hidden-desktop" sa="rise-long glacial mirror"></div>
          </div>          
          <div className="about__intro-text flex-all flex-direction-column flex-vert-center gap-row-2 text-center" sa="up-long glacial mirror delay-200">
            <h2 sa="up mirror">Building Digital <strong>Experiences</strong> With Purpose</h2>
            <h3 className="h4">From wireframes to front-end development, I craft intuitive interfaces that are visually refined, accessible, and <strong className="text-primary">built for real users.</strong></h3>
            <Btn to="/about" primary className="magnetic magnetic--subtle" data-cursor="accent">About Me</Btn>            
          </div>          
        </div>       
      </section>

      {/* Skills Section */}
      <section className="section section__skills section-padding" aria-label="Skills and Expertise">

        <div className="skills__intro-wrapper relative">
          <div className="skills__intro-container flex-all flex-space-between flex-vert-center h-viewport-small sticky">

            <div className="section__content skills__content flex-all flex-direction-column">
              <SectionLabel className="label--blend" labelCount="02" labelSystem="section.skills" labelTitle="Skills"></SectionLabel>
              <div className="skills__intro-text flex-all flex-direction-column gap-row-1" sa="up-long glacial mirror">
                <h3 className="sub-heading" sa="up slow mirror">
                  <span>
                    Built for <strong className="text-primary">Modern Web Experiences</strong>
                  </span>
                </h3>

                <p>With strengths in concept development, wireframing, prototyping, visual design, and front-end execution, I bring ideas to life through thoughtful problem-solving and user-centered design. Every stage is guided by usability, responsiveness, and precision.</p>

                <Btn to="/skills" primary className="magnetic magnetic--subtle" data-cursor="accent">Explore the Stack</Btn>
              </div>
            </div>

            <div className="skills__intro-decor flex-all flex-horz-center flex-vert-center h-full relative">

              <div className="background__ellipse background__ellipse-1 skills__ellipse-1 ellipse--blue ellipse--small absolute"></div>

              <div className="skills__marquee-wrap">
                <Marquee rtl faded>
                  {MARQUEE_ROW1.map((item) => (
                    <SkillChip key={item.id} {...item} />
                  ))}
                </Marquee>

                <Marquee ltr faded>
                  {MARQUEE_ROW2.map((item) => (
                    <SkillChip key={item.id} {...item} />
                  ))}
                </Marquee>
              </div>

              {WEB_EXPERIENCES.map((item, index) => (
                <ExperienceSkillChip key={item.id} {...item} number={index + 1} />
              ))}

            </div>
          </div>
        </div>      
      </section>

      {/* Work Section */}
      <section className="section section__work" aria-label="Featured Projects">
  
        <div className="work__wrap" ref={wrapRef} role="region" aria-roledescription="horizontal scroll">
          <div className="work__stage flex-all flex-direction-column flex-horz-center h-viewport-small sticky section-padding" ref={stageRef}>
            <div className="background__ellipse background__ellipse-1 work__ellipse-1 ellipse--blue ellipse--medium fixed hidden-mobile"></div>
            <div className="background__ellipse background__ellipse-1 work__ellipse-1 ellipse--blue ellipse--small fixed hidden-tablet hidden-desktop"></div>
            <SectionLabel className="label--blend" labelCount="03" labelSystem="section.work" labelTitle="Featured Work" progressBar></SectionLabel>

            <div className="work__track flex-all" role="list" aria-label="Project cards">
              {WORK_LIST.map((item, index) => (
                <WorkCard key={item.label} {...item} number={index + 1} total={WORK_LIST.length} />
              ))}
            </div>
          </div>
        </div>       
      </section>

      {/* Contact Section */}
      <section className="section section__contact relative section-padding overflow-hidden" aria-label="Contact Information">
      
        <SectionLabel labelCount="04" labelSystem="section.form" labelTitle="Contact"></SectionLabel>
        <div className="contact__container flex-all flex-direction-row flex-space-between flex-wrap">
          <div className="contact__content h-full flex-all flex-direction-column" sa="up-long glacial mirror">
            <div className="content__eyebrow h3 flex-all flex-vert-center" sa="up slow mirror">
              <span className="content__eyebrow-icon flex-all flex-vert-center">
                <svg xmlns='http://www.w3.org/2000/svg' width='18' height='18' viewBox='0 0 18 18' fill='none'>
                  <path
                    d='M16.6808 0C17.0307 0 17.3662 0.138986 17.6136 0.386383C17.861 0.633779 18 0.969321 18 1.31919V11.8727C18 12.2226 17.861 12.5581 17.6136 12.8055C17.3662 13.0529 17.0307 13.1919 16.6808 13.1919C16.3309 13.1919 15.9954 13.0529 15.748 12.8055C15.5006 12.5581 15.3616 12.2226 15.3616 11.8727V4.50372L2.23565 17.6297C1.98685 17.87 1.65362 18.003 1.30773 17.9999C0.961841 17.9969 0.630971 17.8582 0.386382 17.6136C0.141793 17.369 0.00305554 17.0382 4.9869e-05 16.6923C-0.0029558 16.3464 0.130011 16.0132 0.370313 15.7643L13.4963 2.63838H6.12727C5.7774 2.63838 5.44186 2.4994 5.19446 2.252C4.94706 2.00461 4.80808 1.66906 4.80808 1.31919C4.80808 0.969321 4.94706 0.633779 5.19446 0.386383C5.44186 0.138986 5.7774 0 6.12727 0H16.6808Z'
                    fill='#2979FF'></path>
                </svg>
              </span>
              <span className="content__eyebrow-text">Get in Touch</span>
            </div>
            <p>Direct line to Walter, whether you're reaching out about a role, a team, or a potential fit, I'm always open to meaningful conversations around web development. Expect a reply within 24 hours.</p>
          </div>
          <div className="contact__form section__grain --grain-subtle section-padding" sa="left-long glacial mirror">
            <ContactForm />
          </div>
        </div>           
      </section>
    </>
  );
}

export default Home;