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
  const { email, username, firstName, lastName, password, image } = user;
  const formData = new FormData();
  formData.append("email", email);
  formData.append("username", username);
  formData.append("firstName", firstName);
  formData.append("lastName", lastName);
  formData.append("password", password);

  if (image) formData.append("image", image);

  const response = await csrfFetch("/api/users", {
    method: "POST",
    body: formData
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
  const user = await response.json();
  dispatch(createSession(user));
};

export const updateUser = payload => async dispatch => {
  const { email, username, firstName, lastName, password, image } = payload;
  const formData = new FormData();
  formData.append("email", email);
  formData.append("username", username);
  formData.append("firstName", firstName);
  formData.append("lastName", lastName);
  formData.append("password", password);

  if (image) formData.append("image", image);

  const response = await csrfFetch(`/api/users`, {
    method: 'PUT',
    body: formData
  });

  const data = await response.json();
  if (!response.ok) return data.errors ? data : { errors: data };
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
      return { ...initialState };
    default:
      return state;
  }
}

export default sessionReducer;
