import React from 'react';

function HeroSection() {
  return (
    <div className="hero-section">
      <h1>ePlanner</h1>
      <p>Your go-to solution for easy event planning and collaboration with friends and coworkers.</p>
      <button className="button" onClick={() => console.log('Explore Events')}>Explore Events</button>
    </div>
  );
}

export default HeroSection;
