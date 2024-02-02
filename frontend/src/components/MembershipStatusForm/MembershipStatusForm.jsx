import { useDispatch } from "react-redux";
import { disabledSubmitButton } from "../../utils/dom";
import { useState } from "react";
import { useModal } from "../../context/Modal";
import * as groupActions from "../../store/group";
import "./MembershipStatusForm.css";

function MembershipStatusForm({ groupId, member, status }) {
  const dispatch = useDispatch();
  const { setModalContent } = useModal();
  const [memberStatus, setMemberStatus] = useState("member");

  const handleSubmit = async e => {
    e.preventDefault();
    disabledSubmitButton();

    const payload = {
      memberId: member.id,
      status: memberStatus
    }

    const data = await dispatch(groupActions.updateMember(groupId, payload));
    if (data?.errors) {
      return setModalContent(<h2 className="subheading modal-errors">{data.errors.message}</h2>);
    }
    setModalContent(<h2 className="subheading alert-success">Successully Updated!</h2>);
  }

  return (
    <div>
      <h2 className="subheading">Membership status</h2>
      <form className="membership-status-form" onSubmit={handleSubmit}>
        <label htmlFor="current-status">Current status</label>
        <input type="text" disabled value={member.Membership.status} />
        <label htmlFor="new-status">New status</label>
        <select name="membership-status" value={memberStatus} onChange={e => setMemberStatus(e.target.value)}>
          <option value={status}>member</option>
          {status === "owner" && <option value="co-host">co-host</option>}
        </select>
        <button type="submit" className="btn-primary">Update</button>
      </form>
    </div>
  );
}

export default MembershipStatusForm;
