import "./ConfirmDeleteForm.css";

function ConfirmDeleteForm({ text, deleteCb, cancelDeleteCb, title }) {
  return (
    <div id="confirm-delete">
      <h2 className="subheading">Confirm Delete</h2>
      <p>Are you sure you want to remove this {title ? title.toLowerCase() : text.toLowerCase()}?</p>
      <div>
        <button
          className="btn-primary delete"
          onClick={deleteCb}
        >
          <span>Yes</span>
          <span className="sub-text">(Delete {title ? title : text})</span>
        </button>
        <button
          className="btn-accent cancel"
          onClick={cancelDeleteCb}
        >
          <span>No</span>
          <span className="sub-text">(Keep {title ? title : text})</span>
        </button>
      </div>
    </div>
  );
}

export default ConfirmDeleteForm;
