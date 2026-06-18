import React, { useState, useEffect } from "react";

import { useIsMobile } from "../../../hooks/useIsMobile.jsx";
import Btn from "../../ui/Buttons";
import { NameSVG } from "../../brand/Name";
import { useActiveRoute } from "../../../hooks/useActiveRoute";
import { NAV_LINKS } from "../../../config/navLinks";
import { SOCIAL_LINKS } from "../../../config/socialLinks";
import { useSAMediaSync } from "../../../hooks/useScrollAnimate/useScrollAnimate";
import "./Footer.css";

function Footer() {
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Get active route function from custom hook
  const isActive = useActiveRoute();

  // Handle scroll to top button visibility
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Scroll to top with smooth behavior
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  const isMobile = useIsMobile();
  useSAMediaSync("(min-width: 768px)");

  return (
    <footer className='footer section-padding overflow-hidden'>
      <div className='footer__top flex-all flex-vert-center flex-wrap section-padding'>
        <div className='footer__top--left'>
          <nav className='footer__nav' aria-label='Footer navigation'>
            <ul className='footer__nav-links menu__nav-links flex-all flex-space-between' sa='right-long slow mirror'>
            {NAV_LINKS
              .filter(({ mobileLabel }) => !(isMobile && mobileLabel === false))
              .map(({ to, label, exact, mobileLabel }, index) => (
                <li
                  key={to}
                  className={['menu__nav-link',`nav-link__${label.toLowerCase()}`,isActive(to, { exact }) && '--is-active'
                  ].filter(Boolean).join(' ')}
                  sa={`right slow mirror delay-${(index + 1) * 100}`}
                  data-cursor="light"
                >
                  <Btn to={to} nav className="relative flex-all flex-vert-center">
                    {label}
                  </Btn>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className='footer__top--right'>
          <Btn to='/contact' secondary className="btn--no-target" sa='left-long glacial mirror delay-200'>Get in Touch</Btn>
        </div>
      </div>

      <div className='footer__middle section-padding'>
        <div className='footer__middle--name' aria-label='Walter Carlson'>
          <NameSVG />
        </div>
      </div>

      <div className='footer__divider section-padding'><hr /></div>

      <div className='footer__bottom flex-all flex-vert-center flex-wrap section-padding'>
        <div className='footer__bottom--left' sa='up glacial mirror delay-200'>
          <p className='footer__copyright'>© {new Date().getFullYear()} Walter Carlson. All rights reserved.</p>
        </div>
        <div className='footer__bottom--middle' sa='up glacial mirror delay-400'>
          <ul className='footer__nav-socials' aria-label='Social links'>
            {SOCIAL_LINKS.map(({ href, label, icon }) => (
              <li key={label}>
                <a href={href} target='_blank' rel='noopener noreferrer' aria-label={label} data-cursor='light'>
                  {icon}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <Btn onClick={scrollToTop} secondary textless className={`scroll-to-top${showScrollTop ? ' scroll-to-top--visible' : ''}`} aria-label='Scroll to top' data-cursor='light'></Btn>      
    </footer>
  );
}

export default Footer;