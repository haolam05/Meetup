import { useModal } from "../../context/Modal";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import ConfirmDeleteForm from "../ConfirmDeleteForm";
import OpenModalButton from "../OpenModalButton";
import * as groupActions from "../../store/group";

function UnjoinGroupBtn({ group, user, status }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { setModalContent, closeModal } = useModal();

  const removeMember = async e => {
    e.preventDefault();
    await dispatch(groupActions.deleteMember(group.id, user.id, status));
    setModalContent(<h2 className="subheading alert-success">Successully Deleted!</h2>);
    navigate(`/groups`, { replace: true });
  }

  return <OpenModalButton
    buttonText="Unjoin this group"
    modalComponent={<ConfirmDeleteForm unjoinGroup={true} deleteCb={removeMember} cancelDeleteCb={closeModal} />}
  />;
}

export default UnjoinGroupBtn;
