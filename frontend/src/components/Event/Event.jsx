import "./Event.css";

function Event({ event, user = false, details = false }) {
  const formattedDate = date => {
    date = new Date(date);
    return `${date.getFullYear()}-${`${date.getMonth() + 1}`.padStart(2, '0')}-${`${date.getDate()}`.padStart(2, '0')}`;
  };

  const formattedTime = date => {
    date = new Date(date);
    return `${`${date.getHours()}`.padStart(2, '0')}:${`${date.getMinutes()}`.padStart(2, '0')}`;
  };

  if (!details) return (
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

  return (
    <div id="event" className="event">
      <div id="event-image">
        <img src={`${event.previewImage === "Preview Image Not Found" ? "/images/no-preview-available.jpg" : event.previewImage}`} alt="preview-image" />
      </div>
      <div id="event-text">
        <div className="group details">
          <div className="group-image">
            <img
              className="group-thumbnail"
              src={event.Group.previewImage === "Preview Image Not Found" ? "/images/no-preview-available.jpg" : event.Group.previewImage}
              alt="preview-image"
            />
          </div>
          <div id="group-text-wrapper">
            <h2 className="subheading">{event.Group.name}</h2>
            <div>{event.Group.private ? "Private" : "Public"}</div>
          </div>
        </div>
        <div id="event-line-break"></div>
        <div id="event-details">
          <div id="time-wrapper">
            <div id="time-icon">
              <i className="fa-regular fa-clock"></i>
            </div>
            <div id="time-text">
              <span>START</span>
              <span>END</span>
            </div>
            <div id="event-times">
              <div id="event-time">
                <span id="event-start-date">{formattedDate(event.startDate)}</span>
                <span id="event-dot">.</span>
                <span id="event-start-time">{formattedTime(event.startDate)}</span>
              </div>
              <div id="event-time">
                <span id="event-start-date">{formattedDate(event.endDate)}</span>
                <span id="event-dot">.</span>
                <span id="event-start-time">{formattedTime(event.endDate)}</span>
              </div>
            </div>
          </div>
          <div id="event-price">
            <div><i className="fa-brands fa-bitcoin"></i></div>
            <div>{event.price <= 0 ? 'FREE' : `$${event.price}`}</div>
          </div>
          <div id="event-type">
            <div><i className="fa-solid fa-location-dot"></i></div>
            <div>{event.type}</div>
          </div>
          <div id="event-description">
            <div>Description</div>
            <p>{event.description.length > 100 ? `${event.description.slice(0, 100)}...` : event.description}</p>
          </div>
        </div>
        {user && user.id === event.Group.Organizer.id && (
          <>
            <div id="event-line-break"></div>
            <div id="event-btns">
              <button className="btn-accent">Update</button>
              <button className="btn-accent">Delete</button>
            </div>
          </>
        )}

      </div>
    </div >
  );
}

export default Event;
