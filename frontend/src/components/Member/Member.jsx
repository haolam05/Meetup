import { useModal } from "../../context/Modal";
import ConfirmDeleteForm from "../ConfirmDeleteForm";
import MembershipStatusForm from "../MembershipStatusForm";
import OpenModalButton from "../OpenModalButton";
import "./Member.css";

function Member({ member }) {
  const { closeModal } = useModal();

  const removeMember = e => {
    e.preventDefault();
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
              <div>{member.Membership.status}</div>
            </div>
          </div>
        </div>
        <div className="membership-btns">
          <OpenModalButton buttonText="Update status" modalComponent={<MembershipStatusForm member={member} />} />
          <OpenModalButton buttonText="Remove member" modalComponent={<ConfirmDeleteForm title="Member" deleteCb={removeMember} cancelDeleteCb={closeModal} />} />
        </div>
      </div>
    </div>
  );
}

export default Member;
