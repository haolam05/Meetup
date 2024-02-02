import { csrfFetch } from './csrf';
import { createSelector } from 'reselect';
import * as groupActions from './group';

const LOAD_USER_EVENTS = '/events/LOAD_USER_EVENTS';
const LOAD_EVENTS = '/events/LOAD_EVENTS';
const LOAD_EVENT_IMAGES = '/groups/LOAD_EVENT_IMAGES';
const ADD_EVENT_DETAILS = '/events/ADD_EVENT_DETAILS';
const ADD_EVENT = '/events/ADD_EVENT';
const ADD_USER_EVENT = '/events/ADD_USER_EVENT';
const ADD_EVENT_IMAGE = '/groups/ADD_EVENT_IMAGE';
// const REMOVE_EVENT = '/events/REMOVE_EVENT';
// const REMOVE_USER_EVENT = '/groups/REMOVE_USER_EVENT';
const REMOVE_EVENT_DETAILS = '/events/REMOVE_EVENT_DETAILS';
const REMOVE_EVENT_IMAGE = '/groups/REMOVE_EVENT_IMAGE';
const SET_PAGINATION = '/events/SET_PAGINATION';
const RESET = '/events/RESET';
const RESET_USER_EVENTS = '/groups/RESET_USER_EVENTS';
const RESET_EVENTS = '/groups/RESET_EVENTS';

// POJO action creators
const getUserEvents = events => ({
  type: LOAD_USER_EVENTS,
  events
});

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

const addUserEvent = event => ({
  type: ADD_USER_EVENT,
  event
});

const addEventImage = (eventId, image) => ({
  type: ADD_EVENT_IMAGE,
  eventId,
  image
});


// const removeEvent = eventId => ({
//   type: REMOVE_EVENT,
//   eventId
// });

// const removeUserEvent = eventId => ({
//   type: REMOVE_USER_EVENT,
//   eventId
// });

const resetEvents = () => ({
  type: RESET_EVENTS
});

export const removeEventDetails = eventId => ({
  type: REMOVE_EVENT_DETAILS,
  eventId
});

const getEventImages = (eventId, images) => ({
  type: LOAD_EVENT_IMAGES,
  eventId,
  images
});

const removeEventImage = (eventId, imageId) => ({
  type: REMOVE_EVENT_IMAGE,
  eventId,
  imageId
});

const setPagination = (page, size) => ({
  type: SET_PAGINATION,
  page,
  size
});

export const reset = () => ({
  type: RESET
});

export const resetUserEvents = () => ({
  type: RESET_USER_EVENTS
});

export const loadCurrentUserEvents = () => async (dispatch, getState) => {
  if (Object.values(getState().event.userEvents).length) return;

  const response1 = await csrfFetch(`/api/events/current`);
  const events = await response1.json();

  if (!response1.ok) return events.errors ? events : { errors: events };

  const eventDetails = {}
  for (let i = 0; i < events.Events.length; i++) {
    const event = events.Events[i];
    const response2 = await csrfFetch(`/api/events/${event.id}`);

    if (response2.ok) {
      const eventDetail = await response2.json();
      const previewImage = eventDetail.EventImages.find(image => image.preview);
      eventDetail.previewImage = previewImage ? previewImage.url : "Preview Image Not Found";
      eventDetails[eventDetail.id] = { ...event, ...eventDetail };
    }
  }

  dispatch(getUserEvents(eventDetails));
};

