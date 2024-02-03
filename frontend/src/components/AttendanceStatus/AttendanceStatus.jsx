import { useModal } from "../../context/Modal";
import AttendanceStatusModal from "../AttendanceStatusModal";

function AttendanceStatus({ user, event }) {
  const { setModalContent } = useModal();

  if (user) {
    if (event.Group.organizerId === user.id) {
      return <span
        className="owner"
        onClick={() => setModalContent(<AttendanceStatusModal eventId={event.id} />)}
      >
        <i className="fa-solid fa-user-check"></i>
      </span>
    }

    const member = event.Group.members.find(member => member.id === user.id);

    if (member && member.Membership.status === 'co-host') {
      return <span
        className="co-host"
        onClick={() => setModalContent(<AttendanceStatusModal eventId={event.id} />)}
      >
        <i className="fa-solid fa-user-check"></i>
      </span>
    }

    const attendee = event.attendees.find(attendee => attendee.id === user.id);
    if (attendee && attendee.Attendance.status === 'attending') {
      return <span
        className="member"
        onClick={() => setModalContent(<AttendanceStatusModal eventId={event.id} />)}
      >
        <i className="fa-solid fa-user-check"></i>
      </span>
    }

    // waitlist or stranger
    return <span
      className="stranger"
      onClick={() => setModalContent(<AttendanceStatusModal eventId={event.id} />)}
    >
      <i className="fa-solid fa-user-check"></i>
    </span>
  }
}

export default AttendanceStatus;
