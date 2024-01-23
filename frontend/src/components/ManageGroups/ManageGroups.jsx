import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Loading from '../Loading';
import Group from '../Group';
import * as sessionActions from '../../store/session';
import * as groupActions from '../../store/group';

function ManageGroups() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);
  const user = useSelector(sessionActions.sessionUser);
  const groups = useSelector(groupActions.getGroupsByUserId(user.id));

  useEffect(() => {
    const loadGroups = async () => {
      await dispatch(sessionActions.restoreSession());
      await dispatch(groupActions.loadGroups());
      setIsLoaded(true);
    }
    loadGroups();
  }, [dispatch]);

  if (!isLoaded) return <Loading />;

  return <li>{groups.map(group => <Group key={group.id} group={group} />)}</li>;
}

export default ManageGroups;
