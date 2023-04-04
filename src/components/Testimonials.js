import React from 'react';

function Testimonials() {
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

  return (
    <div className="testimonials">
      <h2>Testimonials</h2>
      <div className="testimonial-container"> {/* Add this wrapper */}
        {testimonialData.map((testimonial, index) => (
          <div key={index} className="testimonial">
            <p className="testimonial-message">"{testimonial.message}"</p>
            <p className="testimonial-name">- {testimonial.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Testimonials;
