import { useModal } from "../../context/Modal";
import { useDispatch } from "react-redux";
import ConfirmDeleteForm from "../ConfirmDeleteForm";
import * as groupActions from "../../store/group";

function DeleteGroup({ groupId }) {
  const { closeModal } = useModal();
  const dispatch = useDispatch();

  const deleteGroup = async e => {
    e.preventDefault();
    await dispatch(groupActions.deleteGroup(groupId));
    window.location.href = "/groups";
  }

  return <ConfirmDeleteForm text="Group" deleteCb={deleteGroup} cancelDeleteCb={closeModal} />;
}

export default DeleteGroup;
