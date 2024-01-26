import { useModal } from "../../context/Modal";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import ConfirmDeleteForm from "../ConfirmDeleteForm";
import * as groupActions from "../../store/group";

function DeleteGroup({ groupId }) {
  const { closeModal } = useModal();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const deleteGroup = async e => {
    e.preventDefault();
    await dispatch(groupActions.deleteGroup(groupId));
    navigate(`/groups`, { replace: true });
  }

  return <ConfirmDeleteForm text="Group" deleteCb={e => deleteGroup(e) && closeModal()} cancelDeleteCb={closeModal} />;
}

export default DeleteGroup;
