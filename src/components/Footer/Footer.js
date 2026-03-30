import { useEffect, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import { useActiveRoute } from "../../hooks/useActiveRoute";
import { NAV_LINKS } from "../../config/navLinks";
import "./Footer.css";

const WORDMARK = ["W", "a", "l", "t", "e", "r", "\u00A0", "C", "a", "r"];

const SOCIAL_LINKS = [
  {
    href: "https://www.instagram.com/wallykillbot",
    label: "Instagram",
    icon: (
      <svg width='25' height='25' viewBox='0 0 48 48' xmlns='http://www.w3.org/2000/svg' aria-hidden='true'>
        <path d='M 16.5 5 C 10.16639 5 5 10.16639 5 16.5 L 5 31.5 C 5 37.832757 10.166209 43 16.5 43 L 31.5 43 C 37.832938 43 43 37.832938 43 31.5 L 43 16.5 C 43 10.166209 37.832757 5 31.5 5 L 16.5 5 z M 16.5 8 L 31.5 8 C 36.211243 8 40 11.787791 40 16.5 L 40 31.5 C 40 36.211062 36.211062 40 31.5 40 L 16.5 40 C 11.787791 40 8 36.211243 8 31.5 L 8 16.5 C 8 11.78761 11.78761 8 16.5 8 z M 34 12 C 32.895 12 32 12.895 32 14 C 32 15.105 32.895 16 34 16 C 35.105 16 36 15.105 36 14 C 36 12.895 35.105 12 34 12 z M 24 14 C 18.495178 14 14 18.495178 14 24 C 14 29.504822 18.495178 34 24 34 C 29.504822 34 34 29.504822 34 24 C 34 18.495178 29.504822 14 24 14 z M 24 17 C 27.883178 17 31 20.116822 31 24 C 31 27.883178 27.883178 31 24 31 C 20.116822 31 17 27.883178 17 24 C 17 20.116822 20.116822 17 24 17 z' fill='var(--color-text-disabled)' />
      </svg>
    ),
  },
  {
    href: "https://www.linkedin.com/in/walter-carlson-918b6b305/",
    label: "LinkedIn",
    icon: (
      <svg width='25' height='25' viewBox='0 0 32 32' xmlns='http://www.w3.org/2000/svg' aria-hidden='true'>
        <path d='M 8.6425781 4 C 7.1835781 4 6 5.181625 6 6.640625 C 6 8.099625 7.182625 9.3085938 8.640625 9.3085938 C 10.098625 9.3085938 11.283203 8.099625 11.283203 6.640625 C 11.283203 5.182625 10.101578 4 8.6425781 4 z M 21.535156 11 C 19.316156 11 18.0465 12.160453 17.4375 13.314453 L 17.373047 13.314453 L 17.373047 11.310547 L 13 11.310547 L 13 26 L 17.556641 26 L 17.556641 18.728516 C 17.556641 16.812516 17.701266 14.960938 20.072266 14.960938 C 22.409266 14.960937 22.443359 17.145609 22.443359 18.849609 L 22.443359 26 L 26.994141 26 L 27 26 L 27 17.931641 C 27 13.983641 26.151156 11 21.535156 11 z M 6.3632812 11.310547 L 6.3632812 26 L 10.923828 26 L 10.923828 11.310547 L 6.3632812 11.310547 z' fill='var(--color-text-disabled)' />
      </svg>
    ),
  },
  {
    href: "https://github.com/WallyHojo",
    label: "GitHub",
    icon: (
      <svg width='25' height='25' viewBox='0 0 90 90' xmlns='http://www.w3.org/2000/svg' aria-hidden='true'>
        <path d='M90.156 41.965 50.036 1.848a5.913 5.913 0 0 0-8.368 0l-8.332 8.332 10.566 10.566a7.03 7.03 0 0 1 7.23 1.684 7.043 7.043 0 0 1 1.673 7.277l10.183 10.184a7.026 7.026 0 0 1 7.278 1.672 7.04 7.04 0 0 1 0 9.957 7.045 7.045 0 0 1-9.961 0 7.038 7.038 0 0 1-1.532-7.66l-9.5-9.497V59.36a7.04 7.04 0 0 1 1.86 11.29 7.04 7.04 0 0 1-9.957 0 7.04 7.04 0 0 1 0-9.958 7.034 7.034 0 0 1 2.308-1.539V33.926a7.001 7.001 0 0 1-2.308-1.535 7.049 7.049 0 0 1-1.516-7.7L29.242 14.273 1.734 41.777a5.918 5.918 0 0 0 0 8.371L41.855 90.27a5.92 5.92 0 0 0 8.368 0l39.933-39.934a5.925 5.925 0 0 0 0-8.371' fill='var(--color-text-disabled)' />
      </svg>
    ),
  },
  {
    href: "https://drive.google.com/file/d/1FabBBtBRqmpD-Fk3MuP-ike99TGP4hWe/view?usp=sharing",
    label: "Resume (PDF)",
    icon: (
      <svg width='25' height='25' viewBox='0 -960 960 960' xmlns='http://www.w3.org/2000/svg' aria-hidden='true'>
        <path d='M360-460h40v-80h40q17 0 28.5-11.5T480-580v-40q0-17-11.5-28.5T440-660h-80v200Zm40-120v-40h40v40h-40Zm120 120h80q17 0 28.5-11.5T640-500v-120q0-17-11.5-28.5T600-660h-80v200Zm40-40v-120h40v120h-40Zm120 40h40v-80h40v-40h-40v-40h40v-40h-80v200ZM320-240q-33 0-56.5-23.5T240-320v-480q0-33 23.5-56.5T320-880h480q33 0 56.5 23.5T880-800v480q0 33-23.5 56.5T800-240H320Zm0-80h480v-480H320v480ZM160-80q-33 0-56.5-23.5T80-160v-560h80v560h560v80H160Zm160-720v480-480Z' fill='var(--color-text-disabled)' />
      </svg>
    ),
  },
];

const ArrowIcon = () => (
  <svg xmlns='http://www.w3.org/2000/svg' width='18' height='18' viewBox='0 0 18 18' fill='none' aria-hidden='true'>
    <path
      d='M16.6808 0C17.0307 0 17.3662 0.138986 17.6136 0.386383C17.861 0.633779 18 0.969321 18 1.31919V11.8727C18 12.2226 17.861 12.5581 17.6136 12.8055C17.3662 13.0529 17.0307 13.1919 16.6808 13.1919C16.3309 13.1919 15.9954 13.0529 15.748 12.8055C15.5006 12.5581 15.3616 12.2226 15.3616 11.8727V4.50372L2.23565 17.6297C1.98685 17.87 1.65362 18.003 1.30773 17.9999C0.961841 17.9969 0.630971 17.8582 0.386382 17.6136C0.141793 17.369 0.00305554 17.0382 4.9869e-05 16.6923C-0.0029558 16.3464 0.130011 16.0132 0.370313 15.7643L13.4963 2.63838H6.12727C5.7774 2.63838 5.44186 2.4994 5.19446 2.252C4.94706 2.00461 4.80808 1.66906 4.80808 1.31919C4.80808 0.969321 4.94706 0.633779 5.19446 0.386383C5.44186 0.138986 5.7774 0 6.12727 0H16.6808Z'
      fill='var(--color-primary)'
    />
  </svg>
);

// Custom hook to fit the wordmark text within its container
function useWordmarkFit(wrapperRef, lastSpanRef) {
  const fit = useCallback(() => {
    const wrapper = wrapperRef.current;
    const last = lastSpanRef.current;
    if (!wrapper || !last) return;

    const totalWidth = wrapper.offsetWidth;
    const regularSpans = [...wrapper.querySelectorAll("span:not(.clip-last)")];
    const n = regularSpans.length;

    let lo = 1;
    let hi = 1000;

    while (hi - lo > 0.25) {
      const mid = (lo + hi) / 2;
      wrapper.style.fontSize = `${mid}px`;
      const naturalTotal = regularSpans.reduce((sum, s) => sum + s.offsetWidth, 0);
      if (naturalTotal <= totalWidth) lo = mid;
      else hi = mid;
    }

    wrapper.style.fontSize = `${lo}px`;
    last.style.fontSize = `${lo}px`;
    last.style.width = `${(totalWidth / (n + 0.5)) * 0.5}px`;
  }, [wrapperRef, lastSpanRef]);

  useEffect(() => {
    fit();

    const ro = new ResizeObserver((entries, observer) => {
      window.requestAnimationFrame(() => {
        if (!Array.isArray(entries) || !entries.length) return;
        fit();
      });
    });

    if (wrapperRef.current) ro.observe(wrapperRef.current);
    return () => ro.disconnect();
  }, [fit, wrapperRef]);
}

function Footer() {
  // Get active route function from custom hook
  const isActive = useActiveRoute();

  // Refs for the wordmark fitting
  const wrapperRef = useRef(null);
  const lastSpanRef = useRef(null);
  // Use the custom hook to fit the wordmark text
  useWordmarkFit(wrapperRef, lastSpanRef);

  return (
    <footer className='footer section-padding'>
      <div className='footer__top'>
        <div className='footer__top--left'>
          <nav className='footer__nav' aria-label='Footer navigation'>
            <ul className='footer__nav-links menu__nav-links'>
              {NAV_LINKS.map(({ to, label, animationDelay, exact }) => (
                <li key={to} className={`menu__nav-link ${isActive(to, { exact }) ? "--is-active" : ""}`.trim()} sa={`right slow ${animationDelay}`} data-cursor="light">
                  <span className='menu__nav-arrow'>
                    <ArrowIcon />
                  </span>
                  <Link to={to}>{label}</Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className='footer__top--right'>
          <Link to='/contact' className='btn' sa='left slow'>
            <span className='btn__text'>Get In Touch</span>
            <span className='btn__arrow'>
              <ArrowIcon />
            </span>
          </Link>
        </div>
      </div>

      <div className='footer__middle'>
        <div className='footer__middle--name' ref={wrapperRef} aria-label='Walter Carlson'>
          {WORDMARK.slice(0, -1).map((char, i) => (
            <span key={i} sa='left mirror glacial'>{char}</span>
          ))}
          <span ref={lastSpanRef} className='clip-last'sa='left mirror glacial'>{WORDMARK[WORDMARK.length - 1]}</span>
        </div>
        <hr className='footer__divider' />
      </div>
      <div className='footer__bottom'>
        <div className='footer__bottom--left' sa='up mirror slow'>
          <p className='footer__copyright'>© {new Date().getFullYear()} Walter Carlson. All rights reserved.</p>
        </div>
        <div className='footer__bottom--middle' sa='up mirror slow delay-100'>
          <ul className='footer__nav-socials' aria-label='Social links'>
            {SOCIAL_LINKS.map(({ href, label, icon }) => (
              <li key={label}>
                <a href={href} target='_blank' rel='noopener noreferrer' aria-label={label} data-cursor="light">
                  {icon}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}

export default Footer;