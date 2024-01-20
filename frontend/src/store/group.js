import { csrfFetch } from './csrf';
import { createSelector } from 'reselect';

const LOAD_GROUPS = '/groups/LOAD_GROUPS';

// POJO action creators
const getAllGroups = groups => ({
  type: LOAD_GROUPS, groups
});

// Thunk action creators
export const loadGroups = () => async dispatch => {
  const response = await csrfFetch(`/api/groups`);

  if (response.ok) {
    const groups = await response.json();

    for (let i = 0; i < groups.Groups.length; i++) {
      const group = groups.Groups[i];
      const response = await csrfFetch(`/api/groups/${group.id}/events`);
      if (response.ok) {
        const events = await response.json();
        group.numEvents = events.Events.length;
      }
    }

    dispatch(getAllGroups(groups.Groups));
  }
}

// Custom selectors
export const getGroups = createSelector(
  state => state.group.groups,
  groups => Object.values(groups)
);

// Reducer
const initialState = { groups: {} };

function groupReducer(state = initialState, action) {
  switch (action.type) {
    case LOAD_GROUPS:
      return { groups: { ...action.groups.reduce((state, group) => (state[group.id] = group) && state, {}) } };
    default:
      return state;
  }
}

export default groupReducer;
