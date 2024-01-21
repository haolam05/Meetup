import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import Loading from '../Loading';
import * as groupActions from '../../store/group';
import './GroupDetails.css';

function GroupDetails() {
  const dispatch = useDispatch();
  const { groupId } = useParams();
  const [isLoaded, setIsLoaded] = useState(false);
  const group = useSelector(groupActions.getGroupById(groupId));

  useEffect(() => {
    const loadGroupDetails = async () => {
      await dispatch(groupActions.loadGroupDetails(groupId));
      setIsLoaded(true);
    }
    loadGroupDetails();
  }, [dispatch, groupId]);

  if (!isLoaded) return <Loading />;

  return (
    <div id="groups-container">
      <div id="groups">
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
                Organized by {group.Organizer.firstName}, {group.Organizer.lastName}
              </div>
            </div>
            <button className="group-join-btn btn-primary">Join this group</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GroupDetails;
