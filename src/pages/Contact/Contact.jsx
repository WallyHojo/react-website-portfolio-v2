import React, { useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import { useSA, useSARouteSync } from "../../hooks/useScrollAnimate/useScrollAnimate.jsx";
import HeroSection from "../../components/ui/HeroSection";
import OverviewList from "../../components/ui/OverviewList";
import SectionLabel from "../../components/ui/SectionLabel";
import { CONTACT_AVAILABILITY_STATS } from "../../config/overviewStats.jsx";
import Btn from "../../components/ui/Buttons";
import ContactForm from "../../components/ui/ContactForm/Form";
import heroVideo from "../../assets/videos/grok-video-6b5748d3-8abf-4a07-be83-3f7f7a34efea.mp4";
import "./Contact.css";

function Contact() {
  useSA();

  // Sync route changes with scroll animations
  const location = useLocation();
  useSARouteSync(location.pathname);  

  const formSection = useRef(null);
  const navigate = useNavigate();

  const scrollToForm = () => {
    // Scroll to form with offset (e.g., to account for fixed navbar)
    const offset = 200; // Adjust this value to your preferred offset in pixels
    const elementPosition = formSection.current.getBoundingClientRect().top + window.scrollY;
    const offsetPosition = elementPosition - offset;

    window.scrollTo({
      top: offsetPosition,
      behavior: "smooth",
    });

    // Optionally, update the URL without navigating away
    navigate("#form");
  };

  return (
    <>
      {/* Hero Section */}
      <HeroSection
        title="Contact"
        description={
        <p className="text-muted">Great opportunities often begin with a simple conversation. I'm currently seeking a position where I can contribute my experience, collaborate with a talented team, and continue growing both professionally and personally.</p>
        }
        videoSrc={heroVideo}
      >
        <Btn onClick={scrollToForm} primary className="magnetic magnetic--subtle" data-cursor="light">Reach Out</Btn>
      </HeroSection>

      {/* Form Section */}
      <section className="section section__contact section-padding overflow-hidden" aria-label="Contact Information">
        <SectionLabel labelCount="02" labelSystem="section.form" labelTitle="Message Me"></SectionLabel>
        <div className="contact__container flex-all flex-direction-row flex-space-between flex-wrap">
          <div className="contact__content h-full flex-all flex-direction-column" sa="up-long glacial mirror">
            <div className="content__eyebrow h3 flex-all flex-vert-center" sa="up slow mirror">
              <span className="content__eyebrow-icon flex-all flex-vert-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <path d="M16.6808 0C17.0307 0 17.3662 0.138986 17.6136 0.386383C17.861 0.633779 18 0.969321 18 1.31919V11.8727C18 12.2226 17.861 12.5581 17.6136 12.8055C17.3662 13.0529 17.0307 13.1919 16.6808 13.1919C16.3309 13.1919 15.9954 13.0529 15.748 12.8055C15.5006 12.5581 15.3616 12.2226 15.3616 11.8727V4.50372L2.23565 17.6297C1.98685 17.87 1.65362 18.003 1.30773 17.9999C0.961841 17.9969 0.630971 17.8582 0.386382 17.6136C0.141793 17.369 0.00305554 17.0382 4.9869e-05 16.6923C-0.0029558 16.3464 0.130011 16.0132 0.370313 15.7643L13.4963 2.63838H6.12727C5.7774 2.63838 5.44186 2.4994 5.19446 2.252C4.94706 2.00461 4.80808 1.66906 4.80808 1.31919C4.80808 0.969321 4.94706 0.633779 5.19446 0.386383C5.44186 0.138986 5.7774 0 6.12727 0H16.6808Z" fill="#2979FF"></path>
                </svg>
              </span>
              <span className="content__eyebrow-text">Get in Touch</span>
            </div>
            <p>If you have a position, team, or career opportunity that aligns with my experience and skills, I'd love to hear from you. Submit the details, and I'll review your message carefully. Expect a reply within 24 hours.</p>
          </div>
          <div className="contact__form section__grain --grain-subtle section-padding" sa="left-long glacial mirror">
            <ContactForm ref={formSection} />
          </div>
        </div>
      </section>

      {/* Availability Section */}
      <section className="section section__availability section-padding overflow-hidden" aria-label="Contact Availability">
        <SectionLabel labelCount="03" labelSystem="section.availability" labelTitle="Readiness"></SectionLabel>
        <div className="section__container">
          <OverviewList items={CONTACT_AVAILABILITY_STATS} />
        </div>
      </section>
    </>
  );
}

export default Contact;