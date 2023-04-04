import React, { useState, useEffect } from 'react';
import { FaSearch } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import './ViewEvents.css';

function ViewEvents() {
    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');
    const [eventsData, setEventsData] = useState([]);
    const eventsPerPage = 8;
    const navigate = useNavigate();

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await fetch('/api/events');
                const data = await response.json();
                setEventsData(data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchEvents();
    }, []);

    const Event = ({ _id, eventName, description, tags, date }) => {
        const handleClick = () => {
            navigate(`/events/${_id}`);
        };

        return (
            <div className="event" onClick={handleClick}>
                <div className="event-header">
                    <h3 className="event-name">{eventName}</h3>
                    <span className="event-date">{date}</span>
                </div>
                <p className="event-description">{description}</p>
                <div className="event-tags">
                    {tags.map((tag, index) => (
                        <span key={index} className="tag">{tag}</span>
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
    }, [searchQuery, eventsData]);

    const changePage = (direction) => {
        setCurrentPage((prevPage) => prevPage + direction);
    };

    const startIndex = (currentPage - 1) * eventsPerPage;
    const endIndex = startIndex + eventsPerPage;
    const eventsToDisplay = filteredEvents.slice(startIndex, endIndex);

    return (
        <div className="view-events">
            <div className="search-bar">
                <input type="text" placeholder="Search events" onChange={e => setSearchQuery(e.target.value)} />
                <FaSearch className="search-icon" />
            </div>
            <div className="events-grid">
                {Array(Math.ceil(eventsToDisplay.length / 4)).fill(0).map((_, rowIndex) => (
                    <div key={rowIndex} className="events-row">
                        {eventsToDisplay.slice(rowIndex * 4, rowIndex * 4 + 4).map((event, colIndex) => (
                            <Event
                                key={`${rowIndex}-${colIndex}`}
                                event={event}
                            />
                        ))}
                    </div>
                ))}
            </div>
            <div className="pagination">
                <button className="left-arrow" onClick={() => changePage(-1)} disabled={currentPage === 1}>&lt;</button>
                <span className="current-page">{currentPage}</span>
                <button className="right-arrow" onClick={() => changePage(1)} disabled={currentPage === Math.ceil(filteredEvents.length / eventsPerPage)}>&gt;</button>
            </div>
        </div>
    );
}

export default ViewEvents;
