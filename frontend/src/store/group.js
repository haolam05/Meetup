import { csrfFetch } from './csrf';

const LOAD_GROUPS = '/groups/LOAD_GROUPS';

// POJO action creators
const getAllGroups = groups => ({ type: LOAD_GROUPS, groups });

// Thunk action creators
export const loadGroups = () => async dispatch => {
  const response = await csrfFetch("/api/groups");

  if (response.ok) {
    const groups = await response.json();
    dispatch(getAllGroups(groups.Groups));
  }
}

// Custom selectors
export const getGroups = state => state.group.groups;

// Reducer
const initialState = { groups: null };

function groupReducer(state = initialState, action) {
  switch (action.type) {
    case LOAD_GROUPS:
      return { groups: { ...action.groups.reduce((state, group) => (state[group.id] = group) && state, {}) } };
    default:
      return state;
  }
}

export default groupReducer;
