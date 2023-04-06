import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './stylesheets/EditEvent.css';

function EditEvent({ editMode }) {
  // Extract eventId from URL
  const { eventId } = useParams();
  const [privateChecked, setPrivateChecked] = useState(false);
  const [eventDetails, setEventDetails] = useState({
    title: '',
    date: '',
    location: '',
    description: '',
    tags: [],
    visibility: 'public',
  });

  const navigate = useNavigate();

  // Handles the checkbox
  useEffect(() => {
    setEventDetails({ ...eventDetails, visibility: privateChecked ? 'private' : 'public' });
  }, [privateChecked]);

  // Fetch event details when the component mounts
  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        const response = await fetch(`http://localhost:4000/events/edit/${eventId}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
          },
        })

        if (response.ok) {
          const eventData = await response.json();

          // Format the date string
          const formattedDate = new Date(eventData.time).toISOString().split('T')[0];

          setEventDetails({
            ...eventData,
            date: formattedDate,
          });

        } else {
          console.error('Failed to fetch event details');
        }
      } catch (err) {
        console.error('Error fetching event details:', err);
      }
    };

    if (editMode && eventId) {
      fetchEventDetails();
    }
  }, [editMode, eventId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formattedEventDetails = {
      ...eventDetails,
      time: eventDetails.date,
      tags: eventDetails.tags.filter((tag) => tag !== ''), // Filter out empty tags
    };

    const url = editMode
      ? `http://localhost:4000/events/edit/${eventDetails._id}`
      : 'http://localhost:4000/events/create';
    const method = editMode ? 'PUT' : 'POST';

    const response = await fetch(url, {
      method: method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
      },
      body: JSON.stringify(formattedEventDetails),
    });

    if (response.ok) {
      // Redirect to the user's events page
      navigate('/user-page');
    } else {
      // Handle error response
      console.error('Error:', response);
    }
  };

  return (
    <div className="edit-event">
      <h2>{editMode ? 'Edit Event' : 'Create New Event'}</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="title">Title</label>
        <input
          type="text"
          id="title"
          placeholder="My Super Awesome Event!"
          value={eventDetails.title}
          onChange={(e) => setEventDetails({ ...eventDetails, title: e.target.value })}
        />
        <label htmlFor="date">Date & Time</label>
        <input
          type="datetime-local"
          id="date"
          value={eventDetails.date}
          onChange={(e) => setEventDetails({ ...eventDetails, date: e.target.value })}
        />
        <label htmlFor="location">Location</label>
        <input
          type="text"
          id="location"
          placeholder="Event Location"
          value={eventDetails.location}
          onChange={(e) => setEventDetails({ ...eventDetails, location: e.target.value })}
        />
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          placeholder="Event Description"
          value={eventDetails.description}
          onChange={(e) => setEventDetails({ ...eventDetails, description: e.target.value })}
        />
        <label htmlFor="tags">Tags</label>
        <input
          type="text"
          id="tags"
          placeholder="Comma Separated Tags Here"
          value={eventDetails.tags.join(', ')}
          onChange={(e) => setEventDetails({ ...eventDetails, tags: e.target.value.toLowerCase().split(',').map((tag) => tag.trim()) })}
        />
        <label className="private-checkbox-label" htmlFor="private">
          Private?
          <input
            type="checkbox"
            id="private"
            checked={eventDetails.visibility === 'private'}
            onChange={(e) =>
              setEventDetails({
                ...eventDetails,
                visibility: e.target.checked ? 'private' : 'public',
              })
            }
          />
        </label>
        <button type="submit">{editMode ? 'Update Event' : 'Create Event'}</button>
      </form>
    </div>
  );
}

export default EditEvent;
