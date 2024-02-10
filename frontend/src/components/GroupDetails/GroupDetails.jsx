import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { useModal } from '../../context/Modal';
import Loading from '../Loading';
import Group from '../Group';
import Event from '../Event';
import BackButton from '../BackButton';
import Maps from '../Maps';
import CreateVenue from '../CreateVenue';
import * as sessionActions from '../../store/session';
import * as groupActions from '../../store/group';
import * as mapsActions from '../../store/maps';
import './GroupDetails.css';

function GroupDetails() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { setModalContent } = useModal();
  const { groupId } = useParams();
  const [isLoaded, setIsLoaded] = useState(false);
  const group = useSelector(groupActions.getGroupById(groupId));
  const userGroups = useSelector(groupActions.getCurrentUserGroups);
  const user = useSelector(sessionActions.sessionUser);
  const key = useSelector(mapsActions.getMapKey);

  useEffect(() => {
    const loadKey = async () => {
      await dispatch(mapsActions.getKey());
    }
    loadKey();
  }, [dispatch, key]);

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

  const showVenues = () => {  // Online groups also have Venues, in case switching to in-person group
    if (!user) {
      return setModalContent(<h2 className="subheading modal-errors">Authentication required</h2>);
    }

    if (group.private && group.organizerId !== user.id && !group.members.find(m => m.id === user.id)) {
      return setModalContent(<h2 className="subheading modal-errors">You are not a member of this private group!</h2>);
    }

    return setModalContent(
      <div className="venues-container">
        <div className="venue-header">
          <h2 className="subheading">Venues</h2>
          {group.organizerId === user.id || group.members.find(m => m.id === user.id && m.Membership.status === "co-host") && (
            <i className="fa-solid fa-square-plus" onClick={() => setModalContent(<CreateVenue apiKey={key} groupId={group.id} />)}></i>
          )}
        </div>
        <Maps apiKey={key} locations={group.Venues} groupId={groupId} />
      </div>
    );
  }
  function Venues() {
    return <div className="venues">
      <h2 className="subheading">Venues</h2>
      <i className="fa-solid fa-square-arrow-up-right" onClick={showVenues}></i>
    </div>;
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
          <Venues />
          <div id="group-details-about">
            <h2 className="subheading">What we&apos;re about</h2>
            <p>{group.about}</p>
          </div>
          <div id="events">
            <h2 id="group-num-events" className="subheading"><span className="subheading">Events</span> ({group.numEvents})</h2>
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
