import { disabledSubmitButton } from "../../utils/dom";
import "./MembershipStatusForm";

function MembershipStatusForm({ member }) {
  const handleSubmit = e => {
    e.preventDefault();
    disabledSubmitButton();
    console.log("CLICKED")
  }
  return (
    <div>
      <h2 className="subheading">Membership status</h2>
      <form className="membership-status-form" onSubmit={handleSubmit}>
        <label htmlFor="current-status">Current status</label>
        <input type="text" disabled value={member.Membership.status} />
        <label htmlFor="new-status">New status</label>
        <select name="" id="">
          <option value="member">member</option>
          <option value="co-host">co-host</option>
        </select>
        <button type="submit" className="btn-primary">Update</button>
      </form>
    </div>
  );
}

export default MembershipStatusForm;
