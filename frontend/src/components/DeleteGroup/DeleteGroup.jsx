import { useModal } from "../../context/Modal";
import { useDispatch } from "react-redux";
import * as groupActions from "../../store/group";
import "./DeleteGroup.css";

function DeleteGroup({ groupId }) {
  const { closeModal } = useModal();
  const dispatch = useDispatch();

  const deleteGroup = async e => {
    e.preventDefault();
    await dispatch(groupActions.deleteGroup(groupId));
    window.location.href = "/groups";
  }

  return (
    <div id="delete-group">
      <h2 className="subheading">Confirm Delete</h2>
      <p>Are you sure you wnat to remove this group?</p>
      <div>
        <button
          className="btn-primary delete"
          onClick={deleteGroup}
        >
          <span>Yes</span>
          <span className="sub-text">(Delete Group)</span>
        </button>
        <button
          className="btn-accent cancel"
          onClick={closeModal}
        >
          <span>No</span>
          <span className="sub-text">(Keep Group)</span>
        </button>
      </div>
    </div>
  );
}

export default DeleteGroup;
