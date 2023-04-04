import React from 'react';

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      &copy; {currentYear} Preston Tang. All rights reserved.
    </footer>
  );
}

export default Footer;
