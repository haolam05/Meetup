import { useNavigate } from "react-router-dom";
import { useModal } from "../../context/Modal";

function AttendanceStatusModal({ eventId }) {
  const navigate = useNavigate();
  const { closeModal } = useModal();

  const viewMembers = () => {
    closeModal();
    navigate(`/events/${eventId}/attendees`, { replace: true });
  }

  return (
    <>
      <h2 className="subheading">Attendance status</h2>
      <div className="label-breakdown">
        <div className="label-icons">
          <span className="owner"><i className="fa-solid fa-user-check"></i></span>
          <span className="co-host"> <i className="fa-solid fa-user-check"></i></span>
          <span className="member"> <i className="fa-solid fa-user-check"></i></span>
          <span className="stranger"> <i className="fa-solid fa-user-check"></i></span>
        </div>
        <div className="label-text">
          <div>Host</div>
          <div>Co-host</div>
          <div>Attendee</div>
          <div>Stranger</div>
        </div>
      </div>
      <button className="btn-primary view-members-btn" onClick={viewMembers}>View Attendees</button>
    </>
  );
}

export default AttendanceStatusModal;
