import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import * as groupActions from '../../store/group';
import "./GroupForm.css";

function GroupForm({ group = {} }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [location, setLocation] = useState("");
  const [name, setName] = useState("");
  const [about, setAbout] = useState("");
  const [privateStatus, setPrivateStatus] = useState("");
  const [type, setType] = useState("In person");
  const [image, setImage] = useState("");
  const [errors, setErrors] = useState({});

  const handleSubmit = async e => {
    e.preventDefault();

    const locationArr = location.split(', ');

    if (locationArr.length !== 2) {
      return setErrors({ location: `Please enter the location in this format: "City, STATE"` });
    }

    let [city, state] = locationArr;

    if (city.length === 0) return setErrors({ location: `City can't be empty` });
    if (state.length === 0) return setErrors({ location: `State can't be empty` });

    city = city[0].toUpperCase() + city.slice(1).toLowerCase();
    state = state[0].toUpperCase() + state.slice(1).toLowerCase();

    const payload = {
      ...group,
      name,
      about,
      type,
      private: privateStatus === "true",
      city,
      state,
      image
    }

    const groupData = await dispatch(groupActions.createGroup(payload));

    if (groupData?.errors) {
      setErrors({ ...groupData.errors });
    } else {
      navigate(`/groups/${groupData?.id}`);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="create-group section-1">
        <h2 className="subheading">Set your group&apos;s location</h2>
        <div className="caption">
          Meetup groups meet locally, in person, and online. We&apos;ll connect you with people in your area.
        </div>
        <input
          type="text"
          placeholder="City, STATE"
          value={location}
          onChange={e => setLocation(e.target.value)}
        />
        {errors.location && <p className="error-message">{errors.location}</p>}
      </div>
      <div className="create-group section-2">
        <h2 className="subheading">What will your group&apos;s name be?</h2>
        <div className="caption">
          Choose a name that will give people a clear idea of what the group is about. Feel free to get creative! You can edit this later if you change your mind.
        </div>
        <input
          type="text"
          placeholder="What is your group name?"
          value={name}
          onChange={e => setName(e.target.value)}
        />
        {errors.name && <p className="error-message">{errors.name}</p>}
      </div>
      <div className="create-group section-3">
        <h2 className="subheading">Describe the purpose of your group.</h2>
        <div className="caption">
          People will see this when we promote your group, but you&apos;ll be able to add to it later, too. 1. What&apos;s the purpose of the group? 2. Who should join? 3. What will you do at your events?
        </div>
        <textarea
          placeholder="Please write at least 50 characters"
          value={about}
          onChange={e => setAbout(e.target.value)}
        />
        {errors.about && <p className="error-message">{errors.about}</p>}
      </div>
      <div className="create-group section-4">
        <label htmlFor="group-type">Is this an in-person or online group?</label>
        <select
          value={type}
          onChange={e => setType(e.target.value)}
        >
          <option value="In person">In person</option>
          <option value="Online">Online</option>
        </select>
        {errors.type && <p className="error-message">{errors.type}</p>}
        <label htmlFor="group-private-status">Is this group private or public?</label>
        <select
          value={privateStatus}
          onChange={e => setPrivateStatus(e.target.value)}
        >
          <option value="true">Private</option>
          <option value="false">Public</option>
        </select>
        {errors.privateStatus && <p className="error-message">{errors.privateStatus}</p>}
        <label htmlFor="group-image">Please add an image URL for your group below</label>
        <input
          type="text"
          placeholder="Image Url"
          value={image}
          onChange={e => setImage(e.target.value)}
        />
        {errors.image && <p className="error-message">{errors.image}</p>}
      </div>
      <button type="submit">Create Group</button>
    </form>
  );
}

export default GroupForm;
