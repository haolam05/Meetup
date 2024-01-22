import GroupForm from "../GroupForm";
import "./CreateGroup.css";

function CreateGroup() {
  return (
    <div id="lists-container">
      <div id="lists">
        <h1 id="list-headers" className="heading new-group">Start a New Group</h1>
        <GroupForm />
      </div>
    </div>
  )

}

export default CreateGroup;
