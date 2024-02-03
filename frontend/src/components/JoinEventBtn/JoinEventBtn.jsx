import { useModal } from "../../context/Modal";
import { useDispatch } from "react-redux";
import { disabledSubmitButton, enabledSubmitButton } from "../../utils/dom";
import { useNavigate } from "react-router-dom";
import * as eventActions from "../../store/event";

function JoinEventBtn({ eventId }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { setModalContent } = useModal();

  const requestAttendance = async e => {
    e.preventDefault();
    disabledSubmitButton();

    const data = await dispatch(eventActions.loadEventAttendee(eventId));

    if (data?.errors) {
      enabledSubmitButton();
      setModalContent(<h2 className="subheading modal-errors">{data.errors.message}</h2>);
    } else {
      setModalContent(<h2 className="subheading alert-success">Successully Sent Request!</h2>);
      navigate(`/events`, { replace: true });
    }
  }

  return <button type="submit" id="group-join-btn" className="btn-primary group-join-btn" onClick={requestAttendance}>Join this event</button>;
}

export default JoinEventBtn;
