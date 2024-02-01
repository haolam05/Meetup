import { useModal } from "../../context/Modal";
import AttendanceStatusModal from "../AttendanceStatusModal";
// import "./MembershipStatus.css";

function AttendanceStatus({ user, event }) {
  const { setModalContent } = useModal();

  if (user) {
    if (event.Group.organizerId === user.id) {
      return <span
        className="owner"
        onClick={() => setModalContent(<AttendanceStatusModal />)}
      >
        <i className="fa-solid fa-square-check"></i>
      </span>
    }

    const member = event.Group.members.find(member => member.id === user.id);
    if (member && member.Membership.status === 'co-host') {
      return <span
        className="co-host"
        onClick={() => setModalContent(<AttendanceStatusModal />)}
      >
        <i className="fa-solid fa-square-check"></i>
      </span>
    }

    const attendee = event.attendees.find(attendee => attendee.id === user.id);
    if (attendee && attendee.Attendance.status === 'attending') {
      return <span
        className="member"
        onClick={() => setModalContent(<AttendanceStatusModal />)}
      >
        <i className="fa-solid fa-square-check"></i>
      </span>
    }
  }
}

export default AttendanceStatus;
