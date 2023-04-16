import React, { useState, useEffect } from 'react';
import { FaChevronDown, FaChevronUp, FaEllipsisV } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import './stylesheets/UserPage.css';

function UserPage() {
    const [isProfileSettingsOpen, setIsProfileSettingsOpen] = useState(true);
    const [isMyEventsOpen, setIsMyEventsOpen] = useState(true);
    const [username, setUsername] = useState(localStorage.getItem('username'));
    const [oldPassword, setOldPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [events, setEvents] = useState([]);

    // To support page navigation
    const navigate = useNavigate();

    // Function to handle changes in the username and password fields
    const handleUsernameChange = (e) => setUsername(e.target.value);
    const handleOldPasswordChange = (e) => setOldPassword(e.target.value);
    const handleNewPasswordChange = (e) => setNewPassword(e.target.value);

    // Handles the "Delete Event" action in the kebab menu
    const handleDeleteEvent = async (eventId) => {
        try {
            const response = await fetch(process.env.REACT_APP_SERVER + `/events/${eventId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
                },
            });

            if (response.ok) {
                setEvents(events.filter((event) => event._id !== eventId));
            } else {
                console.error('Failed to delete event');
            }
        } catch (err) {
            console.error('Error deleting event:', err);
        }
    };

    // Function to handle the "Save Settings" button click
    const handleSaveSettings = async () => {
        if (username.length < 3 || username.length > 18) {
            setErrorMessage("Username must be between 3 to 18 characters");
        } else if (oldPassword !== "" && (newPassword.length < 3 || newPassword.length > 30)) {
            setErrorMessage("Your new password must be between 3 to 30 characters");
        } else if ((username !== '' && username !== localStorage.getItem("username")) || (oldPassword !== '' && newPassword !== '')) {
            // Send the request to the server to store the changes in the database
            const response = await fetch(process.env.REACT_APP_SERVER + '/users/settings', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
                },
                body: JSON.stringify({ username, oldPassword, newPassword }),
            });

            if (response.ok) {
                // Handle successful response
                setErrorMessage('');
                localStorage.setItem('username', username);
                window.location.reload();
            } else {
                // Handle error response
                const errorData = await response.json();
                setErrorMessage(errorData.error || errorData.message);
            }
        }
    };

    const fetchEvents = async () => {
        try {
            const response = await fetch(process.env.REACT_APP_SERVER + '/events', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
                },
                body: JSON.stringify({ username: localStorage.getItem("username") }),
            });

            if (response.ok) {
                const eventData = await response.json();
                setEvents(eventData);
            } else {
                console.error('Failed to fetch events');
            }
        } catch (err) {
            console.error('Error fetching events:', err);
        }
    };

    useEffect(() => {
        fetchEvents();
    }, []);

    async function fetchEvent(eventId) {
        const token = localStorage.getItem("accessToken");
        const headers = token ? { "Authorization": `Bearer ${token}` } : {};

        const url = `/view/events/${eventId}?`;
        const res = await fetch(url, { headers });
        const event = await res.json();

        if (res.ok) {
            return event;
        } else {
            throw new Error(event.error);
        }
    }

    // Event component
    const Event = ({ eventId, eventName, description, date, location, tags }) => {
        const [isKebabMenuOpen, setIsKebabMenuOpen] = useState(false);

        const formattedDate = new Date(date).toLocaleString('en-US', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
        });

        const formattedTime = new Date(date).toLocaleString('en-US', {
            hour: 'numeric',
            minute: 'numeric',
            hour12: true,
        });

        const handleClick = async () => {
            try {
                await fetchEvent(eventId);
                navigate(`/view/events/${eventId}`);
            } catch (err) {
            }
        };

        const handleKebabMenuClick = (e) => {
            e.stopPropagation();
            setIsKebabMenuOpen(!isKebabMenuOpen);
        };

        const handleEditEventClick = (e) => {
            e.stopPropagation();
            navigate(`/events/edit/${eventId}`);
        };

        const handleDeleteEventClick = (e) => {
            e.stopPropagation();
            handleDeleteEvent(eventId);
        };

        return (
            <div className="example-event" onClick={handleClick}>
                <FaEllipsisV
                    className="kebab-menu-icon"
                    onClick={handleKebabMenuClick}
                />
                {isKebabMenuOpen && (
                    <div className="kebab-menu">
                        <div className="kebab-menu-item" onClick={handleEditEventClick}>Edit Event</div>
                        <div className="kebab-menu-item delete" onClick={handleDeleteEventClick}>Delete Event</div>
                    </div>
                )}
                <div className="event-header">
                    <h3 className="event-name">{eventName}</h3>
                    <p className="event-location">{location}</p>
                </div>
                <p className="event-date">{`${formattedDate} ${formattedTime}`}</p>
                <p className="event-description">{description}</p>
                <div className="event-tags">
                    {tags.map((tag, index) => (
                        <span key={index} className="tag">{tag}</span>
                    ))}
                </div>
            </div>
        );
    };


    return (
        <div className="user-page">
            <div className="element" onClick={() => setIsProfileSettingsOpen(!isProfileSettingsOpen)}>
                <span>Profile Settings</span>
                {isProfileSettingsOpen ? (
                    <FaChevronUp className="arrow" />
                ) : (
                    <FaChevronDown className="arrow" />
                )}
            </div>
            {isProfileSettingsOpen && (
                <div className={`content ${isProfileSettingsOpen ? 'content-open' : 'content-closed'}`}>
                    <label htmlFor="username">Username</label>
                    <input type="text" id="username" value={username} onChange={handleUsernameChange} />
                    <label htmlFor="old-password">Old Password</label>
                    <input type="password" id="old-password" onChange={handleOldPasswordChange} disabled={localStorage.getItem("isGoogleUser") === "true"} />
                    <label htmlFor="new-password">New Password</label>
                    <input type="password" id="new-password" value={newPassword} onChange={handleNewPasswordChange} disabled={localStorage.getItem("isGoogleUser") === "true"} />
                    {errorMessage && <div className="error-widget">{errorMessage}</div>}
                    <button className="save-settings" onClick={handleSaveSettings}>Save Settings</button>
                </div>
            )}

            <div className="element" onClick={() => setIsMyEventsOpen(!isMyEventsOpen)}>
                <span>My Events</span>
                {isMyEventsOpen ? (
                    <FaChevronUp className="arrow" />
                ) : (
                    <FaChevronDown className="arrow" />
                )}
            </div>
            {isMyEventsOpen && (
                <div className={`content ${isMyEventsOpen ? 'content-open' : 'content-closed'}`}>
                    <div className="my-events-grid">
                        {events.map((event) => (
                            <Event
                                key={event._id}
                                eventId={event._id}
                                eventName={event.title}
                                location={event.location}
                                description={event.description}
                                date={event.time}
                                tags={event.tags}
                            />
                        ))}
                    </div>
                    <button className="create-new-event" onClick={() => navigate('/events/create')}>
                        Create New Event
                    </button>
                </div>
            )}
        </div>
    );
}

export default UserPage;
