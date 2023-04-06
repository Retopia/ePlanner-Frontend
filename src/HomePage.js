import React from 'react';
import { useNavigate } from 'react-router-dom';
import './stylesheets/App.css';

const testimonialData = [
  {
    name: 'John Doe',
    message: 'ePlanner made it so easy to organize my events. I highly recommend it!'
  },
  {
    name: 'Jane Smith',
    message: 'I love using ePlanner! It has simplified my event planning process.'
  },
  {
    name: 'Alice Brown',
    message: 'Finally, a platform that takes care of all my event planning needs. Thank you, ePlanner!'
  }
];

function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="App">
      <div className="hero-section">
        <h1>ePlanner</h1>
        <p>Your go-to solution for easy event planning and collaboration with friends and coworkers.</p>
        <button className="button" onClick={() => navigate('/view-events')}>Explore Events</button>
      </div>
      <main>
        <div className="testimonials">
          <h2>Testimonials</h2>
          <div className="testimonial-container"> { }
            {testimonialData.map((testimonial, index) => (
              <div key={index} className="testimonial">
                <p className="testimonial-message">"{testimonial.message}"</p>
                <p className="testimonial-name">- {testimonial.name}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
      <footer className="footer">
        &copy; {new Date().getFullYear()} Preston Tang. All rights reserved.
      </footer>
    </div>
  );
}

export default HomePage;
