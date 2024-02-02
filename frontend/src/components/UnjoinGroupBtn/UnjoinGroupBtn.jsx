import { useModal } from "../../context/Modal";
import ConfirmDeleteForm from "../ConfirmDeleteForm";
import OpenModalButton from "../OpenModalButton";

function UnjoinGroupBtn({ removeMember }) {
  const { closeModal } = useModal();

  return <OpenModalButton
    buttonText="Unjoin this group"
    modalComponent={<ConfirmDeleteForm unjoinGroup={true} deleteCb={removeMember} cancelDeleteCb={closeModal} />}
  />;
}

export default UnjoinGroupBtn;
