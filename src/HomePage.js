import React from 'react';
import HeroSection from './components/HeroSection';
import EventCategories from './components/EventCategories';
import Testimonials from './components/Testimonials';
import Footer from './components/Footer';
import './App.css';

function HomePage() {
  return (
    <div className="App">
      <HeroSection />
      <main>
        <EventCategories />
        <Testimonials />
      </main>
      <Footer />
    </div>
  );
}

export default HomePage;
