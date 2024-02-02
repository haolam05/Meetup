import "./ConfirmDeleteForm.css";

function ConfirmDeleteForm({ text, deleteCb, cancelDeleteCb, title, unjoinGroup }) {
  function Question() {
    if (unjoinGroup) return <p>Are you sure you want to unjoin this group?</p>;
    return <p>Are you sure you want to remove this {title ? title.toLowerCase() : text.toLowerCase()}?</p>;
  }

  function YesReponse() {
    if (unjoinGroup) return <span className="sub-text">(Leave)</span>;
    return <span className="sub-text">(Delete {title ? title : text})</span>
  }

  function NoReponse() {
    if (unjoinGroup) return <span className="sub-text">(Stay)</span>;
    return <span className="sub-text">(Keep {title ? title : text})</span>
  }

  return (
    <div id="confirm-delete">
      <h2 className="subheading">Confirm Delete</h2>
      <Question />
      <div>
        <button
          className="btn-primary delete"
          onClick={deleteCb}
        >
          <span>Yes</span>
          <YesReponse />
        </button>
        <button
          className="btn-accent cancel"
          onClick={cancelDeleteCb}
        >
          <span>No</span>
          <NoReponse />
        </button>
      </div>
    </div>
  );
}

export default ConfirmDeleteForm;
