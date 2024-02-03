import { useModal } from "../../context/Modal";
import { capitalize } from "../../utils/capitalize";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import ConfirmDeleteForm from "../ConfirmDeleteForm";
import AttendanceStatusForm from "../AttendeeStatusForm";
import OpenModalButton from "../OpenModalButton";
import * as eventActions from "../../store/event";

function Attendee({ userId, attendee, status, attendeeType, eventId }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { setModalContent, closeModal } = useModal();

  const removeAttendee = async e => {
    e.preventDefault();
    await dispatch(eventActions.deleteAttendee(eventId, attendee.id));
    setModalContent(<h2 className="subheading alert-success">Successully Deleted!</h2>);
    navigate(`/events/${eventId}`, { replace: true });
  }

  return (
    <div className="member-wrapper" key={attendee.id}>
      <div className="member-avatar">
        <img src={attendee.profileImageUrl} alt="avatar" />
      </div>
      <div className="member-info-wrapper">
        <h2 className="subheading">Attendee Information</h2>
        <div id="event-line-break"></div>
        <div className="member-info">
          <div className="membership member">
            <div className="membership-labels">
              <div>First Name</div>
              <div>Last Name</div>
              <div>Status</div>
            </div>
            <div className="membership-data">
              <div>{attendee.firstName}</div>
              <div>{attendee.lastName}</div>
              <div>{capitalize(attendee.Attendance.status)}</div>
            </div>
          </div>
        </div>
        {/* Co-host only allowed to accepted new attendees (pending -> waitlist), and have no right to change current attendees' status, and can't remove attendees */}
        {(status === "owner" || (status === "co-host" && attendeeType === "pending")) && (
          <div className="membership-btns">
            {userId !== attendee.id &&
              <OpenModalButton
                buttonText="Update status"
                modalComponent={<AttendanceStatusForm eventId={eventId} attendee={attendee} status={status} />}
              />
            }
            {status === "owner" && <OpenModalButton
              buttonText="Remove member"
              modalComponent={<ConfirmDeleteForm title="Member" deleteCb={removeAttendee} cancelDeleteCb={closeModal} />}
            />}
          </div>
        )}
      </div>
    </div>
  );
}

export default Attendee;
