import { useModal } from "../../context/Modal";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import ConfirmDeleteForm from "../ConfirmDeleteForm";
import OpenModalButton from "../OpenModalButton";
import * as eventActions from "../../store/event";

function UnjoinEventBtn({ event, user, status }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { setModalContent, closeModal } = useModal();

  const removeAttendee = async e => {
    e.preventDefault();
    const data = await dispatch(eventActions.deleteAttendee(event.id, user.id, status));
    if (data?.errors) {
      setModalContent(<h2 className="subheading modal-errors">{data.errors.message}</h2>);
    } else {
      setModalContent(<h2 className="subheading alert-success">Successully Deleted!</h2>);
      navigate(`/events`, { replace: true });
    }
  }

  return <OpenModalButton
    buttonText="Unjoin this event"
    modalComponent={<ConfirmDeleteForm unattendEvent={true} deleteCb={removeAttendee} cancelDeleteCb={closeModal} />}
  />;
}

export default UnjoinEventBtn;
