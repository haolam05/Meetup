import "./Event.css";

function Event({ event }) {

  const formattedDate = date => {
    date = new Date(date);
    return `${date.getFullYear()}-${`${date.getMonth() + 1}`.padStart(2, '0')}-${`${date.getDate()}`.padStart(2, '0')}`;
  };

  const formattedTime = date => {
    date = new Date(date);
    return `${`${date.getHours()}`.padStart(2, '0')}:${`${date.getMinutes()}`.padStart(2, '0')}`;
  };

  return (
    <div id="event">
      <div id="event-image">
        <img src={`${event.previewImage === "Preview Image Not Found" ? "/images/no-preview-available.jpg" : event.previewImage}`} alt="preview-image" />
      </div>
      <div id="event-text">
        <div id="event-time">
          <span id="event-start-date">{formattedDate(event.startDate)}</span>
          <span id="event-dot">.</span>
          <span id="event-start-time">{formattedTime(event.startDate)}</span>
        </div>
        <h2 id="event-title" className="subheading">{event.name}</h2>
        <div id="event-location">{event.Venue ? `${event.Venue?.city}, ${event.Venue?.state}` : 'Online'}</div>
        <div id="event-description">{event.description}</div>
      </div>
    </div>
  );
}

export default Event;
