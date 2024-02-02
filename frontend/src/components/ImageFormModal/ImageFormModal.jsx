import { useState } from "react";
import { useDispatch } from "react-redux";
import { updateFile } from "../../utils/images";
import { useNavigate } from "react-router-dom";
import { useModal } from "../../context/Modal";
import { disabledSubmitButton } from "../../utils/dom";
import * as groupActions from "../../store/group";
import * as eventActions from "../../store/event";
import "./ImageFormModal.css";

function ImageFormModal({ eventId, groupId }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { setModalContent } = useModal();
  const [image, setImage] = useState("");

  const handleSubmit = async e => {
    e.preventDefault();
    disabledSubmitButton();

    if (groupId) {
      await dispatch(groupActions.loadGroupImage({
        groupId,
        image
      }));
      setModalContent(<h2 className="subheading alert-success">Successully Uploaded!</h2>)
      navigate(`/groups/${groupId}`);
    } else if (eventId) {
      await dispatch(eventActions.loadEventImage({
        eventId,
        image
      }));
      setModalContent(<h2 className="subheading alert-success">Successully Uploaded!</h2>)
      navigate(`/events/${eventId}`);
    }
  }

  return (
    <div className="image-form-modal">
      <h2 className="subheading">New Image</h2>
      <form onSubmit={handleSubmit}>
        <input type="file" onChange={e => updateFile(e, setImage)} />
        <button type="submit" className={`btn-primary ${image ? '' : 'disabled'}`} disabled={!image}>Upload</button>
      </form>
    </div>
  );
}

export default ImageFormModal;
