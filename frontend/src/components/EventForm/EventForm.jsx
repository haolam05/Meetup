import { useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useModal } from '../../context/Modal';
import { dateToFormat, isValidDateFormat } from '../../utils/dateFormatter';
import { getLocalTime } from '../../utils/dateConverter';
import { hasError, inValidImage } from '../../utils/errorChecker';
import { disabledSubmitButton, enabledSubmitButton } from '../../utils/dom';
import { updateFile } from '../../utils/images';
import * as eventActions from '../../store/event';

function EventForm({ groupId, title, event = {}, organizerId, venues }) {
  const [ref1, ref2, ref3, ref4] = [useRef(null), useRef(null), useRef(null), useRef(null)];
  const { setModalContent, setOnModalClose } = useModal();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [name, setName] = useState(event?.name || "");
  const [type, setType] = useState(event?.type || "Online");
  const [price, setPrice] = useState(event?.price || 0);
  const [startDate, setStartDate] = useState(dateToFormat(event?.startDate) || "");
  const [endDate, setEndDate] = useState(dateToFormat(event?.endDate) || "");
  const [description, setDescription] = useState(event?.description || "");
  const [capacity, setCapacity] = useState(event?.capacity || 1);
  const [image, setImage] = useState(event?.previewImage || "");
  const [venueId, setVenueId] = useState(event?.Venue?.id || "");
  const [errors, setErrors] = useState({});

  const handleSubmit = async e => {
    e.preventDefault();
    disabledSubmitButton();

    if (hasError(setErrors, name.length < 5, "name", "Name must be at least 5 characters", ref1.current)) return;
    if (hasError(setErrors, name.length > 40, "name", "`Name can not have more than 40 characters.", ref1.current)) return;
    if (hasError(setErrors, description.length < 30, "description", "Description needs at least 30 characters", ref2.current)) return;

    const startDateValue = isValidDateFormat(startDate, "startDate", setErrors);
    if (!startDateValue) { ref3.current.scrollIntoView(); return enabledSubmitButton(); }

    const endDateValue = isValidDateFormat(endDate, "endDate", setErrors);
    if (!endDateValue) { ref3.current.scrollIntoView(); return enabledSubmitButton(); }

    if (hasError(setErrors, capacity < 1, "capacity", "Capacity must be greater than 0", ref4.current)) return;
    if (hasError(setErrors, price < 0, "price", "Price must be at lest 0", ref4.current)) return;
    if (inValidImage(setErrors, image)) return;

    if (hasError(setErrors, type === "In person" && venueId === "", "venue", "In person events must have a venue", ref4.current)) return;

    const payload = {
      venueId: type === "Online" ? null : venueId,
      name,
      type,
      capacity,
      price,
      description,
      startDate: startDateValue,
      endDate: endDateValue,
      image,
      imageId: event?.previewImageId
    }

    let eventData;

    if (title === 'Create Event') {
      eventData = await dispatch(eventActions.createEvent(groupId, payload, organizerId));
    } else {
      eventData = await dispatch(eventActions.updateEvent(event.id, payload));
    }

    if (eventData?.errors) {
      const { message } = eventData.errors;
      if (message) {
        setOnModalClose(() => navigate("/", { replace: true }));
        setModalContent(<div><h2 className="subheading modal-errors">{message}</h2></div>)
      }
      setErrors({ ...eventData.errors });
      if (eventData.errors.name) ref1.current.scrollIntoView();
      if (eventData.errors.description) ref2.scrollIntoView();
      if (eventData.errors.startDate || eventData.errors.endDate) ref3.current.scrollIntoView();
      if (eventData.errors.price || eventData, errors.capacity || eventData.errors.type) ref4.current.scrollIntoView();
      enabledSubmitButton();
    } else {
      const verb = Object.values(event).length ? 'Updated' : 'Create';
      setModalContent(<h2 className="subheading alert-success">Successully {verb} Event!</h2>)
      navigate(`/events/${eventData?.id}`, { replace: true });
    }
  }

  return (
    <form id="new-group" onSubmit={handleSubmit}>
      <div id="event-line-break"></div>
      <div className="create-group" ref={ref1} onClick={() => ref1.current.scrollIntoView()}>
        <h2 className="subheading">What is the name of your event?</h2>
        <div className="caption">
          Tell us all about your event. The given information will be used by Meetup to advertise for your event.
        </div>
        <input
          type="text"
          placeholder="Event Name"
          value={name}
          onChange={e => setName(e.target.value)}
        />
        {errors.name && <p className="error-message">{errors.name}</p>}
      </div>
      <div id="event-line-break"></div>
      <div className="create-group" ref={ref2} onClick={() => ref2.current.scrollIntoView()}>
        <h2 className="subheading">Describe your event</h2>
        <div className="caption">
          <p>Be descriptive! People will see this when we promote your event.</p>
          <div className="questions">
            1. What&apos;s activites will take place during your event?
            <br />
            2. What&apos;s should the attendees bring to the event?
            <br />
            3. Who can join your event?
            <br />
            4. Where will the event take place?
          </div>
        </div>
        <textarea
          placeholder="Please include at least 30 characters"
          value={description}
          onChange={e => setDescription(e.target.value)}
        />
        {errors.description && <p className="error-message">{errors.description}</p>}
      </div>
      <div id="event-line-break"></div>
      <div className="create-group section-4" ref={ref3} onClick={() => ref3.current.scrollIntoView()}>
        <h2 className="subheading">Event Date</h2>
        <div>
          <label htmlFor="event-startDate">When does your event start?</label>
          <input
            id="startDate"
            type="datetime-local"
            placeholder='MM/DD/YYYY HH:mm AM'
            value={startDate ? getLocalTime(startDate) : ''}
            onChange={e => setStartDate(e.target.value)}
          />
          {errors.startDate && <p className="error-message">{errors.startDate}</p>}
        </div>
        <div>
          <label htmlFor="event-endDate">When does your event end?</label>
          <input
            id="endDate"
            type="datetime-local"
            placeholder='MM/DD/YYYY HH:mm PM'
            value={endDate ? getLocalTime(endDate) : ''}
            onChange={e => setEndDate(e.target.value)}
          />
          {errors.endDate && <p className="error-message">{errors.endDate}</p>}
        </div>
      </div>
      <div id="event-line-break"></div>
      <div className="create-group section-4" ref={ref4} onClick={() => ref4.current.scrollIntoView()}>
        <h2 className="subheading">Final steps...</h2>
        <div>
          <label htmlFor="event-type">Is this an in-person or online group?</label>
          <select
            name="event-type"
            value={type}
            onChange={e => setType(e.target.value)}
          >
            <option value="In person">In person</option>
            <option value="Online">Online</option>
          </select>
          {errors.type && <p className="error-message">{errors.type}</p>}
        </div>
        <div>
          <label htmlFor="venues">Which venues would you like to use to host this event? Remember that &quot;In-person&quot; events must have a venue. If your group has no venues, please navigate to the group details page to create one.</label>
          <select name="venues" disabled={type === "Online"} value={venueId} onChange={e => setVenueId(+e.target.value)}>
            <option disabled value="">Please choose a venue</option>
            {venues.map(venue => <option key={venue.id} value={venue.id}>{venue.address}</option>)}
          </select>
          {errors.venue && <p className="error-message">{errors.venue}</p>}
        </div>
        <div>
          <label htmlFor="event-capacity">What is the capacity of your event?</label>
          <input
            type="number"
            placeholder="1"
            value={capacity}
            onChange={e => setCapacity(e.target.value)}
          />
          {errors.capacity && <p className="error-message">{errors.capacity}</p>}
        </div>
        <div>
          <label htmlFor="event-price">What is the price for your event?</label>
          <input
            type="decimal"
            min="0"
            placeholder="0"
            value={price}
            onChange={e => setPrice(e.target.value)}
          />
          {errors.price && <p className="error-message">{errors.price}</p>}
        </div>
        <div>
          <label htmlFor="event-image">Please add an image url for your event below</label>
          <input type="file" onChange={e => updateFile(e, setImage)} />
          {errors.image && <p className="error-message">{errors.image}</p>}
        </div>
      </div>
      <button type="submit" className="btn-primary">{title}</button>
    </form>
  );
}

export default EventForm;
