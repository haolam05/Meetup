import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import AttendanceStatus from "../AttendanceStatus";
import Loading from "../Loading";
import Attendee from "../Attendee/Attendee";
import * as sessionActions from "../../store/session";
import * as eventActions from "../../store/event";

function EventAttendees() {
  const { eventId } = useParams();
  const dispatch = useDispatch();
  const user = useSelector(sessionActions.sessionUser);
  const event = useSelector(eventActions.getEventById(eventId));
  const attendees = useSelector(eventActions.getEventAttendees(eventId));
  const [isLoaded, setIsLoaded] = useState(false);

  const getStatus = () => {
    if (user) {
      if (event.Group.organizerId === user.id) return "owner"

      const member = event.Group.members.find(member => member.id === user.id);
      if (member && member.Membership.status === 'co-host') return "co-host"

      const attendee = event.attendees.find(attendee => attendee.id === user.id);
      if (attendee && attendee.Attendance.status === 'attending') return "member"

      return "stranger";
    }
    return false;
  }

  function AttendanceHeader() {
    return <h1 className="heading membership">Attendances <AttendanceStatus user={user} event={event} /></h1>;
  }

  function PendingAttendanceHeader() {
    if (pendingAttendees.length) return <h2 className="subheading membership">Pending ({pendingAttendees.length})</h2>;
  }

  function WaitlistAttendanceHeader() {
    if (waitlistAttendees.length) return <h2 className="subheading membership">Waitlist ({waitlistAttendees.length})</h2>;
  }

  function RealAttendanceHeader() {
    if (realAttendees.length) return <h2 className="subheading membership">Attendees ({realAttendees.length})</h2>;
  }

  function PendingAttendees() {
    if (pendingAttendees.length) return pendingAttendees.map(a => <Attendee userId={user.id} attendee={a} status={getStatus()} attendeeType="pending" eventId={event.id} key={a.id} />);
  }

  function WaitlistAttendees() {
    if (waitlistAttendees.length) return waitlistAttendees.map(a => <Attendee userId={user.id} attendee={a} status={getStatus()} attendeeType="waitlist" eventId={event.id} key={a.id} />);
  }

  function RealAttendees() {
    if (realAttendees.length) return realAttendees.map(a => <Attendee userId={user.id} attendee={a} status={getStatus()} attendeeType="real" eventId={event.id} key={a.id} />);
  }

  function NoAttendees() {
    if (!attendees.length) return <h2 className="subheading membership no-members">There isn&apos;t any attendees for this event.</h2>
  }


  useEffect(() => {
    const loadInfo = async () => {
      await dispatch(sessionActions.restoreSession());
      await dispatch(eventActions.loadEventDetails(eventId));
      await dispatch(eventActions.loadEventAttendees(eventId));
      setIsLoaded(true);
    }
    loadInfo();
  }, [dispatch, eventId]);

  if (!isLoaded) return <Loading />;

  const pendingAttendees = attendees.filter(m => m.Attendance.status === 'pending');
  const waitlistAttendees = attendees.filter(m => m.Attendance.status === 'waitlist');
  const realAttendees = attendees.filter(m => m.Attendance.status === 'attending');

  return (
    <div id="lists-container">
      <div id="lists">
        <AttendanceHeader />
        <h2 className="subheading membership-group">{event.name}</h2>
        <PendingAttendanceHeader />
        <div className="membership-container"><PendingAttendees /></div>
        <WaitlistAttendanceHeader />
        <div className="membership-container"><WaitlistAttendees /></div>
        <RealAttendanceHeader />
        <div className="membership-container"><RealAttendees /></div>
        <NoAttendees />
      </div>
    </div>
  );
}

export default EventAttendees;
