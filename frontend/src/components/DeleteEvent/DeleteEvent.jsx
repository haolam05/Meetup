import { useModal } from "../../context/Modal";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import ConfirmDeleteForm from "../ConfirmDeleteForm";
import * as eventActions from "../../store/event";

function DeleteEvent({ groupId, eventId }) {
  const { closeModal } = useModal();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const deleteEvent = async e => {
    e.preventDefault();
    await dispatch(eventActions.deleteEvent(eventId, groupId));
    navigate(`/groups/${groupId}`, { replace: true });
  }

  return <ConfirmDeleteForm text="Event" deleteCb={e => deleteEvent(e) && closeModal()} cancelDeleteCb={closeModal} />;
}

export default DeleteEvent;
