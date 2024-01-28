import { useModal } from "../../context/Modal";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import ConfirmDeleteForm from "../ConfirmDeleteForm";
import * as sessionActions from "../../store/session";

function DeleteUser({ userId, title }) {
  const { closeModal } = useModal();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { setModalContent } = useModal();

  const deleteUser = async e => {
    e.preventDefault();
    await dispatch(sessionActions.deleteUser(userId));
    setModalContent(<h2 className="subheading alert-success">Successully Deleted!</h2>);
    navigate(`/`, { replace: true });
  }

  return <ConfirmDeleteForm text="User" deleteCb={e => deleteUser(e) && closeModal()} cancelDeleteCb={closeModal} title={title} />;
}

export default DeleteUser;
