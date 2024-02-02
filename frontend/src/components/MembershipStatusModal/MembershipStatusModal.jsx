import "./MembershipStatusModal.css";

function MembershipStatusModal() {
  return (
    <>
      <h2 className="subheading">Membership status</h2>
      <div className="label-breakdown">
        <div className="label-icons">
          <span className="owner"><i className="fa-solid fa-user-check"></i></span>
          <span className="co-host"> <i className="fa-solid fa-user-check"></i></span>
          <span className="member"> <i className="fa-solid fa-user-check"></i></span>
        </div>
        <div className="label-text">
          <div>Owner</div>
          <div>Co-host</div>
          <div>Member</div>
        </div>
      </div>
    </>
  );
}

export default MembershipStatusModal;
