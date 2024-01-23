import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import Loading from '../Loading';
import EventForm from "../EventForm";
import * as groupActions from '../../store/group';
import "./CreateEvent.css";

function CreateEvent() {
  const dispatch = useDispatch();
  const { groupId } = useParams();
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
        <h1 id="list-headers" className="heading new-group">Create a new event</h1>
        <div id="event-group-name">{group.name}</div>
        <EventForm groupId={groupId} title="Create Event" />
      </div>
    </div>
  );
}

export default CreateEvent;
