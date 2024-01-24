import { csrfFetch } from './csrf';
import { createSelector } from 'reselect';

const LOAD_EVENTS = '/events/LOAD_EVENTS';
const ADD_EVENT_DETAILS = '/events/ADD_EVENT_DETAILS';
const ADD_EVENT = '/events/ADD_EVENT';
const REMOVE_EVENT = '/events/REMOVE_EVENT';
const REMOVE_EVENT_DETAILS = '/events/REMOVE_EVENT_DETAILS';
const SET_PAGINATION = '/groups/SET_PAGINATION';

// POJO action creators
const getAllEvents = events => ({
  type: LOAD_EVENTS,
  events
});

const getAllEventDetails = event => ({
  type: ADD_EVENT_DETAILS,
  event
});

const addEvent = event => ({
  type: ADD_EVENT,
  event
});

const removeEvent = eventId => ({
  type: REMOVE_EVENT,
  eventId
});

const removeEventDetails = eventId => ({
  type: REMOVE_EVENT_DETAILS,
  eventId
});

const setPagination = (page, size) => ({
  type: SET_PAGINATION,
  page,
  size
});

export const loadEvents = (page, size) => async (dispatch, getState) => {
  const state = getState();
  const eventPage = state.event.page;
  const numEvents = Object.values(state.event.events).length;

  if (eventPage !== page) dispatch(setPagination(page, size));
  if (numEvents > (page - 1) * size || (numEvents % size !== 0)) return;

  const response1 = await csrfFetch(`/api/events?page=${page}&size=${size}`);

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

    dispatch(getAllEvents(eventDetails));
  }
};

export const loadEventDetails = (eventId, forceLoad = false) => async (dispatch, getState) => {
  if (!forceLoad && getState().event.eventDetails[eventId]) return;

  const response1 = await csrfFetch(`/api/events/${eventId}`);

  if (response1.ok) {
    const event = await response1.json();
    const image = event.EventImages.find(image => image.preview);
    if (image) {
      event.previewImage = image.url;
      event.previewImageId = image.id;
    } else {
      event.previewImage = "Preview Image Not Found";
    }

    const response2 = await csrfFetch(`/api/groups/${event.Group.id}`);
    if (response2.ok) {
      const group = await response2.json();
      const image = group.GroupImages.find(image => image.preview);
      event.Group = { ...event.Group, ...group };
      event.Group.previewImage = image ? image.url : "Preview Image Not Found";
    }

    dispatch(getAllEventDetails(event));
    return event;
  }
};

export const createEvent = (groupId, payload) => async (dispatch, getState) => {
  const response1 = await csrfFetch(`/api/groups/${groupId}/events`, {
    method: 'POST',
    body: JSON.stringify({
      ...payload
    })
  });

  const eventData = await response1.json();
  if (!response1.ok) return eventData.errors ? eventData : { errors: eventData };

  if (payload.image) {
    const response2 = await csrfFetch(`/api/events/${eventData.id}/images`, {
      method: 'POST',
      body: JSON.stringify({
        url: payload.image,
        preview: true
      })
    });

    if (response2.ok) {
      const image = await response2.json();
      eventData.previewImage = image.url;
      eventData.previewImageId = image.id;
    }
  }

  const state = getState();
  const numEvents = Object.values(state.event.events).length;
  if (numEvents % state.event.size) dispatch(addEvent(eventData));

  return eventData;
};

export const updateEvent = (eventId, payload) => async dispatch => {
  const response1 = await csrfFetch(`/api/events/${eventId}`, {
    method: 'PUT',
    body: JSON.stringify({
      ...payload
    })
  });

  const eventData = await response1.json();
  if (!response1.ok) return eventData.errors ? eventData : { errors: eventData };

  if (payload.image) {
    let response2, url, method;
    if (payload.imageId) { // update image
      url = `/api/event-images/${payload.imageId}`;
      method = 'PUT';
    } else { // create image
      url = `/api/events/${eventId}/images`;
      method = 'POST';
    }
    response2 = await csrfFetch(url, {
      method,
      body: JSON.stringify({
        url: payload.image,
        preview: true
      })
    });

    if (response2.ok) {
      const image = await response2.json();
      eventData.previewImage = image.url;
      eventData.previewImageId = image.id;
    }
  }

  dispatch(addEvent(eventData));
  dispatch(removeEventDetails(eventData.id)); // remove to force details page reload
  return eventData;
}

export const deleteEvent = eventId => async disptach => {
  const response = await csrfFetch(`/api/events/${eventId}`, {
    method: 'DELETE'
  });

  if (response.ok) {
    const data = await response.json();
    disptach(removeEvent(eventId));
    return data;
  }
};

// Custom selectors
export const getEvents = state => {
  const page = state.event.page;
  const size = state.event.size;
  const offset = (page - 1) * size;
  const events = state.event.events;
  const eventsArr = Object.values(events);
  const selectedEventsArr = eventsArr.slice(offset, offset + size);
  return selectedEventsArr;
};

export const getEventById = eventId => createSelector(
  state => state.event.eventDetails,
  events => events ? events[eventId] : {}
);

export const getEventsByUserId = userId => createSelector(
  state => state.event.events,
  events => Object.values(events).filter(event => event.organizerId === userId)
);

// Reducer
const initialState = { events: {}, eventDetails: {}, page: 0, size: 0 };

function eventReducer(state = initialState, action) {
  switch (action.type) {
    case LOAD_EVENTS:
      return {
        ...state,
        events: {
          ...state.events,
          ...action.events
        }
      };
    case ADD_EVENT_DETAILS:
      return {
        ...state,
        eventDetails: {
          ...state.eventDetails,
          [action.event.id]: action.event
        }
      };
    case ADD_EVENT:
      return {
        ...state,
        events: {
          ...state.events,
          [action.event.id]: action.event
        }
      };
    case REMOVE_EVENT: {
      const newState = { ...state };
      delete newState.events[action.eventId];
      return newState;
    }
    case REMOVE_EVENT_DETAILS: {
      const newState = { ...state };
      delete newState.eventDetails[action.eventId];
      return newState;
    }
    case SET_PAGINATION:
      return {
        ...state,
        page: action.page,
        size: action.size
      }
    default:
      return state;
  }
}

export default eventReducer;
