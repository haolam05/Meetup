import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import EventForm from "../EventForm";
import Loading from '../Loading';
import * as sessionActions from '../../store/session';
import * as groupActions from '../../store/group';
import * as eventActions from '../../store/event';

function EditEvent() {
  const { eventId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isLoaded, setIsLoaded] = useState(false);
  const event = useSelector(eventActions.getEventById(eventId));
  const group = useSelector(groupActions.getGroupById(event?.groupId));
  const user = useSelector(sessionActions.sessionUser);

  useEffect(() => {
    const loadInfo = async () => {
      const event = await dispatch(eventActions.loadEventDetails(eventId));
      await dispatch(groupActions.loadGroupDetails(event.groupId));
      await dispatch(sessionActions.restoreSession());
      setIsLoaded(true);
    }
    loadInfo();
  }, [dispatch, eventId]);

  useEffect(() => {
    if (isLoaded) {
      if (!user || (user.id !== group.Organizer.id)) {
        navigate('/', { replace: true });
      }
    }
  });

  if (!isLoaded) return <Loading />;

  return (
    <div id="lists-container">
      <div id="lists">
        <h1 id="list-headers" className="heading new-group">Update Your Event</h1>
        <EventForm title="Update Event" event={event} />
      </div>
    </div>
  );
}

export default EditEvent;
