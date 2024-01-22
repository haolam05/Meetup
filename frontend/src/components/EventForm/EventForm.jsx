import { useState } from 'react';

function EventForm() {
  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [price, setPrice] = useState(0);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [description, setDescription] = useState("");
  const [capacity, setCapacity] = useState(0);
  const [image, setImage] = useState("");
  const [errors, setErrors] = useState({});

  const handleSubmit = async e => {
    e.preventDefault();
  }
  // Online: no venueId
  // In person --> venueId?
  //

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="event-name">What is the name of your event?</label>
        <input
          type="text"
          placeholder="Event Name"
          value={name}
          onChange={e => setName(e.target.value)}
        />
        {errors.name && <p className="error-message">{errors.name}</p>}
      </div>
      <div>
        <label htmlFor="event-name">Is this an in-person or online group?</label>
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
          min="1"
          placeholder="1"
          value={capacity}
          onChange={e => setCapacity(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="event-price">What is the price for your event?</label>
        <input
          type="number"
          min="0"
          placeholder="0"
          value={price}
          onChange={e => setPrice(e.target.value)}
        />
        {errors.price && <p className="error-message">{errors.price}</p>}
      </div>
      <div>
        <label htmlFor="event-startDate">When does your event start?</label>
        <input
          type="text"
          placeholder='MM/DD/YYYY, HH/mm AM'
          value={startDate}
          onChange={e => setStartDate(e.target.value)}
        />
        {errors.startDate && <p className="error-message">{errors.startDate}</p>}
      </div>
      <div>
        <label htmlFor="event-endDate">When does your event end?</label>
        <input
          type="text"
          placeholder='MM/DD/YYYY, HH/mm PM'
          value={endDate}
          onChange={e => setEndDate(e.target.value)}
        />
        {errors.endDate && <p className="error-message">{errors.endDate}</p>}
      </div>
      <div>
        <label htmlFor="event-iamge">Please add an image url for your event below:</label>
        <input
          type="text"
          placeholder="Image URL"
          value={image}
          onChange={e => setImage(e.target.value)}
        />
        {errors.image && <p className="error-message">{errors.image}</p>}
      </div>
      <div>
        <label htmlFor="event-description">Please describe your event</label>
        <textarea
          placeholder="Please include at least 30 characters."
          value={description}
          onChange={e => setDescription(e.target.value)}
        />
        {errors.description && <p className="error-message">{errors.description}</p>}
      </div>
      <button>Create Event</button>
    </form>
  );
}

export default EventForm;
