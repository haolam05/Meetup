import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import * as groupActions from '../../store/group';
import "./GroupForm.css";

function GroupForm({ group = {}, title }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [location, setLocation] = useState(group.city && group.state ? `${group.city}, ${group.state}` : "");
  const [name, setName] = useState(group.name || "");
  const [about, setAbout] = useState(group.about || "");
  const [privateStatus, setPrivateStatus] = useState(group.private !== undefined ? group.private : false);
  const [type, setType] = useState(group.type || "In person");
  const [image, setImage] = useState(group.image || "");
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
      name,
      about,
      type,
      private: privateStatus,
      city,
      state,
      image,
      imageId: group.previewImageId
    }

    let groupData;
    if (title === 'Update Group') {
      groupData = await dispatch(groupActions.updateGroup(payload, group.id));
    } else {
      groupData = await dispatch(groupActions.createGroup(payload));
    }

    if (groupData?.errors) {
      setErrors({ ...groupData.errors });
    } else {
      navigate(`/groups/${groupData?.id}`, { replace: true });
    }
  };

  return (
    <form id="new-group" onSubmit={handleSubmit}>
      <div id="event-line-break"></div>
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
      <div id="event-line-break"></div>
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
      <div id="event-line-break"></div>
      <div className="create-group section-3">
        <h2 className="subheading">Describe the purpose of your group</h2>
        <div className="caption">
          <p>
            People will see this when we promote your group, but you&apos;ll be able to add to it later, too.
          </p>
          <div className="questions">
            1. What&apos;s the purpose of the group?
            <br />
            2. Who should join?
            <br />
            3. What will you do at your events?
          </div>
        </div>
        <textarea
          placeholder="Please write at least 50 characters"
          value={about}
          onChange={e => setAbout(e.target.value)}
        />
        {errors.about && <p className="error-message">{errors.about}</p>}
      </div>
      <div id="event-line-break"></div>
      <h2 className="subheading">Final steps...</h2>
      <div className="create-group section-4">
        <div>
          <label htmlFor="group-type">Is this an in-person or online group?</label>
          <select
            value={type}
            onChange={e => setType(e.target.value)}
          >
            <option value="In person">In person</option>
            <option value="Online">Online</option>
          </select>
          {errors.type && <p className="error-message">{errors.type}</p>}
        </div>
        <div>
          <label htmlFor="group-private-status">Is this group private or public?</label>
          <select
            value={privateStatus}
            onChange={e => setPrivateStatus(e.target.value)}
          >
            <option value={true}>Private</option>
            <option value={false}>Public</option>
          </select>
          {errors.privateStatus && <p className="error-message">{errors.privateStatus}</p>}
        </div>
        <div>
          <label htmlFor="group-image">Please add an image URL for your group below</label>
          <input
            type="text"
            placeholder="Image Url"
            value={image}
            onChange={e => setImage(e.target.value)}
          />
          {errors.image && <p className="error-message">{errors.image}</p>}
        </div>
      </div>
      <button type="submit" className="btn-primary">{title}</button>
    </form>
  );
}

export default GroupForm;
