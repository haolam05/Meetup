import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getPreviewImageUrl, getProfileImageUrl } from '../../utils/images';
import { useModal } from '../../context/Modal';
import OpenModalButton from '../OpenModalButton';
import DeleteGroup from '../DeleteGroup';
import ImageSlider from '../ImageSlider';
import MembershipStatus from '../MembershipStatus';
import UnjoinGroupBtn from '../UnjoinGroupBtn';
import PendingBtn from '../PendingBtn';
import JoinGroupBtn from '../JoinGroupBtn';
import UserInfoModal from '../UserInfoModal';
import "./Group.css";

function Group({ group, user = false, description = true, organizer = false, userGroups = [], showSlider = false }) {
  const navigate = useNavigate();
  const { setModalContent } = useModal();
  const [updateGroupBtn, setUpdateGroupBtn] = useState(false);
  const [createEventBtn, setCreateEventBtn] = useState(false);
  const [viewGalleryBtn, setViewGalleryBtn] = useState(false);

  function RegularButtons() {
    const userGroup = userGroups.find(userGroup => userGroup.id === group.id);

    if (!userGroup) return <JoinGroupBtn groupId={group.id} />
    if (userGroup.Membership.status === "pending") return <PendingBtn />
    if (['member', 'co-host'].includes(userGroup.Membership.status)) return <UnjoinGroupBtn
      group={group}
      user={user}
      status={userGroup.Membership.status}
    />;
  }

  function OwnerButtons() {
    return (
      <>
        <button className="btn-accent" onClick={() => setCreateEventBtn(true)}>Create event</button>
        <button className="btn-accent" onClick={() => setUpdateGroupBtn(true)}>Update</button>
        <OpenModalButton modalComponent={<DeleteGroup groupId={group.id} />} buttonText="Delete" />
        <button className="btn-accent" onClick={() => setViewGalleryBtn(true)}>Gallery</button>
      </>
    );
  }

  function GroupName() {
    if (organizer) {
      return <h1 className="group-name heading">{group.name} {<MembershipStatus user={user} group={group} />}</h1>;
    } else {
      return <h2 className="group-name subheading">{group.name}</h2>;
    }
  }

  function GroupDescription() {
    if (description) {
      return <div className="group-description">{group.about.slice(0, 50)}...</div>;
    }
  }

  function GroupLocation() {
    return <div className="group-location">{group.city}, {group.state}</div>;
  }

  function GroupInfo() {
    return (
      <div className="group-info">
        <span className="group-num-events">{group.numEvents} event{group.numEvents > 1 ? 's' : ''}</span>
        <span className="group-dot">.</span>
        <span className="group-status">{group.private ? "Private" : "Public"}</span>
        <span className="group-dot">.</span>
        <span>{group.type}</span>
      </div>
    );
  }

  useEffect(() => {
    if (updateGroupBtn) {
      navigate(`/groups/${group.id}/edit`, { replace: true });
    }

    if (createEventBtn) {
      navigate(`/groups/${group.id}/events/new`, { replace: true });
    }

    if (viewGalleryBtn) {
      navigate(`/groups/${group.id}/images`, { replace: true });
    }
  }, [updateGroupBtn, createEventBtn, viewGalleryBtn, group.id, navigate]);

  return (
    <div
      className={`group ${organizer ? 'details' : ''}`}
      onClick={() => navigate(`/groups/${group.id}`, { replace: true })}
    >
      <div className="group-image">
        {showSlider ? (
          <div className="group-thumbnail slider-image">
            <ImageSlider images={group.GroupImages} />
          </div>
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
          <GroupName />
          <GroupLocation />
          <GroupDescription />
          <GroupInfo />
          {organizer && (
            <div id="group-organizer" className="group-avatar-container">
              <div>Organized by: {group?.Organizer.firstName}, {group?.Organizer.lastName}</div>
              <div className="group-organizer-avatar user-avatar" onClick={() => setModalContent(<UserInfoModal user={group.Organizer} />)}>
                <img src={getProfileImageUrl(group?.Organizer.profileImageUrl)} alt="avatar" />
              </div>
            </div>
          )}
        </div>
        <div id="event-btns">
          {user && (user.id !== group.organizerId ? <RegularButtons /> : <OwnerButtons />)}
        </div>
      </div>
    </div>
  );
}

export default Group;
