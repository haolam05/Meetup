import { getPreviewImageUrl } from "../../utils/images";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useModal } from "../../context/Modal";
import OpenModalButton from "../OpenModalButton";
import DeleteGroup from "../DeleteGroup";
import Loading from "../Loading";
import UnjoinGroupBtn from "../UnjoinGroupBtn";
import PendingBtn from "../PendingBtn";
import * as groupActions from "../../store/group";
import "./ManageGroup.css";

function ManageGroup({ group, user }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { setModalContent } = useModal();
  const [updateGroupBtn, setUpdateGroupBtn] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const userGroups = useSelector(groupActions.getCurrentUserGroups);

  useEffect(() => {
    if (updateGroupBtn) {
      navigate(`/groups/${group.id}/edit`, { replace: true });
    }
  }, [updateGroupBtn, group.id, navigate]);

  useEffect(() => {
    const loadInfo = async () => {
      if (user) await dispatch(groupActions.loadCurrentUserGroups());
      setIsLoaded(true);
    }
    loadInfo();
  }, [dispatch, user])

  const removeMember = status => async e => {
    e.preventDefault();
    await dispatch(groupActions.deleteMember(group.id, user.id, status));
    setModalContent(<h2 className="subheading alert-success">Successully Deleted!</h2>);
    navigate(`/groups`, { replace: true });
  }

  function RegularButtons() {
    const user = userGroups.find(userGroup => userGroup.id === group.id);
    if (user.Membership.status === "pending") return <PendingBtn />
    return <UnjoinGroupBtn removeMember={removeMember(user.Membership.status)} />;
  }

  function OwnerButtons() {
    return (
      <div id="event-btns">
        <button className="btn-accent" onClick={() => setUpdateGroupBtn(true)}>Update</button>
        <OpenModalButton
          modalComponent={<DeleteGroup groupId={group.id} />}
          buttonText="Delete"
        />
      </div>
    );
  }

  const handleToGroupDetailsPage = e => {
    if (!e.target.classList.contains("btn-accent")) {
      navigate(`/groups/${group.id}`, { replace: true });
    }
  }

  if (!isLoaded) return <Loading />;

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
            <span className="group-dot">.</span>
            <span>{group.type}</span>
          </div>
        </div>
        {user && (user.id !== group.organizerId ? <RegularButtons /> : <OwnerButtons />)}
      </div>
    </div>
  );
}

export default ManageGroup;
