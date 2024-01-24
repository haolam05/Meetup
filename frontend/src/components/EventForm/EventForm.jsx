import { useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useModal } from '../../context/Modal';
import { dateToFormat } from '../../utils/dateFormatter';
import * as eventActions from '../../store/event';

function EventForm({ groupId, title, event = {} }) {
  const [ref1, ref2, ref3, ref4] = [useRef(null), useRef(null), useRef(null), useRef(null)];
  const { setModalContent, setOnModalClose } = useModal();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [name, setName] = useState(event?.name || "");
  const [type, setType] = useState(event?.type || "In person");
  const [price, setPrice] = useState(event?.price || 0);
  const [startDate, setStartDate] = useState(dateToFormat(event?.startDate) || "");
  const [endDate, setEndDate] = useState(dateToFormat(event?.endDate) || "");
  const [description, setDescription] = useState(event?.description || "");
  const [capacity, setCapacity] = useState(event?.capacity || 1);
  const [image, setImage] = useState(event?.previewImage || "");
  const [errors, setErrors] = useState({});

  const validateTime = (dateInput, errorName) => {
    const [date, timeStr] = dateInput.split(', ');
    const [time, identifier] = timeStr ? timeStr.split(' ') : '';

    if (!date || !timeStr || !time) {
      setErrors({
        [errorName]: `Please enter in this format: "MM/DD/YYYY, HH:mm ${errorName === 'endDate' ? 'PM' : 'AM'}"`
      });
      return false;
    }

    if (!date.length) {
      setErrors({ [errorName]: "Date is required" });
      return false;
    }

    if (!time.length) {
      setErrors({ [errorName]: "Time is required" });
      return false;
    }
    if (identifier !== "AM" && identifier !== "PM") {
      setErrors({ [errorName]: "Time identifier must be AM or PM" });
      return false;
    }

    const dateValue = new Date(`${date} ${time} ${identifier}`);

    if (dateValue.toString() === 'Invalid Date') {
      setErrors({ [errorName]: "Invalid Date" });
      return false;
    }

    return dateValue;
  }

  const handleSubmit = async e => {
    e.preventDefault();

    if (name.length < 5) { ref1.current.scrollIntoView(); return setErrors({ name: "Name must be at least 5 characters" }); }
    if (name.length > 40) { ref1.current.scrollIntoView(); return setErrors({ name: "`Name can not have more than 40 characters." }); }
    if (description.length < 30) { ref2.current.scrollIntoView(); return setErrors({ description: "Description needs at least 30 characters" }); }

    const startDateValue = validateTime(startDate, "startDate");
    if (!startDateValue) { ref3.current.scrollIntoView(); return; }

    const endDateValue = validateTime(endDate, "endDate");
    if (!endDateValue) { ref3.current.scrollIntoView(); return; }

    if (capacity < 1) { ref4.current.scrollIntoView(); return setErrors({ capacity: "Capacity must be greater than 0" }); }
    if (price < 0) { ref4.current.scrollIntoView(); return setErrors({ price: "Price must be at lest 0" }) }

    const payload = {
      venueId: type === "Onine" ? null : 1,   // to be implemented later
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
      eventData = await dispatch(eventActions.createEvent(groupId, payload));
    } else {
      eventData = await dispatch(eventActions.updateEvent(event.id, payload));
    }

    if (eventData?.errors) {
      const { message } = eventData.errors;
      if (message) {
        setOnModalClose(() => navigate("/", { replace: true }));
        setModalContent(<div>
          <h2 className="subheading">{message}</h2>
        </div>)
      }
      setErrors({ ...eventData.errors });
    } else {
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
          placeholder="Please include at least 30 characters."
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
            type="text"
            placeholder='MM/DD/YYYY, HH:mm AM'
            value={startDate}
            onChange={e => setStartDate(e.target.value)}
          />
          {errors.startDate && <p className="error-message">{errors.startDate}</p>}
        </div>
        <div>
          <label htmlFor="event-endDate">When does your event end?</label>
          <input
            type="text"
            placeholder='MM/DD/YYYY, HH:mm PM'
            value={endDate}
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
          <label htmlFor="event-iamge">Please add an image url for your event below</label>
          <input
            type="text"
            placeholder="Image URL"
            value={image}
            onChange={e => setImage(e.target.value)}
          />
          {errors.image && <p className="error-message">{errors.image}</p>}
        </div>
      </div>
      <button className="btn-primary">{title}</button>
    </form>
  );
}

export default EventForm;