export const loadEvents = (page, size) => async (dispatch, getState) => {
  const state = getState();
  const eventPage = state.event.page;
  const eventSize = state.event.size;
  const numEvents = Object.values(state.event.events).length;

  // when the size changes, or when the user jump 1+ pages
  if ((eventSize !== size) || (numEvents + size < page * size)) {
    // events is reset to empty --> if we are on page n, we want (n * size) items
    dispatch(resetEvents());
    dispatch(setPagination(page, size));
    size = page * size;
    page = 1;
  } else {
    if (eventPage !== page) dispatch(setPagination(page, size));
    if ((numEvents > (page - 1) * size) || (numEvents % size !== 0)) return;
  }

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

export const loadEventDetails = eventId => async (dispatch, getState) => {
  // if no id exists, it means eventDetails only have eventImages loaded from loadEventImages
  if (getState().event.eventDetails[eventId]?.id) return;

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

export const createEvent = (groupId, payload, organizerId) => async (dispatch, getState) => {
  const response1 = await csrfFetch(`/api/groups/${groupId}/events`, {
    method: 'POST',
    body: JSON.stringify({
      ...payload
    })
  });

  const eventData = await response1.json();
  if (!response1.ok) return eventData.errors ? eventData : { errors: eventData };

  if (payload.image) {
    const formData = new FormData();
    formData.append("image", payload.image);
    formData.append("preview", true);

    const response2 = await csrfFetch(`/api/events/${eventData.id}/images`, {
      method: 'POST',
      body: formData
    });

    if (response2.ok) {
      const image = await response2.json();
      eventData.previewImage = image.url;
      eventData.previewImageId = image.id;
    }
  }

  const response3 = await csrfFetch(`/api/events/${eventData.id}`);
  if (response3.ok) {
    const event = await response3.json();
    dispatch(addUserEvent({ ...event, previewImage: eventData.previewImage, hostId: organizerId }));
  }

  // group details page -> list events
  // ---> force remove to update accordingly
  dispatch(groupActions.removeGroupDetails(eventData.groupId));

  // only add to store if current numEvents < size, otherwise, force reload
  const state = getState();
  const numEvents = Object.values(state.event.events).length;
  if (numEvents % state.event.size) dispatch(addEvent(eventData));

  return eventData;
};

export const updateEvent = (eventId, payload) => async (dispatch, getState) => {
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
    const formData = new FormData();
    formData.append("image", payload.image);
    formData.append("preview", true);

    if (payload.imageId) { // update image
      url = `/api/event-images/${payload.imageId}`;
      method = 'PUT';
    } else { // create image
      url = `/api/events/${eventId}/images`;
      method = 'POST';
    }
    response2 = await csrfFetch(url, {
      method,
      body: formData
    });

    if (response2.ok) {
      const image = await response2.json();
      eventData.previewImage = image.url;
      eventData.previewImageId = image.id;
    }
  }

  // remove to force details page reload
  dispatch(removeEventDetails(eventData.id));

  // No pagination on /events/current -> just update to keep data integrity
  dispatch(addUserEvent(eventData));

  // only updated if event is already in the store
  if (getState().event.events[eventId]) dispatch(addEvent(eventData));

  // event details page -> list group
  // group details page -> list events
  // ---> force remove to update accordingly
  dispatch(groupActions.removeGroupDetails(eventData.groupId));

  return eventData;
}

export const deleteEvent = (eventId, groupId) => async disptach => {
  const response = await csrfFetch(`/api/events/${eventId}`, {
    method: 'DELETE'
  });

  if (response.ok) {
    const data = await response.json();
    disptach(reset());
    disptach(groupActions.removeGroupDetails(groupId));
    return data;
  }
};

export const loadEventImages = eventId => async (dispatch, getState) => {
  if (getState().event.eventDetails[eventId]) return;

  const response = await csrfFetch(`/api/events/${eventId}/images`);
  if (response.ok) {
    const images = await response.json();
    dispatch(getEventImages(eventId, images.Images));
  }
};

export const loadEventImage = payload => async dispatch => {
  const { image, eventId } = payload;
  const formData = new FormData();
  formData.append("image", image);
  formData.append("preview", true);

  const response = await csrfFetch(`/api/events/${eventId}/images`, {
    method: 'POST',
    body: formData
  });

  if (response.ok) {
    const image = await response.json();
    dispatch(addEventImage(eventId, image));
    return image;
  }
}

export const deleteEventImage = (eventId, imageId) => async (dispatch, getState) => {
  const response = await csrfFetch(`/api/event-images/${imageId}`, {
    method: 'DELETE'
  });

  if (response.ok) {
    const data = await response.json();
    dispatch(removeEventImage(eventId, imageId));
    return data;
  }
};

// Custom selectors
export const getCurrentEventImages = eventId => createSelector(
  state => state.event.eventDetails,
  event => event[eventId]?.EventImages
);

export const getCurrentUserEvents = createSelector(
  state => state.event.userEvents,
  events => Object.values(events)
);

export const getCurrentUserHostedEvents = createSelector(
  state => state.event.userEvents,
  events => Object.values(events).filter(event => event.hostId)
);

export const getCurrentUserAttendedEvents = createSelector(
  state => state.event.userEvents,
  events => Object.values(events).filter(event => !event.hostId)
);

export const getEvents = createSelector(
  [
    state => state.event.size,
    state => (state.event.page - 1) * state.event.size,
    state => state.event.events
  ],
  (size, offset, events) => Object.values(events).slice(offset, offset + size)
);

export const getEventsNoOffset = createSelector(
  state => state.event.events,
  events => Object.values(events)
);

export const getEventById = eventId => createSelector(
  state => state.event.eventDetails,
  events => events ? events[eventId] : {}
);

export const getEventsByUserId = userId => createSelector(
  state => state.event.events,
  events => Object.values(events).filter(event => event.organizerId === userId)
);

export const getEventPage = createSelector(
  state => state.event,
  event => event.page
);

export const getEventSize = createSelector(
  state => state.event,
  event => event.size
);

// Reducer
const initialState = { userEvents: {}, events: {}, eventDetails: {}, page: 0, size: 0 };

function eventReducer(state = initialState, action) {
  switch (action.type) {
    case LOAD_USER_EVENTS:
      return {
        ...state,
        userEvents: {
          ...state.userEvents,
          ...action.events
        }
      }
    case LOAD_EVENTS:
      return {
        ...state,
        events: {
          ...state.events,
          ...action.events
        }
      };
    case LOAD_EVENT_IMAGES:
      return {
        ...state,
        eventDetails: {
          ...state.eventDetails,
          [action.eventId]: {
            ...state.eventDetails[action.eventId],
            EventImages: action.images
          }
        }
      }
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
    case ADD_USER_EVENT:
      return {
        ...state,
        userEvents: {
          ...state.userEvents,
          [action.event.id]: {
            ...state.userEvents[action.event.id],
            ...action.event
          }
        }
      }
    case ADD_EVENT_IMAGE:
      return {
        ...state,
        eventDetails: {
          ...state.eventDetails,
          [action.eventId]: {
            ...state.eventDetails[action.eventId],
            EventImages: [
              ...state.eventDetails[action.eventId].EventImages,
              action.image
            ]
          }
        }
      }
    // case REMOVE_EVENT: {
    //   const newState = { ...state };
    //   delete newState.events[action.eventId];
    //   return newState;
    // }
    // case REMOVE_USER_EVENT: {
    //   const newState = { ...state };
    //   delete newState.userEvents[action.eventId];
    //   return newState;
    // }
    case REMOVE_EVENT_DETAILS: {
      const newState = { ...state };
      delete newState.eventDetails[action.eventId];
      return newState;
    }
    case REMOVE_EVENT_IMAGE: {
      const newState = { ...state };
      const images = newState.eventDetails[action.eventId].EventImages;
      newState.eventDetails[action.eventId].EventImages = images.filter(image => image.id !== action.imageId);
      return newState;
    }
    case SET_PAGINATION:
      return {
        ...state,
        page: action.page,
        size: action.size
      }
    case RESET:
      return { ...initialState };
    case RESET_EVENTS:
      return {
        ...state,
        events: {}
      }
    case RESET_USER_EVENTS:
      return {
        ...state,
        userEvents: {}
      }
    default:
      return state;
  }
}

export default eventReducer;
