import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useModal } from '../../context/Modal';
import Loading from '../Loading';
import NoResultsFound from '../NoResultsFound';
import ManageEvent from '../ManageEvent/ManageEvent';
import * as sessionActions from '../../store/session';
import * as eventActions from '../../store/event';
import { sortAsc, sortDesc } from '../../utils/dateConverter';

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
        setModalContent(<h2 className="subheading modal-errors">{events.errors.message}</h2>)
        navigate("/", { replace: true });
      }

      await dispatch(sessionActions.restoreSession());
      setIsLoaded(true);
    }
    loadEvents();
  }, [dispatch, navigate, setModalContent]);

  if (!isLoaded) return <Loading />;
  if (!events.length) return <div className="no-results-wrapper"><NoResultsFound /></div>;

  return <li>{sortDesc(events).map(event => <ManageEvent key={event.id} event={event} user={user} />)}</li>;
}

export default ManageEvents;
