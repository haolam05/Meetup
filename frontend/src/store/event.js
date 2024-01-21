import { csrfFetch } from './csrf';
import { createSelector } from 'reselect';

const ADD_EVENT_DETAILS = '/events/ADD_EVENT_DETAILS';

// POJO action creators
const addEventDetails = event => ({
  type: ADD_EVENT_DETAILS,
  event
});

export const loadEventDetails = eventId => async dispatch => {
  const response = await csrfFetch(`/api/events/${eventId}`);

  if (response.ok) {
    const event = await response.json();
    dispatch(addEventDetails(event));
  }
};

// Custom selectors
export const getEventById = eventId => createSelector(
  state => state.event.eventDetails,
  events => events ? events[eventId] : {}
);

// Reducer
const initialState = { eventDetails: {} };

function eventReducer(state = initialState, action) {
  switch (action.type) {
    case ADD_EVENT_DETAILS:
      return { ...state, eventDetails: { ...state.eventDetails, [action.event.id]: action.event } };
    default:
      return state;
  }
}

export default eventReducer;
