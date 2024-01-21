import { useNavigate } from 'react-router-dom';
import "./Group.css";

function Group({ group, user = false, description = true, organizer = false }) {
  const navigate = useNavigate();

  return (
    <div key={group.id} className="group" onClick={() => navigate(`/groups/${group.id}`)}>
      <div className="group-image">
        <img
          className="group-thumbnail"
          src={group.previewImage === "Preview Image Not Found" ? "/images/no-preview-available.jpg" : group.previewImage}
          alt="preview-image"
        />
      </div>
      <div id="group-text-wrapper">
        <div className="group-text">
          <h2 className="group-name subheading">{group.name}</h2>
          <div className="group-location">{group.city}, {group.state}</div>
          {description && (
            <div className="group-description">{group.about}</div>
          )}
          <div className="group-info">
            <span className="group-num-events">{group.numEvents} event{group.numEvents > 1 ? 's' : ''}</span>
            <span className="group-dot">.</span>
            <span className="group-status">{group.private ? "Private" : "Public"}</span>
          </div>
          {organizer && (
            <div id="group-organizer">
              Organized by: {group.Organizer.firstName}, {group.Organizer.lastName}
            </div>
          )}
        </div>
        {user && (
          user.id !== group.organizerId ? (
            <button
              className="group-join-btn btn-primary"
              onClick={() => alert("Feature coming soon")}
            >
              Join this group
            </button>
          ) : (
            <div id="event-btns">
              <button className="btn-accent">Create event</button>
              <button className="btn-accent">Update</button>
              <button className="btn-accent">Delete</button>
            </div>
          )
        )
        }
      </div>
    </div>
  );
}

export default Group;
