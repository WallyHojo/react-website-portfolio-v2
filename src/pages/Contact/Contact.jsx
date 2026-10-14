import React, { useRef } from "react";
import { useLocation } from "react-router-dom";

import { useSA, useSARouteSync } from "../../hooks/useScrollAnimate/useScrollAnimate.jsx";
import HeroSection from "../../components/ui/HeroSection";
import OverviewList from "../../components/ui/OverviewList";
import SectionLabel from "../../components/ui/SectionLabel";
import { CONTACT_AVAILABILITY_STATS } from "../../config/overviewStats.jsx";
import Btn, { ArrowUpRight } from "../../components/ui/Buttons";
import ContactForm from "../../components/ui/ContactForm/Form";
import { scrollTo } from "../../hooks/lenisController";
import heroVideo from "../../assets/videos/grok-video-6b5748d3-8abf-4a07-be83-3f7f7a34efea.mp4";
import "./Contact.css";

function Contact() {
  useSA();

  // Sync route changes with scroll animations
  const location = useLocation();
  useSARouteSync(location.pathname);

  const formSection = useRef(null);

  // Via Lenis so the smooth-scroll loop doesn't fight a native scroll; -200 clears the navbar
  const scrollToForm = () => scrollTo(formSection.current, { offset: -200 });

  return (
    <>
      {/* Hero Section */}
      <HeroSection title="Contact" metaDescription="Contact Walter Carlson about UI engineering and front-end roles. Send a message through the form and expect a reply within 24 hours." description={<p className="text-muted">Great opportunities often begin with a simple conversation. I'm currently seeking a position where I can contribute my experience, collaborate with a talented team, and continue growing both professionally and personally.</p>} videoSrc={heroVideo}>
        <Btn onClick={scrollToForm} primary className="magnetic magnetic--subtle" data-cursor="light">
          Reach Out
        </Btn>
      </HeroSection>

      {/* Form Section */}
      <section className="section section__contact section-padding overflow-hidden" aria-label="Contact Information">
        <SectionLabel labelCount="02" labelSystem="section.form" labelTitle="Message Me" />
        <div className="contact__container flex-all flex-direction-row flex-space-between flex-wrap">
          <div className="contact__content h-full flex-all flex-direction-column" sa="up-long glacial mirror">
            <div className="content__eyebrow h3 flex-all flex-vert-center" sa="up slow mirror">
              <span className="content__eyebrow-icon flex-all flex-vert-center">
                <ArrowUpRight />
              </span>
              <span className="content__eyebrow-text">Get in Touch</span>
            </div>
            <p>If you have a position, team, or career opportunity that aligns with my experience and skills, I'd love to hear from you. Submit the details, and I'll review your message carefully. Expect a reply within 24 hours.</p>
          </div>
          <div className="contact__form section__grain --grain-medium section-padding" sa="left-long glacial mirror">
            <ContactForm ref={formSection} />
          </div>
        </div>
      </section>

      {/* Availability Section */}
      <section className="section section__availability section-padding overflow-hidden" aria-label="Contact Availability">
        <SectionLabel labelCount="03" labelSystem="section.availability" labelTitle="Readiness" />
        <div className="section__container">
          <OverviewList items={CONTACT_AVAILABILITY_STATS} />
        </div>
      </section>
    </>
  );
}

export default Contact;