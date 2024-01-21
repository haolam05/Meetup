import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Loading from '../Loading';
import Group from '../Group';
import * as groupActions from '../../store/group';
import "./Groups.css";

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

  return (
    <div id="groups-container">
      <ul id="groups">
        <li id="group-headers">
          <h1 className="heading">
            <a id="header-event">Events</a>
            <a id="header-group">Groups</a>
          </h1>
        </li>
        <li id="caption">Groups in Meetup</li>
        <li>{groups.map(group => <Group key={group.id} group={group} />)}</li>
      </ul>
    </div >
  );
}

export default Groups;
