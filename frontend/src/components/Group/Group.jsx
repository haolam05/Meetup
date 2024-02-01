import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getPreviewImageUrl, getProfileImageUrl } from '../../utils/images';
import OpenModalButton from '../OpenModalButton';
import DeleteGroup from '../DeleteGroup';
import ImageSlider from '../ImageSlider';
import MembershipStatus from '../MembershipStatus';
import "./Group.css";

function Group({ group, user = false, description = true, organizer = false, userGroups = [], showSlider = false }) {
  const navigate = useNavigate();
  const [updateGroupBtn, setUpdateGroupBtn] = useState(false);
  const [createEventBtn, setCreateEventBtn] = useState(false);
  const [slide, setSlide] = useState(0);

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
        {showSlider ? (
          <ImageSlider
            images={group.GroupImages}
            slide={slide}
            setSlide={setSlide}
          />
        ) : (
          <img
            className="group-thumbnail"
            src={getPreviewImageUrl(group)}
            alt="preview-image"
          />
        )}
      </div>
      <div id="group-text-wrapper">
        <div className="group-text">
          {organizer ?
            <h1 className="group-name heading">{group.name} {<MembershipStatus user={user} group={group} />}</h1> :
            <h2 className="group-name subheading">{group.name}</h2>
          }
          <div className="group-location">{group.city}, {group.state}</div>
          {description && (
            <div className="group-description">{group.about.slice(0, 50)}...</div>
          )}
          <div className="group-info">
            <span className="group-num-events">{group.numEvents} event{group.numEvents > 1 ? 's' : ''}</span>
            <span className="group-dot">.</span>
            <span className="group-status">{group.private ? "Private" : "Public"}</span>
            <span className="group-dot">.</span>
            <span>{group.type}</span>
          </div>
          {organizer && (
            <div id="group-organizer" className="group-avatar-container">
              <div>Organized by: {group?.Organizer.firstName}, {group?.Organizer.lastName}</div>
              <div className="group-organizer-avatar" ><img src={getProfileImageUrl(group?.Organizer.profileImageUrl)} alt="avatar" /></div>
            </div>
          )}
        </div>
        {user && (
          user.id !== group.organizerId ? (
            userGroups.find(userGroup => userGroup.id === group.id) ? (
              <button id="group-join-btn" className="btn-accent" onClick={() => alert("Feature coming soon")}>Unjoin this group</button>
            ) : (
              <button id="group-join-btn" className="btn-primary" onClick={() => alert("Feature coming soon")}>Join this group</button>
            )
          ) : (
            <div id="event-btns">
              <button className="btn-accent" onClick={() => setCreateEventBtn(true)}>Create event</button>
              <button className="btn-accent" onClick={() => setUpdateGroupBtn(true)}>Update</button>
              <OpenModalButton modalComponent={<DeleteGroup groupId={group.id} />} buttonText="Delete" />
            </div>
          )
        )
        }
      </div>
    </div>
  );
}

export default Group;
