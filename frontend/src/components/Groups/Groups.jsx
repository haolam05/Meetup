import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Loading from '../Loading';
import Group from '../Group';
import * as groupActions from '../../store/group';

function Groups() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);
  const groups = useSelector(groupActions.getGroups);

  useEffect(() => {
    const loadGroups = async () => {
      await dispatch(groupActions.loadGroups());
      setIsLoaded(true);
    }
    loadGroups();
  }, [dispatch]);

  if (!isLoaded) return <Loading />;

  return <li>{groups.map(group => <Group key={group.id} group={group} />)}</li>;
}

export default Groups;
