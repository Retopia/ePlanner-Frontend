import React, { useState } from 'react';
import { FaSearch, FaTimes } from 'react-icons/fa'; // Import FaTimes icon

function EventCategories() {
  const categories = ['Sports', 'Movie', 'Music', 'Art', 'Theater', 'Education', 'Technology', 'Food & Drink', 'Health', 'Business', 'Community', 'Travel'];
  const [selectedCategories, setSelectedCategories] = useState([]);

  const handleCategoryClick = (category) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(selectedCategories.filter((item) => item !== category));
    } else {
      setSelectedCategories([...selectedCategories, category]);
    }
  };

  const removeCategory = (category) => {
    const newSelectedCategories = selectedCategories.filter((item) => item !== category);
    setSelectedCategories(newSelectedCategories);
  };

  return (
    <div className="event-categories">
      <h2>Try with some of our most popular categories</h2> {/* Add header */}
      <div className="search-container">
        <div className="category-search-bar">
          {selectedCategories.map((category) => (
            <div className="selected-category" key={category}>
              <span className="category-text">{category}</span> {/* Wrap the text in a span */}
              <button
                className="remove-category-btn"
                onClick={() => removeCategory(category)}
              >
                <FaTimes />
              </button>
            </div>
          ))}
        </div>
        <button className="search-btn">
          <FaSearch />
        </button>
      </div>
      <div className="category-grid">
        {categories.map((category, index) => (
          <button key={index} className={`category-widget${selectedCategories.includes(category) ? ' selected' : ''}`} onClick={() => handleCategoryClick(category)}>
            {category}
          </button>
        ))}
      </div>
    </div>
  );
}

export default EventCategories;
