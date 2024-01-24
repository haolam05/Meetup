import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Pagination from '../Pagination';
import Loading from '../Loading';
import Group from '../Group';
import * as groupActions from '../../store/group';

function Groups() {
  const dispatch = useDispatch();
  const [page, setPage] = useState(1);
  const [isLoaded, setIsLoaded] = useState(false);
  const groups = useSelector(groupActions.getGroups);

  useEffect(() => {
    const loadGroups = async () => {
      await dispatch(groupActions.loadGroups(page, 5));
      setIsLoaded(true);

      document.querySelector(".page-prev")?.removeAttribute("disabled");
      document.querySelector(".page-next")?.removeAttribute("disabled");
    }
    loadGroups();
  }, [dispatch, page]);

  if (!isLoaded) return <Loading />;

  return <>
    <Pagination
      list={groups}
      page={page}
      setPage={setPage}
    />
    <li>{groups.map(group => <Group key={group.id} group={group} />)}</li>
  </>
}

export default Groups;
