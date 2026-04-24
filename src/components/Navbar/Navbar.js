import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { useSAReplay } from "../../hooks/useScrollAnimate/useScrollAnimate";
import { useActiveRoute } from "../../hooks/useActiveRoute";
import { NAV_LINKS } from "../../config/navLinks";
import "./Navbar.css";

function Navbar() {
  /*
  Header scroll up/down
  */
  const [headerHeight, setHeaderHeight] = useState(0); //ref for header height
  const refHeaderHeight = useRef(null); //create the ref

  const [isScrolled, setIsScrolled] = useState(false);
  const lastScrollTop = useRef(0); // To track the last scroll position
  const scrollTimeoutRef = useRef(null); // To handle timeout for showing the header

  useEffect(() => {
    if (refHeaderHeight.current) {
      setHeaderHeight(refHeaderHeight.current.offsetHeight);
    }

    const handleScroll = () => {
      const headerHeight = refHeaderHeight.current.offsetHeight;
      const currentScrollTop = window.scrollY;

      // Determine if the user has scrolled past the header height
      setIsScrolled(currentScrollTop > headerHeight);

      // Update last scroll position
      lastScrollTop.current = currentScrollTop;

      // Clear the previous timeout if it exists
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };

    // Add scroll event listener
    window.addEventListener("scroll", handleScroll);

    // Cleanup event listener on component unmount
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [headerHeight]);

  /*
  Menu open/close
  */
  const [menuOpen, setMenuOpen] = useState(false);
  const handleOpen = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setMenuOpen(true);
  };
  const handleClose = () => setMenuOpen("closing");

  useEffect(() => {
    // Body class add/remove on menu open/close
    if (menuOpen === true) {
      document.body.classList.add('no-scroll');
    } else {
      document.body.classList.remove('no-scroll');
    }
  }, [menuOpen]);  

  const handleAnimationEnd = (e) => {
    // Only fire on the menu element itself, not bubbled events from children
    if (e.target === e.currentTarget && menuOpen === "closing") {
      setMenuOpen(false);
    }
  };

  const isActive = useActiveRoute();

  const replayRef = useRef(null);
  useSAReplay(replayRef);

  return (
    <>
      {/* Navigation */}
      <nav className={`navbar navbar ${isScrolled ? "navbar__scrolled" : ""}`}>
        <div className='navbar__container' sa='down slower' ref={refHeaderHeight}>
          <div className='navbar__background'></div>
          <div className='navbar__logo'>
            <Link to='/'>
              <svg xmlns='http://www.w3.org/2000/svg' width='54' height='35' viewBox='0 0 320 220'>
                <defs>
                  <linearGradient id='draw-a-gradient' x1='0%' y1='0%' x2='100%' y2='100%'>
                    <stop offset='0%' stopColor='#52c0ed'></stop>
                    <stop offset='50%' stopColor='#3d74a6'></stop>
                    <stop offset='100%' stopColor='#262e64'></stop>
                  </linearGradient>
                  <linearGradient id='draw-b-gradient' x1='0%' y1='0%' x2='100%' y2='0%'>
                    <stop offset='0%' stopColor='#32578b'></stop>
                    <stop offset='50%' stopColor='#3d77aa'></stop>
                    <stop offset='100%' stopColor='#52c0ed'></stop>
                  </linearGradient>
                  <linearGradient id='draw-c-gradient' x1='0%' y1='0%' x2='100%' y2='0%'>
                    <stop offset='0%' stopColor='#448bc3'></stop>
                    <stop offset='50%' stopColor='#24265d'></stop>
                    <stop offset='100%' stopColor='#4b9cd4'></stop>
                  </linearGradient>
                  <linearGradient id='draw-d-gradient' x1='0%' y1='0%' x2='100%' y2='100%'>
                    <stop offset='0%' stopColor='#4b9dd5'></stop>
                    <stop offset='50%' stopColor='#3b679e'></stop>
                    <stop offset='100%' stopColor='#262c62'></stop>
                  </linearGradient>
                  <linearGradient id='draw-e-gradient' x1='0%' y1='0%' x2='100%' y2='100%'>
                    <stop offset='0%' stopColor='#52bfeb'></stop>
                    <stop offset='50%' stopColor='#3c6ea1'></stop>
                    <stop offset='100%' stopColor='#262c63'></stop>
                  </linearGradient>
                </defs>

                <g className='path-a' transform='translate(5.5 5.5)'>
                  <path clipRule='evenodd' fill='url(#draw-a-gradient)' d='M149.217 206.328c-11.006 10.647-27.583 8.371-35.084-2.486-8.555-12.117-112.074-160-112.074-160S-12.625 22.999 9.282 6.509c.073.11 139.935 199.819 139.935 199.819'
                  />
                </g>

                <g className='path-b' transform='translate(5.5 5.5)'>
                  <path clipRule='evenodd' fill='url(#draw-b-gradient)' d='m153.961 165.397-15.223-21.687L280.803 6.542S297.71-9.854 315.59 9.267c.032.035-161.629 156.13-161.629 156.13' />
                </g>

                <g className='path-c' transform='translate(5.5 5.5)'>
                  <path clipRule='evenodd' fill='url(#draw-c-gradient)' d='m9.282 6.51 139.935 199.818 167.224-161.5s17.027-16.394-.851-35.56c-.04-.043-161.64 156.11-161.629 156.129L45.721 10.909S31.09-9.867 9.28 6.51' />
                </g>

                <g className='path-d' transform='translate(5.5 5)'>
                  <path clipRule='evenodd' fill='url(#draw-d-gradient)' d='M139.963 9.638c23.715-17.857 35.667 3.52 35.667 3.52S280.098 162.441 283.204 166.76c9.562 13.292 4.071 30.462-6.35 38.363.006.029-136.849-195.447-136.891-195.484'
                  />
                </g>

                <g className='path-e' transform='translate(5.5 5)'>
                  <path clipRule='evenodd' fill='url(#draw-e-gradient)' d='M276.854 205.122c-10.324 7.822-29.45 9.046-39.003-3.998-3.435-4.689-107.642-153.701-107.642-153.701s-14.173-19.875 9.754-37.785c.045.065 136.9 195.482 136.89 195.484'
                  />
                </g>
              </svg>
            </Link>
          </div>
          <div className='navbar__right flex-all flex-vert-center'>
            <Link to='/resume' className='btn'>
              <span className='btn__text'>Resume</span>
              <span className='btn__arrow'>
                <svg xmlns='http://www.w3.org/2000/svg' width='18' height='18' viewBox='0 0 18 18' fill='none'>
                  <path
                    d='M16.6808 0C17.0307 0 17.3662 0.138986 17.6136 0.386383C17.861 0.633779 18 0.969321 18 1.31919V11.8727C18 12.2226 17.861 12.5581 17.6136 12.8055C17.3662 13.0529 17.0307 13.1919 16.6808 13.1919C16.3309 13.1919 15.9954 13.0529 15.748 12.8055C15.5006 12.5581 15.3616 12.2226 15.3616 11.8727V4.50372L2.23565 17.6297C1.98685 17.87 1.65362 18.003 1.30773 17.9999C0.961841 17.9969 0.630971 17.8582 0.386382 17.6136C0.141793 17.369 0.00305554 17.0382 4.9869e-05 16.6923C-0.0029558 16.3464 0.130011 16.0132 0.370313 15.7643L13.4963 2.63838H6.12727C5.7774 2.63838 5.44186 2.4994 5.19446 2.252C4.94706 2.00461 4.80808 1.66906 4.80808 1.31919C4.80808 0.969321 4.94706 0.633779 5.19446 0.386383C5.44186 0.138986 5.7774 0 6.12727 0H16.6808Z'
                    fill='#2979FF'
                  />
                </svg>
              </span>
            </Link>
            <div className='navbar-right__divider'></div>
            <div className={`navbar-right__menu flex-all flex-direction-column flex-vert-center flex-space-between ${menuOpen === true ? "is-active" : ""}`} onClick={handleOpen} data-cursor='accent'>
              <span className='menu-icon__bar menu-icon__bar--top'></span>
              <span className='menu-icon__bar menu-icon__bar--bottom'></span>
            </div>
          </div>
        </div>
      </nav>

      {/* Menu */}
      <div className={`menu section-padding ${menuOpen === true ? "menu--open" : menuOpen === "closing" ? "menu--closing" : ""}`} onAnimationEnd={handleAnimationEnd} ref={replayRef}>
        <div className='menu__close'>
          <div className='menu__close-container flex-all flex-vert-center' onClick={handleClose} data-cursor='accent'>
            <svg className='menu__clip-close' xmlns='http://www.w3.org/2000/svg' width='148.493' height='34' viewBox='0 0 34 34' fill='none'>
              <rect
                id='menu-close-bar-1'
                x='1.58984'
                y='0.0998535'
                width='45.6946'
                height='2.24728'
                fill='var(--color-bg-base)'
                transform='matrix(0.70711,0.70711,-0.70711,0.70711,0.53626,-1.09495)'
                data-svg-origin='1.589840054512024 0.0998535007238388'></rect>
              <rect
                id='menu-close-bar-2'
                x='0.0898438'
                y='32.311'
                width='45.6946'
                height='2.24728'
                fill='var(--color-bg-base)'
                transform='matrix(0.70711,-0.70711,0.70711,0.70711,-22.82112,9.5271)'
                data-svg-origin='0.08984380215406418 32.31100082397461'></rect>
            </svg>
          </div>
        </div>
        <div className='menu__wrapper'>
          <div className='menu__content' sa='left-long fade glacial'>
            <div className='menu__eyebrow flex-all flex-vert-center' sa='left slow delay-200'>
              <span className='menu__eyebrow-icon flex-all flex-vert-center'>
                <svg xmlns='http://www.w3.org/2000/svg' width='18' height='18' viewBox='0 0 18 18' fill='none'>
                  <path
                    d='M16.6808 0C17.0307 0 17.3662 0.138986 17.6136 0.386383C17.861 0.633779 18 0.969321 18 1.31919V11.8727C18 12.2226 17.861 12.5581 17.6136 12.8055C17.3662 13.0529 17.0307 13.1919 16.6808 13.1919C16.3309 13.1919 15.9954 13.0529 15.748 12.8055C15.5006 12.5581 15.3616 12.2226 15.3616 11.8727V4.50372L2.23565 17.6297C1.98685 17.87 1.65362 18.003 1.30773 17.9999C0.961841 17.9969 0.630971 17.8582 0.386382 17.6136C0.141793 17.369 0.00305554 17.0382 4.9869e-05 16.6923C-0.0029558 16.3464 0.130011 16.0132 0.370313 15.7643L13.4963 2.63838H6.12727C5.7774 2.63838 5.44186 2.4994 5.19446 2.252C4.94706 2.00461 4.80808 1.66906 4.80808 1.31919C4.80808 0.969321 4.94706 0.633779 5.19446 0.386383C5.44186 0.138986 5.7774 0 6.12727 0H16.6808Z'
                    fill='#2979FF'></path>
                </svg>
              </span>
              <span className='menu__eyebrow-text'>Connect with me!</span>
            </div>
            <div className='menu__content-heading' sa='left slow delay-400'>
              Explore My Work, Projects, and Experience
            </div>
            <div className='menu__divider'>
              <hr />
            </div>
            <Link to='/contact' className='btn btn-primary' sa='left slow delay-600' data-cursor='light'>
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
          <div className='menu__nav' sa='right-long fade glacial'>
            <ul className='menu__nav-links'>
              <div className='menu__nav-heading' sa='right slow delay-100'>
                <h4>Navigation</h4>
                <hr />
              </div>

              {/* Navigation Links */}
              {NAV_LINKS.map(({ to, label, animationDelay, exact }) => (
                <li className={`menu__nav-link ${isActive(to, { exact }) ? "--is-active" : ""}`.trim()} key={to} sa={`right slow ${animationDelay}`} data-cursor="dark">
                  <span className='menu__nav-arrow'>
                    <svg xmlns='http://www.w3.org/2000/svg' width='18' height='18' viewBox='0 0 18 18' fill='none'>
                      <path
                        d='M16.6808 0C17.0307 0 17.3662 0.138986 17.6136 0.386383C17.861 0.633779 18 0.969321 18 1.31919V11.8727C18 12.2226 17.861 12.5581 17.6136 12.8055C17.3662 13.0529 17.0307 13.1919 16.6808 13.1919C16.3309 13.1919 15.9954 13.0529 15.748 12.8055C15.5006 12.5581 15.3616 12.2226 15.3616 11.8727V4.50372L2.23565 17.6297C1.98685 17.87 1.65362 18.003 1.30773 17.9999C0.961841 17.9969 0.630971 17.8582 0.386382 17.6136C0.141793 17.369 0.00305554 17.0382 4.9869e-05 16.6923C-0.0029558 16.3464 0.130011 16.0132 0.370313 15.7643L13.4963 2.63838H6.12727C5.7774 2.63838 5.44186 2.4994 5.19446 2.252C4.94706 2.00461 4.80808 1.66906 4.80808 1.31919C4.80808 0.969321 4.94706 0.633779 5.19446 0.386383C5.44186 0.138986 5.7774 0 6.12727 0H16.6808Z'
                        fill='#2979FF'
                      />
                    </svg>
                  </span>
                  <Link to={to}>{label}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div className='menu__footer'>
            <hr />
          </div>
        </div>
        <div className='background__ellipse background__ellipse-1 ellipse--light ellipse--large'></div>
        <div className='background__ellipse background__ellipse-2 ellipse--light ellipse--large'></div>
      </div>

      {/* Menu Clipping Paths */}
      <svg className='menu__clip' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 148 86' width='148' height='86'>
        <defs>
          <clipPath id='menu-bg-clip-tab' clipPathUnits='userSpaceOnUse'>
            <path d='m 32.943424,59.954421 c 0,-9.20246 -0.184,-28.90798 -0.184,-28.90798 C 32.759424,31.046441 30.5785,0 64,0 h 56 c 2.2204,0.01171875 27.76581,0.07081255 28,27.807171 V 86 H 0 c 18.016698,0 32.802223,-3.309432 32.943424,-26.045552 z'></path>
          </clipPath>
        </defs>
        <rect width='148' height='86' fill='currentColor' clipPath='url(#menu-bg-clip-tab)'></rect>
      </svg>
      <svg className='menu__clip' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1706 700' width='100%' height='100%'>
        <defs>
          <clipPath id='menu-bg-clip' clipPathUnits='objectBoundingBox' transform='scale(0.000586510, 0.001272265)'>
            <path d='m 1706,675 c 0,1.56442 -0.4459,25 -31,25 H 28.999986 C 26.17912,700 0,699.991 0,674 V 27 C 0,26.19325 -0.04988178,0 33,0 h 1673 z'></path>
          </clipPath>
        </defs>
        <rect width='1706' height='700' fill='currentColor' clipPath='url(#menu-bg-clip)'></rect>
      </svg>
    </>
  );
}

export default Navbar;