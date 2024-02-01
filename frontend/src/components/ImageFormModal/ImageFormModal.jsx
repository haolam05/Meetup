import { useState } from "react";
import { useDispatch } from "react-redux";
import { updateFile } from "../../utils/images";
import { useNavigate } from "react-router-dom";
import { useModal } from "../../context/Modal";
import * as groupActions from "../../store/group";
import "./ImageFormModal.css";

function ImageFormModal({ groupId }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { setModalContent } = useModal();
  const [image, setImage] = useState("");

  const handleSubmit = async e => {
    e.preventDefault();
    await dispatch(groupActions.loadGroupImage({
      groupId,
      image
    }));
    setModalContent(<h2 className="subheading alert-success">Successully Uploaded!</h2>)
    navigate(`/groups/${groupId}`);
  }

  return (
    <div className="image-form-modal">
      <h2 className="subheading">New Image</h2>
      <form onSubmit={handleSubmit}>
        <input type="file" onChange={e => updateFile(e, setImage)} />
        <button className={`btn-primary ${image ? '' : 'disabled'}`} disabled={!image}>Upload</button>
      </form>
    </div>
  );
}

export default ImageFormModal;
