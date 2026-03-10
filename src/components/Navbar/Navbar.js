import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const handleOpen = () => setMenuOpen(true);
  const handleClose = () => setMenuOpen("closing");

  const handleAnimationEnd = (e) => {
    // Only fire on the menu element itself, not bubbled events from children
    if (e.target === e.currentTarget && menuOpen === "closing") {
      setMenuOpen(false);
    }
  };

  return (
    <>
      <nav className="navbar" >
        <div className="navbar__container">
          <div className="navbar__background"></div>
          <div className="navbar__logo">
            <Link to="/">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="54"
                height="34"
                viewBox="0 0 445 285"
              >
                <defs>
                  <linearGradient
                    id="draw-a-gradient"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="0%"
                  >
                    <stop offset="0%" stopColor="#4ca1d9" />
                    <stop offset="50%" stopColor="#24265d" />
                    <stop offset="65%" stopColor="#24265d" />
                    <stop offset="100%" stopColor="#4ca1d9" />
                  </linearGradient>
                  <linearGradient
                    id="draw-b-gradient"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="0%"
                  >
                    <stop offset="0%" stopColor="#24265d" />
                    <stop offset="100%" stopColor="#4ca1d9" />
                  </linearGradient>
                  <linearGradient
                    id="draw-c-gradient"
                    x1="0%"
                    y1="0%"
                    x2="0%"
                    y2="100%"
                  >
                    <stop offset="0%" stopColor="#4ca1d9" />
                    <stop offset="75%" stopColor="#24265d" />
                  </linearGradient>
                  <linearGradient
                    id="draw-d-gradient"
                    x1="0%"
                    y1="0%"
                    x2="0%"
                    y2="100%"
                  >
                    <stop offset="0%" stopColor="#4ca1d9" />
                    <stop offset="75%" stopColor="#24265d" />
                  </linearGradient>
                  <linearGradient
                    id="draw-e-gradient"
                    x1="0%"
                    y1="0%"
                    x2="0%"
                    y2="100%"
                  >
                    <stop offset="0%" stopColor="#4ca1d9" />
                    <stop offset="100%" stopColor="#24265d" />
                  </linearGradient>
                </defs>

                <g className="path-a" transform="translate(5.5 5.5)">
                  <path
                    d="m.034.03.43.946.511-.748S1.03.144.972.044C.94.097.48.767.48.767L.15.049S.11-.044.034.029"
                    clipRule="evenodd"
                    fill="url(#draw-a-gradient)"
                    transform="matrix(433.98744 0 0 273.93312 .023 .716)"
                  />
                </g>
                <g className="path-b" transform="translate(5.5 5.5)">
                  <path
                    d="M.479.772.423.655.856.03s.058-.078.116.02z"
                    clipRule="evenodd"
                    fill="url(#draw-b-gradient)"
                    transform="scale(434.66667 274.66667)"
                  />
                </g>
                <g className="path-c" transform="translate(5.5 5.5)">
                  <path
                    d="M.466.97S.452 1 .417 1 .36.976.347.951C.334.927.009.214.009.214S-.027.1.037.029z"
                    clipRule="evenodd"
                    fill="url(#draw-c-gradient)"
                    transform="matrix(434.66667 0 0 274.57989 0 .003)"
                  />
                </g>
                <g className="path-d" transform="translate(5.5 5)">
                  <path
                    d="M.88.97S.808 1.044.764.957L.433.228S.383.118.45.03z"
                    clipRule="evenodd"
                    fill="url(#draw-d-gradient)"
                    transform="matrix(434.66667 0 0 274 1 1.5)"
                  />
                </g>
                <g className="path-e" transform="translate(5.5 5)">
                  <path
                    d="M.448.034S.52-.039.564.049C.61.147.896.777.896.777S.946.883.877.97z"
                    clipRule="evenodd"
                    fill="url(#draw-e-gradient)"
                    transform="matrix(434.66667 1 0 274 1.5 1)"
                  />
                </g>
              </svg>
            </Link>
          </div>
          <div className="navbar__right flex-all flex-vert-center">
            <Link to="/Contact" className="btn">
              <span className="btn__text">Let's Talk</span>
              <span className="btn__arrow">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 18 18"
                  fill="none"
                >
                  <path
                    d="M16.6808 0C17.0307 0 17.3662 0.138986 17.6136 0.386383C17.861 0.633779 18 0.969321 18 1.31919V11.8727C18 12.2226 17.861 12.5581 17.6136 12.8055C17.3662 13.0529 17.0307 13.1919 16.6808 13.1919C16.3309 13.1919 15.9954 13.0529 15.748 12.8055C15.5006 12.5581 15.3616 12.2226 15.3616 11.8727V4.50372L2.23565 17.6297C1.98685 17.87 1.65362 18.003 1.30773 17.9999C0.961841 17.9969 0.630971 17.8582 0.386382 17.6136C0.141793 17.369 0.00305554 17.0382 4.9869e-05 16.6923C-0.0029558 16.3464 0.130011 16.0132 0.370313 15.7643L13.4963 2.63838H6.12727C5.7774 2.63838 5.44186 2.4994 5.19446 2.252C4.94706 2.00461 4.80808 1.66906 4.80808 1.31919C4.80808 0.969321 4.94706 0.633779 5.19446 0.386383C5.44186 0.138986 5.7774 0 6.12727 0H16.6808Z"
                    fill="#2979FF"
                  />
                </svg>
              </span>
            </Link>
            <div className="navbar-right__divider"></div>
            <div
              className={`navbar-right__menu flex-all flex-direction-column flex-vert-center flex-space-between ${menuOpen === true ? "is-active" : ""}`}
              onClick={handleOpen}
            >
              <span className="menu-icon__bar menu-icon__bar--top"></span>
              <span className="menu-icon__bar menu-icon__bar--bottom"></span>
            </div>
          </div>
        </div>
      </nav>

      {/* Menu */}
      <div className={`menu section-padding ${menuOpen === true ? "menu--open" : menuOpen === "closing" ? "menu--closing" : ""}`} onAnimationEnd={handleAnimationEnd}>
        <div className="menu__backdrop hidden" />
        <div className="menu__ellipse menu__ellipse-1"></div>
        <div className="menu__ellipse menu__ellipse-2"></div>        
        <div className="menu__close">
          <div className="menu__close-container flex-all flex-vert-center" onClick={handleClose}>
            <svg className="menu__clip-close" xmlns="http://www.w3.org/2000/svg" width="148.493" height="34" viewBox="0 0 34 34" fill="none">
              <rect id="menu-close-bar-1" x="1.58984" y="0.0998535" width="45.6946" height="2.24728" fill="var(--color-background)" transform="matrix(0.70711,0.70711,-0.70711,0.70711,0.53626,-1.09495)" data-svg-origin="1.589840054512024 0.0998535007238388"></rect>
              <rect id="menu-close-bar-2" x="0.0898438" y="32.311" width="45.6946" height="2.24728" fill="var(--color-background)" transform="matrix(0.70711,-0.70711,0.70711,0.70711,-22.82112,9.5271)" data-svg-origin="0.08984380215406418 32.31100082397461"></rect>
            </svg>
          </div>
        </div>        
        <div className="menu__wrapper">
        </div>
      </div>

      <svg className="menu__clip" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 148 86" width="148" height="86"><defs><clipPath id="menu-bg-clip-tab" clipPathUnits="userSpaceOnUse"><path d="m 32.943424,59.954421 c 0,-9.20246 -0.184,-28.90798 -0.184,-28.90798 C 32.759424,31.046441 30.5785,0 64,0 h 56 c 2.2204,0.01171875 27.76581,0.07081255 28,27.807171 V 86 H 0 c 18.016698,0 32.802223,-3.309432 32.943424,-26.045552 z"></path></clipPath></defs><rect width="148" height="86" fill="currentColor" clipPath="url(#menu-bg-clip-tab)"></rect></svg>
      <svg className="menu__clip" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1706 700" width="100%" height="100%"><defs><clipPath id="menu-bg-clip" clipPathUnits="objectBoundingBox" transform="scale(0.000586510, 0.001272265)"><path d="m 1706,675 c 0,1.56442 -0.4459,25 -31,25 H 28.999986 C 26.17912,700 0,699.991 0,674 V 27 C 0,26.19325 -0.04988178,0 33,0 h 1673 z"></path></clipPath></defs><rect width="1706" height="700" fill="currentColor" clipPath="url(#menu-bg-clip)"></rect></svg>   
    </>
  );
}

export default Navbar;
