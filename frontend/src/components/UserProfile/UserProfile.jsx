import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Loading from "../Loading";
import BackButton from "../BackButton";
import * as sessionActions from "../../store/session";
import * as eventActions from "../../store/event";
import * as groupActions from "../../store/group";
import "./UserProfile.css";
import ManageGroup from "../ManageGroup/ManageGroup";
import ManageEvent from "../ManageEvent/ManageEvent";
import { sortAscFuture, sortDescPast } from "../../utils/dateConverter";

function UserProfile() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);
  const user = useSelector(sessionActions.sessionUser);
  const ownedGroups = useSelector(groupActions.getCurrentUserOwnedGroups(user?.id));
  const joinedGroups = useSelector(groupActions.getCurrentUserJoinedGroups(user?.id));
  const hostedEvents = useSelector(eventActions.getCurrentUserHostedEvents);
  const attendedEvents = useSelector(eventActions.getCurrentUserAttendedEvents);
  const hostedUpcomingEvents = sortAscFuture(hostedEvents);
  const hostedPastEvents = sortDescPast(hostedEvents);
  const attendedUpcomingEvents = sortAscFuture(attendedEvents);
  const attendedPastEvents = sortDescPast(attendedEvents);

  useEffect(() => {
    const loadUser = async () => {
      await dispatch(sessionActions.restoreSession());
      await dispatch(eventActions.loadCurrentUserEvents());
      await dispatch(groupActions.loadCurrentUserGroups());
      setIsLoaded(true);
    }
    loadUser();
  }, [dispatch]);

  if (!isLoaded) return <Loading />
  if (!user) return;

  return (
    <div id="lists-container">
      <div id="lists">
        <BackButton url="/" btnText="Home" />
        <div className="group details">
          <div className="group-image">
            <img
              className="group-thumbnail"
              src={user.profileImageUrl ? user.profileImageUrl : "/images/no-preview-available.jpg"}
              alt="preview-image"
            />
          </div>
          <div id="user-wrapper-container">
            <h1 className="heading">{user.firstName} {user.lastName}</h1>
            <div id="event-line-break"></div>
            <div id="user-info-wrapper">
              <div id="user-info">
                <div id="user-icons">
                  <div><i className="fa-solid fa-user"></i></div>
                  <div><i className="fa-solid fa-envelope"></i></div>
                  <div><i className="fa-solid fa-crown"></i></div>
                  <div><i className="fa-solid fa-user-group"></i></div>
                  <div><i className="fa-solid fa-calendar-days"></i></div>
                  <div><i className="fa-solid fa-ticket"></i></div>
                </div>
                <div id="user-titles">
                  <div>Username</div>
                  <div>Email</div>
                  <div>Owned</div>
                  <div>Joined</div>
                  <div>Hosted</div>
                  <div>Attend</div>
                </div>
                <div id="user-data">
                  <div>{user.username}</div>
                  <div>{user.email}</div>
                  <div>{ownedGroups.length} group{ownedGroups.length > 1 ? 's' : ''}</div>
                  <div>{joinedGroups.length} group{joinedGroups.length > 1 ? 's' : ''}</div>
                  <div>{hostedEvents.length} event{hostedEvents.length > 1 ? 's' : ''}</div>
                  <div>{attendedEvents.length} event{attendedEvents.length > 1 ? 's' : ''}</div>
                </div>
              </div>
            </div>
            <div id="event-line-break"></div>
            <div id="user-btns">
              <button className="btn-accent">Update</button>
              <button className="btn-accent">Delete</button>
            </div>
          </div>
        </div>
        <div id="user-details">
          {ownedGroups.length ? <h2 className="subheading">Groups Owned ({ownedGroups.length})</h2> : ''}
          {ownedGroups.length ? ownedGroups.map(group => <ManageGroup key={group.id} group={group} user={user} />) : ''}

          {joinedGroups.length ? <h2 className="subheading">Groups Joined ({joinedGroups.length})</h2> : ''}
          {joinedGroups.length ? joinedGroups.map(group => <ManageGroup key={group.id} group={group} user={user} />) : ''}

          {hostedEvents.length ? <h2 className="subheading">Events Hosted ({hostedEvents.length})</h2> : ''}
          {hostedUpcomingEvents.length ? <h2 className="subheading gray">Upcoming Events ({hostedUpcomingEvents.length})</h2> : ''}
          {hostedUpcomingEvents.length ? hostedUpcomingEvents.map(event => <ManageEvent key={event.id} event={event} user={user} />) : ''}
          {hostedPastEvents.length ? <h2 className="subheading gray">Past Events ({hostedPastEvents.length})</h2> : ''}
          {hostedPastEvents.length ? hostedPastEvents.map(event => <ManageEvent key={event.id} event={event} user={user} />) : ''}

          {attendedEvents.length ? <h2 className="subheading">Events Attended ({attendedEvents.length})</h2> : ''}
          {attendedUpcomingEvents.length ? <h2 className="subheading gray">Upcoming Events ({attendedUpcomingEvents.length})</h2> : ''}
          {attendedUpcomingEvents.length ? attendedUpcomingEvents.map(event => <ManageEvent key={event.id} event={event} user={user} />) : ''}
          {attendedPastEvents.length ? <h2 className="subheading gray">Past Events ({attendedPastEvents.length})</h2> : ''}
          {attendedPastEvents.length ? attendedPastEvents.map(event => <ManageEvent key={event.id} event={event} user={user} />) : ''}
        </div>
      </div>
    </div >
  );
}

export default UserProfile;
