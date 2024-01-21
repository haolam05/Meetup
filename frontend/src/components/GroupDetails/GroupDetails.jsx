import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import Loading from '../Loading';
import Group from '../Group';
import Event from '../Event';
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
    <div id="lists-container">
      <div id="lists">
        <button
          id="back-to-group"
          onMouseOver={addBackBtnText}
          onMouseOut={removeBackBtnText}
          onClick={() => navigate("/groups", { replace: true })}
        >
          <i className="fa-sharp fa-solid fa-arrow-left"></i>
        </button>
        <Group
          group={group}
          user={user}
          description={false}
          organizer={true}
        />
        <div id="group-details">
          <div id="group-details-header">
            <h2 className="subheading">Organizer</h2>
            <span>{group.Organizer.firstName}, {group.Organizer.lastName}</span>
          </div>
          <div id="group-details-about">
            <h2 className="subheading">What we&apos;re about</h2>
            <p>{group.about}</p>
          </div>
          <div id="events">
            {group.upcomingEvents.length > 0 && (<h2 className="subheading">Upcoming Events ({group.upcomingEvents.length})</h2>)}
            {group.upcomingEvents.map(event => <Event key={event.id} eventId={event.id} previewImage={event.previewImage} />)}
            {group.pastEvents.length > 0 && (<h2 className="subheading">Past Events ({group.pastEvents.length})</h2>)}
            {group.pastEvents.map(event => <Event key={event.id} eventId={event.id} previewImage={event.previewImage} />)}
          </div>
        </div>
      </div>
    </div>
  );
}

export default GroupDetails;
