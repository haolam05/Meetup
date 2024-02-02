import { useModal } from "../../context/Modal";
import MembershipStatusModal from "../MembershipStatusModal";
import "./MembershipStatus.css";

function MembershipStatus({ user, group }) {
  const { setModalContent } = useModal();

  if (user) {
    if (group.organizerId === user.id) {
      return <span
        className="owner"
        onClick={() => setModalContent(<MembershipStatusModal />)}
      >
        <i className="fa-solid fa-user-check"></i>
      </span>
    }
    const member = group.members.find(member => member.id === user.id);
    if (!member) return;
    if (member.Membership.status === 'co-host') {
      return <span
        className="co-host"
        onClick={() => setModalContent(<MembershipStatusModal />)}
      >
        <i className="fa-solid fa-user-check"></i>
      </span>
    }
    if (member.Membership.status === 'member') {
      return <span
        className="member"
        onClick={() => setModalContent(<MembershipStatusModal />)}
      >
        <i className="fa-solid fa-user-check"></i>
      </span>
    }
  }
}

export default MembershipStatus;
