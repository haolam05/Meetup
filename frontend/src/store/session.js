import { csrfFetch } from './csrf';

const CREATE_SESSION = '/session/CREATE_SESSION';
const DELETE_SESSION = '/session/DELETE_SESSION';

// POJO action creators
const createSession = user => ({ type: CREATE_SESSION, user });
const deleteSession = () => ({ type: DELETE_SESSION, id });

// Thunk action creators
export const login = credentials => async dispatch => {
  const response = await csrfFetch(`/api/session`, {
    method: 'POST',
    body: JSON.stringify({
      ...credentials
    })
  });

  if (response.ok) {
    const data = await response.json();
    dispatch(createSession(data));
    return response;
  }
};

// Reducer
const initialState = { user: null };

function sessionReducer(state = initialState, action) {
  switch (action.type) {
    case CREATE_SESSION:
      return { ...action.user };
    case DELETE_SESSION:
      return initialState;
    default:
      return state;
  }
}

export default sessionReducer;
