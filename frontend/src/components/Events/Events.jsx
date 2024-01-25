import { setPropertyOnDom } from '../../utils/dom';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { sortAscFuture, sortDescPast } from '../../utils/dateConverter';
import Pagination from '../Pagination';
import Loading from '../Loading';
import Event from '../Event';
import * as eventActions from '../../store/event';

function Events() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [page, setPage] = useState(1);
  const [isLoaded, setIsLoaded] = useState(false);
  let events = useSelector(eventActions.getEvents);
  const upcomingEvents = sortAscFuture(Object.values(events));
  const pastEvents = sortDescPast(Object.values(events));
  events = [...upcomingEvents, ...pastEvents];

  const eventsNoOffset = useSelector(eventActions.getEventsNoOffset);
  const [input, setInput] = useState("");
  const [searchEvents, setSearchEvents] = useState(events);
  const setStyleForEventName = (shadowColor, textColor) => {
    setPropertyOnDom('#event-title', 'textShadow', `var(--${shadowColor}) 1px 0 10px`);
    setPropertyOnDom('#event-title', 'color', `var(--${textColor})`);
  }

  // The search is extended to other pages IIF that page is already loaded from DB to React Store
  // Only the results found on current page will be highlighted. The results from other pages will not be highlighted.
  // The results come before the first hightlight are from previous page(s)
  // The results come after the last hightlight are from next page(s)
  const handleSearch = e => {
    const substring = e.target.value;
    const results = eventsNoOffset.filter(event => event.name.includes(substring));
    setInput(substring);
    setStyleForEventName('white', 'black');
    setSearchEvents(results);
    if (substring.length) setStyleForEventName('teal', 'white');
  }

  useEffect(() => {
    const loadEvents = async () => {
      await dispatch(eventActions.loadEvents(page, 5));
      setIsLoaded(true);

      document.querySelector(".page-prev")?.removeAttribute("disabled");
      document.querySelector(".page-next")?.removeAttribute("disabled");
    }
    loadEvents();
  }, [dispatch, page]);

  if (!isLoaded) return <Loading />;

  return <>
    <div id="pagination">
      <div id="pagination-btns">
        <Pagination
          list={events}
          page={page}
          setPage={setPage}
          searchMode={input.length}
        />
        {events.length ? <input spellCheck="false" id="search-box" type="text" value={input} onChange={handleSearch} placeholder='Search box' /> : ''}
      </div>
    </div>
    <li>
      {(input.length ? searchEvents : events).map(event =>
        <div key={event.id} onClick={() => navigate(`/events/${event.id}`, { replace: true })}>
          <Event key={event.id} event={event} />
        </div>
      )}
    </li>
    <li>
    </li>
  </>;
}

export default Events;
