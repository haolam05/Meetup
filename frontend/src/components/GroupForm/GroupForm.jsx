import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import * as groupActions from '../../store/group';
import "./GroupForm.css";

function GroupForm() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [location, setLocation] = useState("");
  const [name, setName] = useState("");
  const [about, setAbout] = useState();
  const [privateStatus, setPrivateStatus] = useState("");
  const [type, setType] = useState("");
  const [image, setImage] = useState("");
  const [errors, setErrors] = useState({});

  const handleSubmit = async e => {
    e.preventDefault();

    const group = dispatch(groupActions);

    navigate(`/groups/${group.id}`);
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
      </div>
      <div className="create-group section-3">
        <h2 className="subheading">Describe the purpose of your group.</h2>
        <div className="caption">
          People will see this when we promote your group, but you&apos;ll be able to add to it later, too. 1. What&apos;s the purpose of the group? 2. Who should join? 3. What will you do at your events?
        </div>
        <textarea
          placeholder="Please write at least 30 characters"
          value={about}
          onChange={e => setAbout(e.target.value)}
        />
      </div>
      <div className="create-group section-4">
        <label htmlFor="group-type">Is this an in-person or online group?</label>
        <select
          value={type}
          onChange={e => setType(e.target.value)}
        >
          <option value="In person">In Person</option>
          <option value="Online">Online</option>
        </select>
        <label htmlFor="group-private-status">Is this group private or public?</label>
        <select
          value={privateStatus}
          onChange={e => setPrivateStatus(e.target.value)}
        >
          <option value="true">Private</option>
          <option value="false">Public</option>
        </select>
        <label htmlFor="group-image">Please add an image URL for your group below</label>
        <input
          type="text"
          placeholder="Image Url"
          value={image}
          onChange={e => setImage(e.target.value)}
        />
      </div>
      <button type="submit">Create Group</button>
    </form>
  );
}

export default GroupForm;
