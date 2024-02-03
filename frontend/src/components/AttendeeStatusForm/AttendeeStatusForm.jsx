import { useDispatch } from "react-redux";
import { disabledSubmitButton } from "../../utils/dom";
import { useState } from "react";
import { useModal } from "../../context/Modal";
import * as eventActions from "../../store/event";

function AttendanceStatusForm({ eventId, attendee, status }) {
  const dispatch = useDispatch();
  const { setModalContent } = useModal();
  const [attendeeStatus, setAttendeeStatus] = useState("waitlist");

  const handleSubmit = async e => {
    e.preventDefault();
    disabledSubmitButton();

    const payload = {
      userId: attendee.id,
      status: attendeeStatus
    }

    const data = await dispatch(eventActions.updateAttendee(eventId, payload));
    if (data?.errors) {
      return setModalContent(<h2 className="subheading modal-errors">{data.errors.message}</h2>);
    }
    setModalContent(<h2 className="subheading alert-success">Successully Updated!</h2>);
  }

  return (
    <div>
      <h2 className="subheading">Attendee status</h2>
      <form className="membership-status-form" onSubmit={handleSubmit}>
        <label htmlFor="current-status">Current status</label>
        <input type="text" disabled value={attendee.Attendance.status} />
        <label htmlFor="new-status">New status</label>
        <select name="membership-status" value={attendeeStatus} onChange={e => setAttendeeStatus(e.target.value)}>
          <option value="pending">waitlist</option>
          {status === "owner" && <option value="attending">attending</option>}
        </select>
        <button type="submit" className="btn-primary">Update</button>
      </form>
    </div>
  );
}

export default AttendanceStatusForm;
