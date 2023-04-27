import React, { useState, useEffect } from 'react';
import { FaSearch } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import CircularProgress from '@mui/material/CircularProgress';
import DOMPurify from 'dompurify';
import styles from './stylesheets/ViewEvents.module.css';

function ViewEvents() {
    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');
    const [eventsData, setEventsData] = useState([]);
    const [loading, setLoading] = useState(true);
    const eventsPerPage = window.innerWidth <= 768 ? 2 : 8;
    const navigate = useNavigate();

    // Added DOMPurify to protect from XSS attacks
    function highlightSearchTerm(text, searchTerm) {
        const regex = new RegExp(`(${searchTerm})`, 'gi');
        const sanitizedHTML = DOMPurify.sanitize(text.replace(regex, '<mark>$1</mark>'));
        return { __html: sanitizedHTML };
    }

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await fetch(process.env.REACT_APP_SERVER + '/events/view');
                const data = await response.json();
                setEventsData(data);
                console.log(data);
                setLoading(false);
            } catch (err) {
                console.error(err);
            }
        };
        fetchEvents();
    }, []);

    // For fetching a single event
    // Used for when clicking on event to navigate to its page
    async function fetchEvent(eventId) {
        const token = localStorage.getItem("accessToken");
        const headers = token ? { "Authorization": `Bearer ${token}` } : {};

        const url = process.env.REACT_APP_SERVER + `/events/view/${eventId}?`;
        const res = await fetch(url, { headers });
        const event = await res.json();

        if (res.ok) {
            return event;
        } else {
            throw new Error(event.error);
        }
    }

    const Event = ({ event }) => {
        const { _id, title, location, description, tags, time } = event;

        const formattedDate = new Date(time).toLocaleString('en-US', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
        });

        const formattedTime = new Date(time).toLocaleString('en-US', {
            hour: 'numeric',
            minute: 'numeric',
            hour12: true,
        });

        const handleClick = async () => {
            try {
                await fetchEvent(_id);
                navigate(`/events/view/${_id}`);
            } catch (err) {
                console.error(err.message);
            }
        };

        return (
            <div className={styles['event']} onClick={handleClick}>
                <h3 className={styles['event-name']} dangerouslySetInnerHTML={highlightSearchTerm(title, searchQuery)}></h3>
                <p className={styles['event-date']}>{`${formattedDate} ${formattedTime}`}</p>
                <p className={styles['event-location']}>{location}</p>
                <p className={styles['event-description']} dangerouslySetInnerHTML={highlightSearchTerm(description, searchQuery)}></p>
                <div className={styles['event-tag-container']}>
                    {tags?.map((tag, index) => (
                        <span key={index} className={styles['event-tag']}>{tag}</span>
                    ))}
                </div>
            </div>
        );
    };


    const [filteredEvents, setFilteredEvents] = useState([]);

    useEffect(() => {
        const searchResults = eventsData.filter(event =>
            event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
            event.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
        );

        setFilteredEvents(searchResults);
        setCurrentPage(1); // Reset currentPage to 1 when searchQuery is updated
    }, [searchQuery, eventsData]);


    const changePage = (direction) => {
        setCurrentPage((prevPage) => prevPage + direction);
    };

    const startIndex = (currentPage - 1) * eventsPerPage;
    const endIndex = startIndex + eventsPerPage;
    const eventsToDisplay = filteredEvents.length ? filteredEvents.slice(startIndex, endIndex) : eventsData.slice(startIndex, endIndex);

    return (
        <div className={styles['view-events']}>
            {loading ? (
                <div className={styles['loading-container']}>
                    <CircularProgress />
                </div>
            ) : (
                <div className={styles['event-container']}>
                    <div className={styles['search-bar']}>
                        <input type="text" placeholder="Search events" onChange={e => setSearchQuery(e.target.value)} />
                        <FaSearch className={styles['search-icon']} />
                    </div>
                    <div className={styles['event-grid']}>
                        {Array(Math.ceil(eventsToDisplay.length / 4)).fill(0).map((_, rowIndex) => (
                            <div key={rowIndex} className={styles['event-row']}>
                                {eventsToDisplay.slice(rowIndex * 4, rowIndex * 4 + 4).map((event, colIndex) => (
                                    <Event
                                        key={`${rowIndex}-${colIndex}`}
                                        event={event}
                                    />
                                ))}
                            </div>
                        ))}
                    </div>
                    <div className={styles['event-pagination']}>
                        <button className={styles['event-pagination-left']} onClick={() => changePage(-1)} disabled={currentPage === 1}>&lt;</button>
                        <span>{currentPage}</span>
                        <button className={styles['event-pagination-right']} onClick={() => changePage(1)} disabled={currentPage === Math.ceil(filteredEvents.length / eventsPerPage)}>&gt;</button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ViewEvents;
