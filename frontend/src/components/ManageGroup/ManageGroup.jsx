import { getPreviewImageUrl } from "../../utils/images";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import OpenModalButton from "../OpenModalButton";
import DeleteGroup from "../DeleteGroup";
import "./ManageGroup.css";

function ManageGroup({ group, user }) {
  const navigate = useNavigate();
  const [updateGroupBtn, setUpdateGroupBtn] = useState(false);

  useEffect(() => {
    if (updateGroupBtn) {
      navigate(`/groups/${group.id}/edit`, { replace: true });
    }
  }, [updateGroupBtn, group.id, navigate]);

  const handleToGroupDetailsPage = e => {
    if (!e.target.classList.contains("btn-accent")) {
      navigate(`/groups/${group.id}`, { replace: true });
    }
  }

  return (
    <div id="manage-group" className="group" onClick={handleToGroupDetailsPage}>
      <div className="group-image">
        <img
          className="group-thumbnail"
          src={getPreviewImageUrl(group)}
          alt="preview-image"
        />
      </div>
      <div id="group-text-wrapper">
        <div className="group-text">
          <h2 className="group-name subheading">{group.name}</h2>
          <div className="group-location">{group.city}, {group.state}</div>
          <div className="group-info">
            <span className="group-num-events">{group.numEvents} event{group.numEvents > 1 ? 's' : ''}</span>
            <span className="group-dot">.</span>
            <span className="group-status">{group.private ? "Private" : "Public"}</span>
          </div>
        </div>
        {user && (
          user.id !== group.organizerId ? (
            <button
              id="group-join-btn"
              className="btn-accent"
              onClick={() => alert("Feature coming soon")}
            >
              Join this group
            </button>
          ) : (
            <div id="event-btns">
              <button className="btn-accent" onClick={() => setUpdateGroupBtn(true)}>Update</button>
              <OpenModalButton
                modalComponent={<DeleteGroup groupId={group.id} />}
                buttonText="Delete"
              />
            </div>
          )
        )
        }
      </div>
    </div>
  );
}

export default ManageGroup;
