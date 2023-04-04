import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

function EventDetails() {
  const { id } = useParams();
  const [event, setEvent] = useState(null);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await fetch(`/events/${id}`);
        const data = await response.json();
        setEvent(data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchEvent();
  }, [id]);

  if (!event) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <h1>{event.title}</h1>
      <p>{event.time}</p>
      <p>{event.description}</p>
      <p>{event.location}</p>
      <p>{event.tags}</p>
      <p>{event.invitedUsers}</p>
    </div>
  );
}

export default EventDetails;
