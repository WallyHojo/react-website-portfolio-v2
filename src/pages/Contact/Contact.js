import React, { useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSA } from '../../hooks/useScrollAnimate/useScrollAnimate';
import { useDotGrid, DotGrid } from "../../hooks/useDotGrid";
import ContactForm from '../../components/Form/Form.js';
import './Contact.css';

// Assets
import handleDots from "../../assets/images/handle-dots.svg";
import arrowDown from "../../assets/images/arrow-down.svg";
import arrowRight from "../../assets/images/arrow-right.svg";
import diagnalLines from "../../assets/images/diagnal-lines.svg";

function Contact() {
  useDotGrid();  
  useSA();

  const formSection = useRef(null);
  const navigate = useNavigate();

  const scrollToForm = () => {
    // Scroll to form with offset (e.g., to account for fixed navbar)
    const offset = 100; // Adjust this value to your preferred offset in pixels
    const elementPosition = formSection.current.getBoundingClientRect().top + window.scrollY;
    const offsetPosition = elementPosition - offset;

    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    });
    
    // Optionally, update the URL without navigating away
    navigate('#form');
  };  

  return (
    <>
    <section className='section section__hero section__grain --grain-medium section-padding' aria-label='Contact Heading and Introduction'>
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
      </div>
      <div className='hero__content flex-all flex-vert-bottom h-full'>
        <div className='content__left' sa='fade glacial'>
          <h1 className='heading'>Send a Message</h1>
          <p className='text-muted'>I’m currently open to full-time and contract opportunities in web development and digital product work. If you’re hiring or exploring a role that aligns with my experience, I’d love to hear from you.</p>
          <Link onClick={scrollToForm} className='btn btn-primary' data-cursor='light'>
            <span className='btn__text'>Reach Out</span>
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

    <section className="section section__contact section-padding relative" aria-label="Contact Information">
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
          01 form
        </span>
      </div>
      <div className="contact__container flex-all flex-direction-row flex-space-between flex-wrap">
        <div className="contact__content flex-all flex-direction-column" sa="up slower mirror delay-400">
          <div class="menu__eyebrow flex-all flex-vert-center sa-visible sa-enter-up" sa="left slow delay-200"><span class="menu__eyebrow-icon flex-all flex-vert-center"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M16.6808 0C17.0307 0 17.3662 0.138986 17.6136 0.386383C17.861 0.633779 18 0.969321 18 1.31919V11.8727C18 12.2226 17.861 12.5581 17.6136 12.8055C17.3662 13.0529 17.0307 13.1919 16.6808 13.1919C16.3309 13.1919 15.9954 13.0529 15.748 12.8055C15.5006 12.5581 15.3616 12.2226 15.3616 11.8727V4.50372L2.23565 17.6297C1.98685 17.87 1.65362 18.003 1.30773 17.9999C0.961841 17.9969 0.630971 17.8582 0.386382 17.6136C0.141793 17.369 0.00305554 17.0382 4.9869e-05 16.6923C-0.0029558 16.3464 0.130011 16.0132 0.370313 15.7643L13.4963 2.63838H6.12727C5.7774 2.63838 5.44186 2.4994 5.19446 2.252C4.94706 2.00461 4.80808 1.66906 4.80808 1.31919C4.80808 0.969321 4.94706 0.633779 5.19446 0.386383C5.44186 0.138986 5.7774 0 6.12727 0H16.6808Z" fill="#2979FF"></path></svg></span><span class="menu__eyebrow-text">Get in Touch</span></div>          
          <h3 className="sub-heading">
              Whether it’s a role, collaboration, or opportunity, <strong><span className="text-primary">feel free to reach out.</span></strong>
          </h3>
          <p>
            Use the form to share a bit about what you're working on or the position you have in mind. I’ll review every message and respond as soon as I can.
          </p>
        </div>
        <div className="contact__form relative" id="form" ref={formSection}>
          <ContactForm />
        </div>
      </div>
    </section>
    </>
  );
}

export default Contact;