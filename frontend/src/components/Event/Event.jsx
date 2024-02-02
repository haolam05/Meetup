import { useNavigate } from 'react-router-dom';
import { formattedDate, formattedTime } from "../../utils/dateFormatter";
import { getPreviewImageUrl } from "../../utils/images";
import { formatPrice } from "../../utils/priceFormatter";
import { useModal } from '../../context/Modal';
import OpenModalButton from '../OpenModalButton';
import DeleteEvent from '../DeleteEvent';
import ImageSlider from '../ImageSlider';
import ImageFormModal from '../ImageFormModal';
import "./Event.css";

function Event({ event, user = false, details = false, userEvents = [], showSlider = false, allowedPost = false, allowedDelete = false }) {
  const navigate = useNavigate();
  const { setModalContent } = useModal();

  function EventGalleryBtn() {
    if (allowedDelete && allowedPost) return <button className="btn-accent" onClick={() => navigate(`/events/${event.id}/images`, { replace: true })}>Gallery</button>;
    else if (allowedPost) return <button id="group-join-btn" className="btn-accent" onClick={() => setModalContent(<ImageFormModal eventId={event.id} />)}>Post Image</button>;
  }

  if (!details) return (
    <div id="event">
      <div id="event-image">
        <img src={getPreviewImageUrl(event)} alt="preview-image" />
      </div>
      <div id="event-text">
        <div id="event-time">
          <span id="event-start-date">{formattedDate(event.startDate)}</span>
          <span id="event-dot">.</span>
          <span id="event-start-time">{formattedTime(event.startDate)}</span>
        </div>
        <h2 id="event-title" className="subheading">{event.name}</h2>
        <div id="event-location">{event.Venue ? `${event.Venue?.city}, ${event.Venue?.state}` : 'Online'}</div>
        <div id="event-description">{event.description.slice(0, 50) + '...'}</div>
      </div>
    </div>
  );

  return (
    <div id="event" className="event">
      <div id="event-image">
        {showSlider ? (
          <span className="slider-image">
            <ImageSlider images={event.EventImages} />
          </span>
        ) : (
          <img src={getPreviewImageUrl(event)} alt="preview-image" />
        )}
      </div>
      <div id="event-text">
        <div className="group details" onClick={() => navigate(`/groups/${event.Group.id}`)}>
          <div className="group-image">
            <img
              className="group-thumbnail"
              src={getPreviewImageUrl(event.Group)}
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
          <div id="event-info-wrapper">
            <div id="event-price-type-capacity-icons">
              <div><i className="fa-brands fa-bitcoin"></i></div>
              <div><i className="fa-solid fa-location-dot"></i></div>
              <div><i className="fa-solid fa-user-group"></i></div>
            </div>
            <div className="event-price event-type event-capacity">
              <div id="event-price">
                <div>{formatPrice(event.price)}</div>
              </div>
              <div id="event-type">
                <div>{event.type}</div>
              </div>
              <div id="event-capacity">
                <div>{event.capacity}</div>
              </div>
            </div>
          </div>
          <div id="event-description">
            <div>Description</div>
            <p>{`${event.description.slice(0, 50)}...`}</p>
          </div>
        </div>
        {user && (
          user.id === event.Group.Organizer.id ? (
            <>
              <div id="event-line-break"></div>
              <div id="event-btns">
                <button className="btn-accent" onClick={() => navigate(`/events/${event.id}/edit`)}>Update</button>
                <OpenModalButton modalComponent={<DeleteEvent groupId={event.Group.id} eventId={event.id} />} buttonText="Delete" />
                <EventGalleryBtn />
              </div>
            </>
          ) : (
            userEvents.find(userEvent => userEvent.id === event.id) ? (
              <div id="event-btns">
                <button id="group-join-btn" className="btn-accent" onClick={() => alert(`Feature coming soon`)}>Unattend this event</button>
                <EventGalleryBtn />
              </div>
            ) : (
              <div id="event-btns">
                <button id="group-join-btn" className="btn-primary" onClick={() => alert(`Feature coming soon`)}>Attend this event</button>
                <EventGalleryBtn />
              </div>
            )
          )
        )}
      </div>
    </div >
  );
}

export default Event;
