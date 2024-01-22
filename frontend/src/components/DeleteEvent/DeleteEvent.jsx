import { useModal } from "../../context/Modal";
import { useDispatch } from "react-redux";
import ConfirmDeleteForm from "../ConfirmDeleteForm";
import * as eventActions from "../../store/event";

function DeleteEvent({ groupId, eventId }) {
  const { closeModal } = useModal();
  const dispatch = useDispatch();

  const deleteEvent = async e => {
    e.preventDefault();
    await dispatch(eventActions.deleteEvent(eventId));
    window.location.href = `/groups/${groupId}`;
  }

  return <ConfirmDeleteForm text="Event" deleteCb={deleteEvent} cancelDeleteCb={closeModal} />;
}

export default DeleteEvent;
