import React, { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";

import { useSAReplay } from "../../../hooks/useScrollAnimate/useScrollAnimate";
import { useActiveRoute } from "../../../hooks/useActiveRoute";
import Btn from "../../ui/Buttons";
import { NAV_LINKS } from "../../../config/navLinks";
import "./Navbar.css";

// ─── Utilities ────────────────────────────────────────────────────────────────
const cx = (...classes) => classes.filter(Boolean).join(" ");

// ─── Presentational Components ────────────────────────────────────────────────
const Logo = React.memo(() => (
  <svg xmlns="http://www.w3.org/2000/svg" width="54" height="35" viewBox="0 0 320 220" aria-hidden="true">
    <defs>
      <linearGradient id="draw-a-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#52c0ed" />
        <stop offset="50%" stopColor="#3d74a6" />
        <stop offset="100%" stopColor="#262e64" />
      </linearGradient>
      <linearGradient id="draw-b-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#32578b" />
        <stop offset="50%" stopColor="#3d77aa" />
        <stop offset="100%" stopColor="#52c0ed" />
      </linearGradient>
      <linearGradient id="draw-c-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#448bc3" />
        <stop offset="50%" stopColor="#24265d" />
        <stop offset="100%" stopColor="#4b9cd4" />
      </linearGradient>
      <linearGradient id="draw-d-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#4b9dd5" />
        <stop offset="50%" stopColor="#3b679e" />
        <stop offset="100%" stopColor="#262c62" />
      </linearGradient>
      <linearGradient id="draw-e-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#52bfeb" />
        <stop offset="50%" stopColor="#3c6ea1" />
        <stop offset="100%" stopColor="#262c63" />
      </linearGradient>
    </defs>
    <g className="path-a" transform="translate(5.5 5.5)">
      <path clipRule="evenodd" fill="url(#draw-a-gradient)" d="M149.217 206.328c-11.006 10.647-27.583 8.371-35.084-2.486-8.555-12.117-112.074-160-112.074-160S-12.625 22.999 9.282 6.509c.073.11 139.935 199.819 139.935 199.819" />
    </g>
    <g className="path-b" transform="translate(5.5 5.5)">
      <path clipRule="evenodd" fill="url(#draw-b-gradient)" d="m153.961 165.397-15.223-21.687L280.803 6.542S297.71-9.854 315.59 9.267c.032.035-161.629 156.13-161.629 156.13" />
    </g>
    <g className="path-c" transform="translate(5.5 5.5)">
      <path clipRule="evenodd" fill="url(#draw-c-gradient)" d="m9.282 6.51 139.935 199.818 167.224-161.5s17.027-16.394-.851-35.56c-.04-.043-161.64 156.11-161.629 156.129L45.721 10.909S31.09-9.867 9.28 6.51" />
    </g>
    <g className="path-d" transform="translate(5.5 5)">
      <path clipRule="evenodd" fill="url(#draw-d-gradient)" d="M139.963 9.638c23.715-17.857 35.667 3.52 35.667 3.52S280.098 162.441 283.204 166.76c9.562 13.292 4.071 30.462-6.35 38.363.006.029-136.849-195.447-136.891-195.484" />
    </g>
    <g className="path-e" transform="translate(5.5 5)">
      <path clipRule="evenodd" fill="url(#draw-e-gradient)" d="M276.854 205.122c-10.324 7.822-29.45 9.046-39.003-3.998-3.435-4.689-107.642-153.701-107.642-153.701s-14.173-19.875 9.754-37.785c.045.065 136.9 195.482 136.89 195.484" />
    </g>
  </svg>
));

const MenuToggle = React.memo(({ isOpen, onClick }) => (
  <Btn
    plain
    type="button"
    className={cx("navbar-right__menu flex-all flex-direction-column flex-vert-center flex-space-between", isOpen && "is-active")}
    onClick={onClick}
    aria-label="Open navigation menu"
    aria-expanded={isOpen}
    data-cursor="accent"
  >
    <span className="menu-icon__bar menu-icon__bar--top" />
    <span className="menu-icon__bar menu-icon__bar--bottom" />
  </Btn>
));

const MenuClose = React.memo(({ onClick }) => (
  <Btn
    plain
    type="button"
    className="menu__close-container flex-all flex-vert-center"
    onClick={onClick}
    aria-label="Close navigation menu"
    data-cursor="accent"
  >
    <svg className="menu__clip-close" xmlns="http://www.w3.org/2000/svg" width="148.493" height="34" viewBox="0 0 34 34" fill="none" aria-hidden="true">
      <rect id="menu-close-bar-1" x="1.58984" y="0.0998535" width="45.6946" height="2.24728" fill="var(--color-bg-base)" transform="matrix(0.70711,0.70711,-0.70711,0.70711,0.53626,-1.09495)" />
      <rect id="menu-close-bar-2" x="0.0898438" y="32.311" width="45.6946" height="2.24728" fill="var(--color-bg-base)" transform="matrix(0.70711,-0.70711,0.70711,0.70711,-22.82112,9.5271)" />
    </svg>
  </Btn>
));

const MenuClipPaths = React.memo(() => (
  <>
    <svg className="menu__clip absolute" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 148 86" width="148" height="86" aria-hidden="true">
      <defs>
        <clipPath id="menu-bg-clip-tab" clipPathUnits="userSpaceOnUse">
          <path d="m 32.943424,59.954421 c 0,-9.20246 -0.184,-28.90798 -0.184,-28.90798 C 32.759424,31.046441 30.5785,0 64,0 h 56 c 2.2204,0.01171875 27.76581,0.07081255 28,27.807171 V 86 H 0 c 18.016698,0 32.802223,-3.309432 32.943424,-26.045552 z" />
        </clipPath>
      </defs>
      <rect width="148" height="86" fill="currentColor" clipPath="url(#menu-bg-clip-tab)" />
    </svg>
    <svg className="menu__clip absolute" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1706 700" width="100%" height="100%" aria-hidden="true">
      <defs>
        <clipPath id="menu-bg-clip" clipPathUnits="objectBoundingBox" transform="scale(0.000586510, 0.001272265)">
          <path d="m 1706,675 c 0,1.56442 -0.4459,25 -31,25 H 28.999986 C 26.17912,700 0,699.991 0,674 V 27 C 0,26.19325 -0.04988178,0 33,0 h 1673 z" />
        </clipPath>
      </defs>
      <rect width="1706" height="700" fill="currentColor" clipPath="url(#menu-bg-clip)" />
    </svg>
  </>
));

// ─── Hooks ────────────────────────────────────────────────────────────────────
function useScrollHeader() {
  const headerRef = useRef(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const lastScrollTop = useRef(0);
  const rafRef = useRef(null);

  const handleScroll = useCallback(() => {
    const currentScrollTop = window.scrollY;
    const headerHeight = headerRef.current?.offsetHeight ?? 0;

    setIsScrolled(currentScrollTop > headerHeight);
    setIsHeaderVisible(currentScrollTop <= lastScrollTop.current);
    lastScrollTop.current = currentScrollTop;
  }, []);

  useEffect(() => {
    const loop = () => {
      handleScroll();
      rafRef.current = requestAnimationFrame(loop);
    };

    const onScroll = () => {
      if (!rafRef.current) {
        rafRef.current = requestAnimationFrame(loop);
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [handleScroll]);

  return { headerRef, isScrolled, isHeaderVisible };
}

function useMenuState() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false); // false | true | "closing"
  const pendingNav = useRef(null);
  const menuRef = useRef(null);

  const openMenu = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setMenuOpen(true);
  }, []);

  const closeMenu = useCallback((to = null) => {
    pendingNav.current = to;
    setMenuOpen("closing");
  }, []);

  const handleAnimationEnd = useCallback((e) => {
    if (e.target !== e.currentTarget || menuOpen !== "closing") return;
    setMenuOpen(false);
    if (pendingNav.current) {
      navigate(pendingNav.current);
      pendingNav.current = null;
    }
  }, [menuOpen, navigate]);

  // Keyboard escape
  useEffect(() => {
    if (menuOpen !== true) return;
    const handleEsc = (e) => {
      if (e.key === "Escape") closeMenu();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [menuOpen, closeMenu]);

  // Body scroll lock
  useEffect(() => {
    document.documentElement.classList.toggle("no-scroll", menuOpen === true);
  }, [menuOpen]);

  // Focus management
  useEffect(() => {
    if (menuOpen === true && menuRef.current) {
      const firstFocusable = menuRef.current.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
      firstFocusable?.focus();
    }
  }, [menuOpen]);

  return { menuOpen, openMenu, closeMenu, handleAnimationEnd, menuRef };
}

// ─── Main Component ───────────────────────────────────────────────────────────
function Navbar() {
  const { headerRef, isScrolled, isHeaderVisible } = useScrollHeader();
  const { menuOpen, openMenu, closeMenu, handleAnimationEnd, menuRef } = useMenuState();
  const isActive = useActiveRoute();
  const replayRef = useRef(null);
  useSAReplay(replayRef);

  const navClassName = useMemo(() => cx(
    "navbar",
    isScrolled && "navbar__scrolled",
    isHeaderVisible ? "header-visible" : "header-hidden",
    "fixed"
  ), [isScrolled, isHeaderVisible]);

  const menuClassName = useMemo(() => cx(
    "menu section-padding",
    menuOpen === true && "menu--open",
    menuOpen === "closing" && "menu--closing",
    "fixed"
  ), [menuOpen]);

  return (
    <>
      <nav className={navClassName}>
        <div className="navbar__container relative" sa="down slower" ref={headerRef}>
          <div className="navbar__background absolute" />
          <div className="navbar__logo magnetic magnetic--subtle">
            <Btn to="/" plain aria-label="Walter Carlson - UI Engineer Home" data-cursor="light">
              <Logo />
            </Btn>
          </div>
          <div className="navbar__right flex-all">
            <Btn to="/resume" secondary className="btn--no-target">
              Resume
            </Btn>
            <div className="navbar-right__divider" />
            <MenuToggle isOpen={menuOpen === true} onClick={openMenu} />
          </div>
        </div>
      </nav>

      {/* Full-screen menu */}
      <div
        className={menuClassName}
        onAnimationEnd={handleAnimationEnd}
        ref={replayRef}
        role="dialog"
        aria-modal="true"
        aria-label="Main navigation menu"
      >
        <div className="menu__close">
          <MenuClose onClick={() => closeMenu()} />
        </div>

        <div className="menu__wrapper relative">
          <div className="menu__content relative" sa="left-long fade glacial" ref={menuRef}>
            {/* Eyebrow + CTA */}
            <div className="content__eyebrow h3 flex-all flex-vert-center" sa="left slow delay-200">
              <span className="content__eyebrow-icon flex-all flex-vert-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
                  <path d="M16.6808 0C17.0307 0 17.3662 0.138986 17.6136 0.386383C17.861 0.633779 18 0.969321 18 1.31919V11.8727C18 12.2226 17.861 12.5581 17.6136 12.8055C17.3662 13.0529 17.0307 13.1919 16.6808 13.1919C16.3309 13.1919 15.9954 13.0529 15.748 12.8055C15.5006 12.5581 15.3616 12.2226 15.3616 11.8727V4.50372L2.23565 17.6297C1.98685 17.87 1.65362 18.003 1.30773 17.9999C0.961841 17.9969 0.630971 17.8582 0.386382 17.6136C0.141793 17.369 0.00305554 17.0382 4.9869e-05 16.6923C-0.0029558 16.3464 0.130011 16.0132 0.370313 15.7643L13.4963 2.63838H6.12727C5.7774 2.63838 5.44186 2.4994 5.19446 2.252C4.94706 2.00461 4.80808 1.66906 4.80808 1.31919C4.80808 0.969321 4.94706 0.633779 5.19446 0.386383C5.44186 0.138986 5.7774 0 6.12727 0H16.6808Z" fill="#2979FF" />
                </svg>
              </span>
              <span className="content__eyebrow-text">Connect with me!</span>
            </div>
            <div className="menu__content-heading" sa="left slow delay-400">
              Explore My Work, Projects, and Experience
            </div>
            <div className="menu__divider"><hr /></div>
            <div sa="left slow delay-600">
              <Btn
                to="/contact"
                primary
                className="magnetic magnetic--subtle"
                data-cursor="accent"
                onClick={(e) => { e.preventDefault(); closeMenu("/contact"); }}
              >
                Get in Touch
              </Btn>
            </div>
          </div>

          <div className="menu__nav" sa="right-long fade glacial">
            <ul className="menu__nav-links flex-all flex-direction-column">
              <div className="menu__nav-heading" sa="right slow delay-100">
                <h4>Navigation</h4>
                <hr />
              </div>
              {NAV_LINKS.map(({ to, label, animationDelay, exact }, index) => (
                <li
                  key={to}
                  className={cx("menu__nav-link", isActive(to, { exact }) && "--is-active")}
                  sa={`right slow mirror delay-${(index + 1) * 100}`}
                  data-cursor="dark"
                >
                  <Btn
                    to={to}
                    nav
                    className="relative flex-all flex-vert-center"
                    onClick={(e) => { e.preventDefault(); closeMenu(to); }}
                  >
                    {label}
                  </Btn>
                </li>
              ))}
            </ul>
          </div>

          <div className="menu__footer"><hr /></div>
        </div>

        <div className="background__ellipse menu__ellipse-1 ellipse--light ellipse--large absolute" />
        <div className="background__ellipse menu__ellipse-2 ellipse--light ellipse--large absolute" />
      </div>

      <MenuClipPaths />
    </>
  );
}

export default Navbar;