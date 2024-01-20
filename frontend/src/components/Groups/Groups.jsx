import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as groupActions from '../../store/group';

function Groups() {
  const dispatch = useDispatch();
  const groups = useSelector(groupActions.getGroups);

  useEffect(() => {
    dispatch(groupActions.loadGroups());
  }, [dispatch]);

  return (
    <h2>Groups</h2>
  );
}

export default Groups;
