import React from 'react';
import './Footer.css';

function Footer() {
  return (
    <footer className="footer">
      <p>© {new Date().getFullYear()} YourName. All rights reserved.</p>
    </footer>
  );
}

export default Footer;