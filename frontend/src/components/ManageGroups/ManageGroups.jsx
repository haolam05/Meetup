import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useModal } from '../../context/Modal';
import Loading from '../Loading';
import ManageGroup from '../ManageGroup/ManageGroup';
import NoResultsFound from '../NoResultsFound';
import * as groupActions from '../../store/group';
import * as sessionActions from '../../store/session';

function ManageGroups() {
  const { setModalContent } = useModal();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isLoaded, setIsLoaded] = useState(false);
  const groups = useSelector(groupActions.getCurrentUserGroups);
  const user = useSelector(sessionActions.sessionUser);

  useEffect(() => {
    const loadGroups = async () => {
      const groups = await dispatch(groupActions.loadCurrentUserGroups());
      if (groups?.errors?.message) {
        setModalContent(<h1 className="heading modal-errors">{groups.errors.message}</h1>)
        navigate("/", { replace: true });
      }

      await dispatch(sessionActions.restoreSession());
      setIsLoaded(true);
    }
    loadGroups();
  }, [dispatch, navigate, setModalContent]);

  if (!isLoaded) return <Loading />;
  if (!groups.length) return <NoResultsFound />;

  return <li>{groups.map(group => <ManageGroup key={group.id} group={group} user={user} />)}</li>;
}

export default ManageGroups;
