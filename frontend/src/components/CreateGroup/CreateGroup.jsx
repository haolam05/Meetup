import GroupForm from "../GroupForm";

function CreateGroup() {
  return (
    <div id="lists-container">
      <div id="lists">
        <h1 id="list-headers" className="heading">Start a New Group</h1>
        <GroupForm onSubmitCb={() => console.log('⬅️⬅️⬅️ submited ⬅️⬅️⬅️')} />
      </div>
    </div>
  )

}

export default CreateGroup;
