import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import Loading from '../Loading';
import * as sessionActions from '../../store/session';
import * as groupActions from '../../store/group';
import './GroupDetails.css';

function GroupDetails() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { groupId } = useParams();
  const [isLoaded, setIsLoaded] = useState(false);
  const group = useSelector(groupActions.getGroupById(groupId));
  const user = useSelector(sessionActions.sessionUser);

  useEffect(() => {
    const loadGroupDetails = async () => {
      await dispatch(groupActions.loadGroupDetails(groupId));
      await dispatch(sessionActions.restoreSession());
      setIsLoaded(true);
    }
    loadGroupDetails();
  }, [dispatch, groupId]);

  const addBackBtnText = () => {
    const span = document.createElement('span');
    span.innerText = 'Groups';
    document.querySelector('#back-to-group').appendChild(span);
  }

  const removeBackBtnText = () => {
    document.querySelector('#back-to-group>span').remove();
  }

  if (!isLoaded) return <Loading />;

  return (
    <div id="groups-container">
      <div id="groups">
        <button
          id="back-to-group"
          onMouseOver={addBackBtnText}
          onMouseOut={removeBackBtnText}
          onClick={() => navigate("/groups", { replace: true })}
        >
          <i className="fa-sharp fa-solid fa-arrow-left"></i>
        </button>
        <div key={group.id} className="group">
          <div className="group-image">
            <img
              className="group-thumbnail"
              src={group.previewImage === "Preview Image Not Found" ? "/images/no-preview-available.jpg" : group.previewImage}
              alt="preview-image"
            />
          </div>
          <div id="group-text-wrapper">
            <div className="group-text">
              <h2 className="group-name">{group.name}</h2>
              <div className="group-location">{group.city}, {group.state}</div>
              <div className="group-info">
                <span className="group-num-events">{group.numEvents} event{group.numEvents > 1 ? 's' : ''}</span>
                <span className="group-dot">.</span>
                <span className="group-status">{group.private ? "Private" : "Public"}</span>
              </div>
              <div id="group-organizer">
                Organized by: {group.Organizer.firstName}, {group.Organizer.lastName}
              </div>
            </div>
            {user && (
              user.id !== group.organizerId ? (
                <button
                  className="group-join-btn btn-primary"
                  onClick={() => alert("Feature coming soon")}
                >
                  Join this group
                </button>
              ) : (
                <div id="event-btns">
                  <button className="btn-accent">Create event</button>
                  <button className="btn-accent">Update</button>
                  <button className="btn-accent">Delete</button>
                </div>
              )
            )
            }

          </div>
        </div>
      </div>
    </div>
  );
}

export default GroupDetails;
