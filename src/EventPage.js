import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './stylesheets/EventPage.css';

const EventPage = () => {
    const [event, setEvent] = useState(null);
    const { eventId } = useParams();

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                const response = await fetch(process.env.REACT_APP_SERVER + `/events/view/${eventId}`, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
                    },
                });

                if (response.ok) {
                    const eventData = await response.json();
                    setEvent(eventData);
                } else {
                    console.error('Failed to fetch event');
                }
            } catch (err) {
                console.error('Error fetching event:', err);
            }
        };

        fetchEvent();
    }, [eventId]);

    return event ? (
        <div className="eventPage">
            {(() => {
                const formattedDate = new Date(event.time).toLocaleString('en-US', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                });

                const formattedTime = new Date(event.time).toLocaleString('en-US', {
                    hour: 'numeric',
                    minute: 'numeric',
                    hour12: true,
                });

                return (
                    <div className="eventPageInnerContainer">
                        <h2 className="eventPageTitle">{event.title}</h2>
                        <p className="eventPageCreator">Created by: {event.creator.username}</p>
                        <p className="eventPageLocation">Location: {event.location}</p>
                        <p className="eventPageDate">Date: {formattedDate} {formattedTime}</p>
                        <p className="eventPageDescription">{event.description}</p>
                        <div className="eventPageTags">
                            {event.tags.map((tag, index) => (
                                <span key={index} className="eventPageTag">{tag}</span>
                            ))}
                        </div>
                        <div className="eventPageInvitedUsers">
                            <h4>Invited Users:</h4>
                            <ul>
                                {event.invitedUsers.map((user, index) => (
                                    <li key={index}>{user.username}</li>
                                ))}
                            </ul>
                        </div>
                        <div className="eventPageEmbeddedFiles">
                            <h4>Embedded Files:</h4>
                            <ul>
                                {event.embeddedFiles.map((file, index) => (
                                    <li key={index}>
                                        <a href={file.url} target="_blank" rel="noreferrer">{file.description || file.url}</a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                );
            })()}
        </div>
    ) : (
        <div>Loading...</div>
    );
};

export default EventPage;