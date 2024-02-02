import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import { useNavigate } from "react-router-dom";
import ConfirmDeleteForm from "../ConfirmDeleteForm";
import ImageFormModal from "../ImageFormModal";
import * as groupActions from "../../store/group";
import * as eventActions from "../../store/event";
import "./ImageActionsModal.css";

function ImageActionsModal({ eventId, groupId, imageId }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { setModalContent, closeModal } = useModal();

  const deleteImage = async e => {
    e.preventDefault();
    if (groupId) {
      await dispatch(groupActions.deleteGroupImage(groupId, imageId));
      setModalContent(<h2 className="subheading alert-success">Successully Deleted!</h2>);
      navigate(`/groups/${groupId}`, { replace: true });
    } else if (eventId) {
      await dispatch(eventActions.deleteEventImage(eventId, imageId));
      setModalContent(<h2 className="subheading alert-success">Successully Deleted!</h2>);
      navigate(`/events/${eventId}`, { replace: true });
    }
  }

  return (
    <div>
      <h2 className="subheading">Choose Action</h2>
      <div className="gallery-btns">
        <button
          className="btn-accent gallery-btn"
          onClick={() => setModalContent(
            <ConfirmDeleteForm
              text="Image"
              deleteCb={deleteImage}
              cancelDeleteCb={closeModal}
            />
          )}
        >
          Delete
        </button>
        <button
          className="btn-accent gallery-btn"
          onClick={() => setModalContent(
            <ImageFormModal
              groupId={groupId}
              eventId={eventId}
            />
          )}
        >
          Upload
        </button>
      </div>
    </div>
  );
}

export default ImageActionsModal;
