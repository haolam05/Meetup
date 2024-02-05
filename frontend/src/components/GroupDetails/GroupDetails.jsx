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
  const userGroups = useSelector(groupActions.getCurrentUserGroups);
  const user = useSelector(sessionActions.sessionUser);

  useEffect(() => {
    const loadGroupDetails = async () => {
      if (user) await dispatch(groupActions.loadCurrentUserGroups());
      await dispatch(groupActions.loadGroupDetails(groupId));
      await dispatch(sessionActions.restoreSession());
      setIsLoaded(true);
    }
    loadGroupDetails();
  }, [dispatch, groupId, user]);

  function UpcomingEventsHeader() {
    if (group.upcomingEvents.length > 0) {
      return <h2 className="subheading">Upcoming Events ({group.upcomingEvents.length})</h2>;
    }
  }

  function PastEventsHeader() {
    if (group.pastEvents.length > 0) {
      return <h2 className="subheading">Past Events ({group.pastEvents.length})</h2>;
    }
  }

  function UpcomingEvents() {
    return (
      group.upcomingEvents.map(event => (
        <div key={event.id} onClick={() => navigate(`/events/${event.id}`, { replace: true })}>
          <Event event={event} />
        </div>
      ))
    );
  }

  function PastEvents() {
    return (
      group.pastEvents.map(event => (
        <div key={event.id} onClick={() => navigate(`/events/${event.id}`, { replace: true })}>
          <Event event={event} />
        </div>
      ))
    );
  }

  if (!isLoaded) return <Loading />;
  if (!group) return;

  return (
    <div id="lists-container">
      <div id="lists">
        <BackButton url={"/groups"} />
        <Group
          group={group}
          user={user}
          userGroups={userGroups}
          description={false}
          organizer={true}
          showSlider={  // only show group images if group is public, or user is organizer, or user is a member (not pending)
            !group.private || (user && (                            // group is public
              group.organizerId == user.id ||                       // user is organizer
              group.members.find(member => member.id === user.id)   // user is a member
            ))}
        />
        <div id="group-details">
          <div id="group-details-header">
            <h2 className="subheading">Organizer</h2>
            <span>{group?.Organizer.firstName}, {group?.Organizer.lastName}</span>
          </div>
          <div id="group-details-about">
            <h2 className="subheading">What we&apos;re about</h2>
            <p>{group.about}</p>
          </div>
          <div id="events">
            <h2 id="group-num-events" className="subheading">Events ({group.numEvents})</h2>
            <UpcomingEventsHeader />
            <UpcomingEvents />
            <PastEventsHeader />
            <PastEvents />
          </div>
        </div>
      </div>
    </div>
  );
}

export default GroupDetails;
