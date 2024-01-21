import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import Loading from '../Loading';
import Group from '../Group';
import Event from '../Event';
import BackButton from '../BackButton';
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

  if (!isLoaded) return <Loading />;

  return (
    <div id="lists-container">
      <div id="lists">
        <BackButton url={"/groups"} />
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
            <h2 id="group-num-events" className="subheading">Events ({group.numEvents})</h2>
            {group.upcomingEvents.length > 0 && (
              <h2 className="subheading">Upcoming Events ({group.upcomingEvents.length})</h2>
            )}
            {group.upcomingEvents.map(event => (
              <div key={event.id} onClick={() => navigate(`/events/${event.id}`)}>
                <Event event={event} />
              </div>
            ))}
            {group.pastEvents.length > 0 && (
              <h2 className="subheading">Past Events ({group.pastEvents.length})</h2>
            )}
            {group.pastEvents.map(event => (
              <div key={event.id} onClick={() => navigate(`/events/${event.id}`)}>
                <Event event={event} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default GroupDetails;
