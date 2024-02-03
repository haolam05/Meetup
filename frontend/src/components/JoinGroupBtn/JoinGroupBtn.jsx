import { useModal } from "../../context/Modal";
import { useDispatch } from "react-redux";
import { disabledSubmitButton, enabledSubmitButton } from "../../utils/dom";
import { useNavigate } from "react-router-dom";
import * as groupActions from "../../store/group";

function JoinGroupBtn({ groupId }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { setModalContent } = useModal();

  const requestMembership = async e => {
    e.preventDefault();
    disabledSubmitButton();

    const data = await dispatch(groupActions.loadGroupMember(groupId));

    if (data?.errors) {
      enabledSubmitButton();
      setModalContent(<h2 className="subheading modal-errors">{data.errors.message}</h2>);
    } else {
      setModalContent(<h2 className="subheading alert-success">Successully Sent Request!</h2>);
      navigate(`/groups`, { replace: true });
    }
  }

  return <button type="submit" id="group-join-btn" className="btn-primary group-join-btn" onClick={requestMembership}>Join this group</button>;
}

export default JoinGroupBtn;
