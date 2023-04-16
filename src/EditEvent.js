import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './stylesheets/EditEvent.css';
import AddFileModal from './AddFileModal';

function EditEvent({ editMode }) {
  // Extract eventId from URL
  const { eventId } = useParams();
  const [privateChecked, setPrivateChecked] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [showAddFileModal, setShowAddFileModal] = useState(false);
  const [eventDetails, setEventDetails] = useState({
    title: '',
    date: '',
    location: '',
    description: '',
    tags: [],
    visibility: 'public',
    embeddedFiles: [],
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
          const formattedDate = new Date(eventData.time).toISOString().replace("Z", "");

          console.log(eventData);

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

    console.log(eventDetails);

    const formattedEventDetails = {
      ...eventDetails,
      time: eventDetails.date,
      tags: eventDetails.tags.filter((tag) => tag !== ''), // Filter out empty tags
      embeddedFiles: eventDetails.embeddedFiles,
    };

    
    console.log(formattedEventDetails);

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

  const handleFileLinkChange = (index, field, value) => {
    const newEmbeddedFiles = [...eventDetails.embeddedFiles];
    newEmbeddedFiles[index] = { ...newEmbeddedFiles[index], [field]: value };
    setEventDetails({ ...eventDetails, embeddedFiles: newEmbeddedFiles });
  };

  const handleEditFileLink = (index, file) => {
    setShowAddFileModal(true);
    setSelectedFile({ index, file });
  };

  const addFileLink = (file) => {
    setEventDetails({
      ...eventDetails,
      embeddedFiles: [...eventDetails.embeddedFiles, file],
    });
  };
  const removeFileLink = (index) => {
    const newEmbeddedFiles = eventDetails.embeddedFiles.filter((_, i) => i !== index);
    setEventDetails({ ...eventDetails, embeddedFiles: newEmbeddedFiles });
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
        <label>Add Files</label>
        {eventDetails.embeddedFiles.map((file, index) => (
          <div
            key={index}
            className="edit-event-file-row"
            onDoubleClick={() => handleEditFileLink(index, file)}
          >
            <span className="edit-event-file-link">{file.url.length > 20 ? `${file.url.substring(0, 20)}...` : file.url}</span>
            <span className="edit-event-file-type">{file.fileType}</span>
            <button className="edit-event-remove-file-btn" type="button" onClick={() => removeFileLink(index)}>
              X
            </button>
          </div>
        ))}
        <button className="edit-event-add-file-btn" type="button" onClick={() => setShowAddFileModal(true)}>
          Add File
        </button>
        <AddFileModal
          show={showAddFileModal}
          handleClose={() => {
            setShowAddFileModal(false);
            setSelectedFile(null);
          }}
          handleAddFile={(file) => {
            if (selectedFile) {
              handleFileLinkChange(selectedFile.index, 'url', file.url);
              handleFileLinkChange(selectedFile.index, 'fileType', file.fileType);
            } else {
              addFileLink(file);
            }
          }}
          selectedFile={selectedFile}
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
