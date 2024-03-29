import { setPropertyOnDom } from '../../utils/dom';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Pagination from '../Pagination';
import Loading from '../Loading';
import Group from '../Group';
import * as groupActions from '../../store/group';

function Groups() {
  const dispatch = useDispatch();
  const groups = useSelector(groupActions.getGroups);
  const currentPage = useSelector(groupActions.getGroupPage);
  const currentSize = useSelector(groupActions.getGroupSize);
  const [page, setPage] = useState(currentPage || 1);
  const [size, setSize] = useState(currentSize || 5);
  const [isLoaded, setIsLoaded] = useState(false);

  const groupsNoOffset = useSelector(groupActions.getGroupsNoOffset);
  const [input, setInput] = useState("");
  const [searchGroups, setSearchGroups] = useState(groups);
  const setStyleForGroupName = (shadowColor, textColor) => {
    setPropertyOnDom('.group-name', 'textShadow', `var(--${shadowColor}) 1px 0 10px`);
    setPropertyOnDom('.group-name', 'color', `var(--${textColor})`);
  }

  /**
   * The search is extended to other pages IIF that page is already loaded from DB to React Store
   * Only the results found on current page will be highlighted. The results from other pages will not be highlighted.
   *
   * When the FIRST character is entered:
   *    1. All matches result will be displayed on the current page
   *    2. The results come before the first hightlight are from previous page(s)
   *    3. The results come after the last hightlight are from next page(s)
   *
   * When the NEXT charater is entered:
   *    1. It furthers search from the matched results on the current page
   *    2. Now, the next matched results will all be highlighted since they are now on the "current page"
   */
  const handleSearch = e => {
    const substring = e.target.value;
    const results = groupsNoOffset.filter(group => group.name.includes(substring));
    setInput(substring);
    setStyleForGroupName('white', 'black');
    setSearchGroups(results);
    if (substring.length) setStyleForGroupName('teal', 'white');
  }

  useEffect(() => {
    const loadGroups = async () => {
      await dispatch(groupActions.loadGroups(page, size));
      setIsLoaded(true);

      document.querySelector(".page-prev")?.removeAttribute("disabled");
      document.querySelector(".page-next")?.removeAttribute("disabled");
      document.querySelector(".input-page")?.removeAttribute("disabled");
      document.querySelector(".input-size")?.removeAttribute("disabled");
      document.querySelector(".page-load")?.removeAttribute("disabled");
    }
    loadGroups();
  }, [dispatch, page, size]);

  if (!isLoaded) return <Loading />;
  if (!groups) return;

  return <>
    <div id="pagination">
      <div id="pagination-btns">
        <Pagination
          list={groups}
          page={page}
          size={size}
          setPage={setPage}
          setSize={(setSize)}
          searchMode={input.length}
        />
        {groups.length ? <input spellCheck="false" id="search-box" type="text" value={input} onChange={handleSearch} placeholder='Search box' /> : ''}
      </div>
    </div>
    <li>{(input.length ? searchGroups : groups).map(group => <Group key={group.id} group={group} />)}</li>
  </>
}

export default Groups;
