import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Loading from '../Loading';
import * as groupActions from '../../store/group';
import "./Groups.css";

function Groups() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isLoaded, setIsLoaded] = useState(false);
  const groups = useSelector(groupActions.getGroups);

  useEffect(() => {
    const loadGroups = async () => {
      await dispatch(groupActions.loadGroups());
      setIsLoaded(true);
    }
    loadGroups();
  }, [dispatch]);

  if (!isLoaded) return <Loading />;

  return (
    <div id="groups-container">
      <ul id="groups">
        <li id="group-headers">
          <h1 className="heading">
            <a id="header-event">Events</a>
            <a id="header-group">Groups</a>
          </h1>
        </li>
        <li id="caption">Groups in Meetup</li>
        {groups.map(group => (
          <li key={group.id} className="group" onClick={() => navigate(`/groups/${group.id}`)}>
            <div className="group-image">
              <img
                className="group-thumbnail"
                src={group.previewImage === "Preview Image Not Found" ? "/images/no-preview-available.jpg" : group.previewImage}
                alt="preview-image"
              />
            </div>
            <div className="group-text">
              <h2 className="group-name">{group.name}</h2>
              <div className="group-location">{group.city}, {group.state}</div>
              <div className="group-description">{group.about}</div>
              <div className="group-info">
                <span className="group-num-events">{group.numEvents} event{group.numEvents > 1 ? 's' : ''}</span>
                <span className="group-dot">.</span>
                <span className="group-status">{group.private ? "Private" : "Public"}</span>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div >
  );
}

export default Groups;
