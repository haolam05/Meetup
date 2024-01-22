import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import GroupForm from "../GroupForm";
import Loading from '../Loading';
import * as groupActions from '../../store/group';

function EditGroup() {
  const { groupId } = useParams();
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);
  const group = useSelector(groupActions.getGroupById(groupId));

  useEffect(() => {
    const loadGroupDetails = async () => {
      await dispatch(groupActions.loadGroupDetails(groupId));
      setIsLoaded(true);
    }
    loadGroupDetails();
  }, [dispatch, groupId]);

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
