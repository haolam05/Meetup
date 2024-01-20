import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import * as groupActions from '../../store/group';
import "./Groups.css";

function Groups() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const groups = useSelector(groupActions.getGroups);

  useEffect(() => {
    dispatch(groupActions.loadGroups());
  }, [dispatch]);

  return (
    <div id="groups-container">
      <ul id="groups">
        <h1 id="group-headers" className="heading">
          <a id="header-event">Events</a>
          <a id="header-group">Groups</a>
        </h1>
        <div id="caption">Groups in Meetup</div>
        {groups.map(group => (
          <li key={group.id} className="group" onClick={() => navigate(`/groups/${group.id}`)}>
            <div className="group-image">
              <img
                className="group-thumbnail"
                src={group.previewImage === "Preview Image Not Found" ? "./images/no-preview-available.jpg" : group.previewImage}
                alt="preview-image"
              />
            </div>
            <div className="group-text">
              <h2 className="group-name">{group.name}</h2>
              <div className="group-location">{group.city}, {group.state}</div>
              <div className="group-description">{group.about}</div>
              <div className="group-info">
                <span className="group-num-events">{group.numEvents} events</span>
                <span className="group-dot">.</span>
                <span className="group-status">{group.private ? "Private" : "Public"}</span>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Groups;
