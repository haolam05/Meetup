import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getPreviewImageUrl } from '../../utils/images';
import OpenModalButton from '../OpenModalButton';
import DeleteGroup from '../DeleteGroup';
import "./Group.css";

function Group({ group, user = false, description = true, organizer = false }) {
  const navigate = useNavigate();
  const [updateGroupBtn, setUpdateGroupBtn] = useState(false);
  const [createEventBtn, setCreateEventBtn] = useState(false);

  useEffect(() => {
    if (updateGroupBtn) {
      navigate(`/groups/${group.id}/edit`, { replace: true });
    }

    if (createEventBtn) {
      navigate(`/groups/${group.id}/events/new`, { replace: true });
    }
  }, [updateGroupBtn, createEventBtn, group.id, navigate]);

  return (
    <div
      className={`group ${organizer ? 'details' : ''}`}
      onClick={() => navigate(`/groups/${group.id}`, { replace: true })}
    >
      <div className="group-image">
        <img
          className="group-thumbnail"
          src={getPreviewImageUrl(group)}
          alt="preview-image"
        />
      </div>
      <div id="group-text-wrapper">
        <div className="group-text">
          {organizer ?
            <h1 className="group-name heading">{group.name}</h1> :
            <h2 className="group-name subheading">{group.name}</h2>
          }
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
              id="group-join-btn"
              className="btn-primary"
              onClick={() => alert("Feature coming soon")}
            >
              Join this group
            </button>
          ) : (
            <div id="event-btns">
              <button className="btn-accent" onClick={() => setCreateEventBtn(true)}>Create event</button>
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

export default Group;
