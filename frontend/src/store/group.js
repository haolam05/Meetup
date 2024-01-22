import { csrfFetch } from './csrf';
import { createSelector } from 'reselect';
import { sortAscFuture, sortDescPast } from '../utils/dateConverter';

const LOAD_GROUPS = '/groups/LOAD_GROUPS';
const LOAD_GROUP_DETAILS = '/groups/LOAD_GROUP_DETAILS';
const ADD_GROUP = '/groups/ADD_GROUP';

// POJO action creators
const getAllGroups = groups => ({
  type: LOAD_GROUPS, groups
});

const getAllGroupDetails = group => ({
  type: LOAD_GROUP_DETAILS,
  group
});

const addGroup = group => ({
  type: ADD_GROUP,
  group
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
};

export const loadGroupDetails = groupId => async dispatch => {
  const response1 = await csrfFetch(`/api/groups/${groupId}`);

  if (response1.ok) {
    const group = await response1.json();
    const image = group.GroupImages.find(image => image.preview);
    group.previewImage = image ? image.url : "Preview Image Not Found";

    const response2 = await csrfFetch(`/api/groups/${group.id}/events`);
    if (response2.ok) {
      const events = await response2.json();

      const eventDetails = [];
      for (let i = 0; i < events.Events.length; i++) {
        const event = events.Events[i];
        const response3 = await csrfFetch(`/api/events/${event.id}`);

        if (response3.ok) {
          const eventDetail = await response3.json();
          eventDetail.previewImage = event.previewImage;
          eventDetails.push(eventDetail);
        }
      }

      group.numEvents = eventDetails.length;
      group.upcomingEvents = sortAscFuture(eventDetails);
      group.pastEvents = sortDescPast(eventDetails);
    }

    dispatch(getAllGroupDetails(group));
  }
};

export const createGroup = payload => async dispatch => {
  const response1 = await csrfFetch(`/api/groups`, {
    method: 'POST',
    body: JSON.stringify({
      ...payload
    })
  });

  const groupData = await response1.json();
  if (!response1.ok) return groupData.errors ? groupData : { errors: groupData };

  const response2 = await csrfFetch(`/api/groups/${groupData.id}/events`);
  if (response2.ok) {
    const events = await response2.json();
    groupData.numEvents = events.Events.length;
  }

  if (payload.image) {
    const response = await csrfFetch(`/api/groups/${groupData.id}/images`, {
      method: 'POST',
      body: JSON.stringify({
        url: payload.image,
        preview: true
      })
    });

    if (response.ok) {
      const image = await response.json();
      groupData.previewImage = image.url;
    }
  }

  dispatch(addGroup(groupData));
  return groupData;
};

// Custom selectors
export const getGroups = createSelector(
  state => state.group.groups,
  groups => Object.values(groups)
);

export const getGroupById = groupId => createSelector(
  state => state.group.groupDetails,
  groups => groups ? groups[groupId] : {}
);

// Reducer
const initialState = { groups: {}, groupDetails: {} };

function groupReducer(state = initialState, action) {
  switch (action.type) {
    case LOAD_GROUPS:
      return { groups: { ...action.groups.reduce((state, group) => (state[group.id] = group) && state, {}) } };
    case LOAD_GROUP_DETAILS:
      return { ...state, groupDetails: { ...state.groupDetails, [action.group.id]: action.group } };
    case ADD_GROUP:
      return { ...state, groups: { ...state.groups, [action.group.id]: action.group } };
    default:
      return state;
  }
}

export default groupReducer;
