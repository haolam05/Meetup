import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useModal } from '../../context/Modal';
import Loading from '../Loading';
import ManageEvent from '../ManageEvent/ManageEvent';
import * as sessionActions from '../../store/session';
import * as eventActions from '../../store/event';

function ManageEvents() {
  const { setModalContent } = useModal();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);
  const user = useSelector(sessionActions.sessionUser);
  const events = useSelector(eventActions.getCurrentUserEvents);

  useEffect(() => {
    const loadEvents = async () => {
      const events = await dispatch(eventActions.loadCurrentUserEvents());
      if (events?.errors?.message) {
        setModalContent(<h1 className="heading modal-errors">{events.errors.message}</h1>)
        navigate("/", { replace: true });
      }

      await dispatch(sessionActions.restoreSession());
      setIsLoaded(true);
    }
    loadEvents();
  }, [dispatch, navigate, setModalContent]);

  if (!isLoaded) return <Loading />;

  return <li>{events.map(event => <ManageEvent key={event.id} event={event} user={user} />)}</li>;
}

export default ManageEvents;
