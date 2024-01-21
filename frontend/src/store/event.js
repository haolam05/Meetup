import { csrfFetch } from './csrf';
import { createSelector } from 'reselect';
import { sortAscFuture, sortDescPast } from '../utils/dateConverter';

const LOAD_EVENTS = '/events/LOAD_EVENTS';
const LOAD_EVENT_DETAILS = '/events/LOAD_EVENT_DETAILS';

// POJO action creators
const getAllEvents = (events, upcomingEvents, pastEvents) => ({
  type: LOAD_EVENTS,
  events,
  upcomingEvents,
  pastEvents
});

const getAllEventDetails = event => ({
  type: LOAD_EVENT_DETAILS,
  event
});

export const loadEvents = () => async dispatch => {
  const response1 = await csrfFetch(`/api/events`);

  if (response1.ok) {
    const events = await response1.json();

    const eventDetails = {}
    for (let i = 0; i < events.Events.length; i++) {
      const event = events.Events[i];
      const response2 = await csrfFetch(`/api/events/${event.id}`);

      if (response2.ok) {
        const eventDetail = await response2.json();
        eventDetail.previewImage = event.previewImage;
        eventDetails[eventDetail.id] = eventDetail;
      }
    }

    const upcomingEvents = sortAscFuture(Object.values(eventDetails));
    const pastEvents = sortDescPast(Object.values(eventDetails));
    dispatch(getAllEvents(eventDetails, upcomingEvents, pastEvents));
  }
};

export const loadEventDetails = eventId => async dispatch => {
  const response1 = await csrfFetch(`/api/events/${eventId}`);

  if (response1.ok) {
    const event = await response1.json();
    const image = event.EventImages.find(image => image.preview);
    event.previewImage = image ? image.url : "Preview Image Not Found";

    const response2 = await csrfFetch(`/api/groups/${event.Group.id}`);
    if (response2.ok) {
      const group = await response2.json();
      const image = group.GroupImages.find(image => image.preview);
      event.Group = { ...event.Group, ...group };
      event.Group.previewImage = image ? image.url : "Preview Image Not Found";
    }

    dispatch(getAllEventDetails(event));
  }
};

// Custom selectors
export const getEvents = createSelector(
  state => state.event,
  event => ({ upcomingEvents: event.upcomingEvents, pastEvents: event.pastEvents })
);

export const getEventById = eventId => createSelector(
  state => state.event.eventDetails,
  events => events ? events[eventId] : {}
);

// Reducer
const initialState = { events: {}, eventDetails: {} };

function eventReducer(state = initialState, action) {
  switch (action.type) {
    case LOAD_EVENTS:
      return { events: { ...action.events }, upcomingEvents: action.upcomingEvents, pastEvents: action.pastEvents };
    case LOAD_EVENT_DETAILS:
      return { ...state, eventDetails: { ...state.eventDetails, [action.event.id]: action.event } };
    default:
      return state;
  }
}

export default eventReducer;
