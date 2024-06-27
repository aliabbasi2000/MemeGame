import React from 'react';

const Footer = () => {
  const footerStyle = {
    position: 'fixed',
    bottom: '10px',
    right: '10px',
    textAlign: 'right',
    fontSize: '1.5rem',
  };

  return (
    <div style={footerStyle}>
      <h6>
        Developed by <a href="https://github.com/aliabbasi2000" target="_blank" rel="noopener noreferrer">Ali Abbasi</a>
      </h6>
    </div>
  );
};

export default Footer;