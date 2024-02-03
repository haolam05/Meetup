import { useModal } from "../../context/Modal";
import { capitalize } from "../../utils/capitalize";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import ConfirmDeleteForm from "../ConfirmDeleteForm";
import MembershipStatusForm from "../MembershipStatusForm";
import OpenModalButton from "../OpenModalButton";
import * as groupActions from "../../store/group";
import "./Member.css";

function Member({ member, status, memberType, groupId }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { setModalContent, closeModal } = useModal();

  const removeMember = async e => {
    e.preventDefault();
    await dispatch(groupActions.deleteMember(groupId, member.id));
    setModalContent(<h2 className="subheading alert-success">Successully Deleted!</h2>);
    navigate(`/groups/${groupId}`, { replace: true });
  }

  return (
    <div className="member-wrapper" key={member.id}>
      <div className="member-avatar">
        <img src={member.profileImageUrl} alt="avatar" />
      </div>
      <div className="member-info-wrapper">
        <h2 className="subheading">Member Information</h2>
        <div id="event-line-break"></div>
        <div className="member-info">
          <div className="membership member">
            <div className="membership-labels">
              <div>First Name</div>
              <div>Last Name</div>
              <div>Status</div>
            </div>
            <div className="membership-data">
              <div>{member.firstName}</div>
              <div>{member.lastName}</div>
              <div>{capitalize(member.Membership.status)}</div>
            </div>
          </div>
        </div>
        {/* Co-host only allowed to accepted new members (pending -> member), and have no right to change current members' status, and can't remove members */}
        {(status === "owner" || (status === "co-host" && memberType === "pending")) && (
          <div className="membership-btns">
            <OpenModalButton
              buttonText="Update status"
              modalComponent={<MembershipStatusForm groupId={groupId} member={member} status={status} />}
            />
            {status === "owner" && <OpenModalButton
              buttonText="Remove member"
              modalComponent={<ConfirmDeleteForm title="Member" deleteCb={removeMember} cancelDeleteCb={closeModal} />}
            />}
          </div>
        )}
      </div>
    </div>
  );
}

export default Member;
