import { csrfFetch } from './csrf';

const CREATE_SESSION = '/session/CREATE_SESSION';
const DELETE_SESSION = '/session/DELETE_SESSION';

// POJO action creators
const createSession = payload => ({
  type: CREATE_SESSION,
  payload
});

const deleteSession = () => ({
  type: DELETE_SESSION
});

// Thunk action creators
export const login = credential => async dispatch => {
  const response = await csrfFetch(`/api/session`, {
    method: 'POST',
    body: JSON.stringify({
      ...credential
    })
  });

  const data = await response.json();
  if (!response.ok) return data.errors ? data : { errors: data };
  dispatch(createSession(data));
};

export const signup = user => async dispatch => {
  const response = await csrfFetch("/api/users", {
    method: "POST",
    body: JSON.stringify({
      ...user
    })
  });

  const data = await response.json();
  if (!response.ok) return data.errors ? data : { errors: data };
  dispatch(createSession(data));
};

export const logout = () => async dispatch => {
  await csrfFetch('/api/session', {
    method: 'DELETE'
  });
  dispatch(deleteSession());
};

export const restoreSession = () => async (dispatch, getState) => {
  if (getState().session.user !== null) return;

  const response = await csrfFetch("/api/session");
  const data = await response.json();
  dispatch(createSession(data));
};

// Custom selectors
export const sessionUser = state => state.session.user;

// Reducer
const initialState = { user: null };

function sessionReducer(state = initialState, action) {
  switch (action.type) {
    case CREATE_SESSION:
      return { ...action.payload };
    case DELETE_SESSION:
      return { user: null };
    default:
      return state;
  }
}

export default sessionReducer;
