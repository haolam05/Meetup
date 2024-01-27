import { useModal } from "../../context/Modal";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import ConfirmDeleteForm from "../ConfirmDeleteForm";
import * as sessionActions from "../../store/session";

function DeleteUser() {
  const { closeModal } = useModal();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const deleteUser = async e => {
    e.preventDefault();
    await dispatch(sessionActions.deleteUser());
    navigate(`/`, { replace: true });
  }

  return <ConfirmDeleteForm text="User" deleteCb={e => deleteUser(e) && closeModal()} cancelDeleteCb={closeModal} />;
}

export default DeleteUser;
