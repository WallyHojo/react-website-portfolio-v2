import React from "react";
import { Link } from "react-router-dom";
import { useActiveRoute } from "../../hooks/useActiveRoute";
import { NAV_LINKS } from "../../config/navLinks";
import './Footer.css';

function Footer() {
  const isActive = useActiveRoute();
  
  return (
    <footer className="footer">

      <ul>
        {/* Navigation Links */}
        {NAV_LINKS.map(({ to, label, animationDelay, exact }) => (
          <li className={`menu__nav-link ${isActive(to, { exact }) ? "--is-active" : ""}`.trim()} key={to} sa={`right slow ${animationDelay}`}>
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

      <p>© {new Date().getFullYear()} YourName. All rights reserved.</p>
    </footer>
  );
}

export default Footer;