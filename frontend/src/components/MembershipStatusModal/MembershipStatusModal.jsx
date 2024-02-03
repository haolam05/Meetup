import { useNavigate } from "react-router-dom";
import { useModal } from "../../context/Modal";
import "./MembershipStatusModal.css";

function MembershipStatusModal({ groupId }) {
  const navigate = useNavigate();
  const { closeModal } = useModal();

  const viewMembers = () => {
    closeModal();
    navigate(`/groups/${groupId}/members`, { replace: true });
  }

  return (
    <>
      <h2 className="subheading">Membership status</h2>
      <div className="label-breakdown">
        <div className="label-icons">
          <span className="owner"><i className="fa-solid fa-user-check"></i></span>
          <span className="co-host"> <i className="fa-solid fa-user-check"></i></span>
          <span className="member"> <i className="fa-solid fa-user-check"></i></span>
          <span className="stranger"> <i className="fa-solid fa-user-check"></i></span>
        </div>
        <div className="label-text">
          <div>Owner</div>
          <div>Co-host</div>
          <div>Member</div>
          <div>Stranger</div>
        </div>
      </div>
      <button className="btn-primary view-members-btn" onClick={viewMembers}>View Members</button>
    </>
  );
}

export default MembershipStatusModal;
