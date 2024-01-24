import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import GroupForm from "../GroupForm";
import Loading from '../Loading';
import * as sessionActions from '../../store/session';
import * as groupActions from '../../store/group';

function EditGroup() {
  const { groupId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isLoaded, setIsLoaded] = useState(false);
  const group = useSelector(groupActions.getGroupById(groupId));
  const user = useSelector(sessionActions.sessionUser);

  useEffect(() => {
    const loadGroupDetails = async () => {
      await dispatch(groupActions.loadGroupDetails(groupId));
      await dispatch(sessionActions.restoreSession());
      setIsLoaded(true);
    }
    loadGroupDetails();
  }, [dispatch, groupId]);

  useEffect(() => {
    if (isLoaded) {
      if (!user || (group && user.id !== group?.Organizer.id)) {
        navigate('/', { replace: true });
      }
    }
  });

  if (!isLoaded) return <Loading />;

  return (
    <div id="lists-container">
      <div id="lists">
        <h1 id="list-headers" className="heading new-group">Update Your Group</h1>
        <GroupForm title="Update Group" group={group} />
      </div>
    </div>
  );
}

export default EditGroup;
