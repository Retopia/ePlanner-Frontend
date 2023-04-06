import React, { useState, useEffect } from 'react';
import { FaSearch } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import './stylesheets/ViewEvents.css';

function ViewEvents() {
    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');
    const [eventsData, setEventsData] = useState([]);
    const eventsPerPage = 8;
    const navigate = useNavigate();

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await fetch(process.env.REACT_APP_SERVER + '/events/view');
                const data = await response.json();
                setEventsData(data);
                console.log(data);
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
            <div className="viewEventsExampleEvent" onClick={handleClick}>
                <h3 className="viewEventsEventName">{title}</h3>
                <p className="viewEventsEventDate">{`${formattedDate} ${formattedTime}`}</p>
                <p className="viewEventsEventLocation">{location}</p>
                <p className="viewEventsEventDescription">{description}</p>
                <div className="viewEventsEventTags">
                    {tags?.map((tag, index) => (
                        <span key={index} className="viewEventsTag">{tag}</span>
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
    const eventsToDisplay = filteredEvents.length ? filteredEvents.slice(startIndex, endIndex) : eventsData.slice(startIndex, endIndex);

    return (
        <div className="viewEvents">
            <div className="viewEventsContainer">
                <div className="viewEventsSearchBar">
                    <input type="text" placeholder="Search events" onChange={e => setSearchQuery(e.target.value)} />
                    <FaSearch className="viewEventsSearchIcon" />
                </div>
                <div className="viewEventsGrid">
                    {Array(Math.ceil(eventsToDisplay.length / 4)).fill(0).map((_, rowIndex) => (
                        <div key={rowIndex} className="viewEventsRow">
                            {eventsToDisplay.slice(rowIndex * 4, rowIndex * 4 + 4).map((event, colIndex) => (
                                <Event
                                    key={`${rowIndex}-${colIndex}`}
                                    event={event}
                                />
                            ))}
                        </div>
                    ))}
                </div>
                <div className="viewEventsPagination">
                    <button className="viewEventsLeftArrow" onClick={() => changePage(-1)} disabled={currentPage === 1}>&lt;</button>
                    <span className="current-page">{currentPage}</span>
                    <button className="viewEventsRightArrow" onClick={() => changePage(1)} disabled={currentPage === Math.ceil(filteredEvents.length / eventsPerPage)}>&gt;</button>
                </div>
            </div>
        </div>
    );
}

export default ViewEvents;
