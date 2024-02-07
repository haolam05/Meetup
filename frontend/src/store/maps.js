import { createSelector } from 'reselect';
import { csrfFetch } from './csrf';

const LOAD_API_KEY = 'maps/LOAD_API_KEY';

// POJO action creators
const loadApiKey = key => ({
  type: LOAD_API_KEY,
  payload: key,
});

// Thunk action creators
export const getKey = () => async dispatch => {
  const res = await csrfFetch(`/api/maps/key`, {
    method: 'POST',
  });
  const data = await res.json();
  dispatch(loadApiKey(data.googleMapsAPIKey));
};

// Custom selectors
export const getMapKey = createSelector(
  state => state.maps,
  map => map.key
);

// Reducer
const initialState = { key: null };

const mapsReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOAD_API_KEY:
      return { key: action.payload };
    default:
      return state;
  }
};

export default mapsReducer;
