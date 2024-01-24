import { csrfFetch } from './csrf';
import { createSelector } from 'reselect';
import { sortAscFuture, sortDescPast } from '../utils/dateConverter';

const LOAD_GROUPS = '/groups/LOAD_GROUPS';
const ADD_GROUP_DETAILS = '/groups/ADD_GROUP_DETAILS';
const ADD_GROUP = '/groups/ADD_GROUP';
const REMOVE_GROUP = '/groups/REMOVE_GROUP';
const REMOVE_GROUP_DETAILS = '/groups/REMOVE_GROUP_DETAILS';
const SET_PAGINATION = '/groups/SET_PAGINATION';

// POJO action creators
const getAllGroups = groups => ({
  type: LOAD_GROUPS,
  groups
});

const getAllGroupDetails = group => ({
  type: ADD_GROUP_DETAILS,
  group
});

const addGroup = group => ({
  type: ADD_GROUP,
  group
});

const removeGroup = groupId => ({
  type: REMOVE_GROUP,
  groupId
});

const removeGroupDetails = groupId => ({
  type: REMOVE_GROUP_DETAILS,
  groupId
});

const setPagination = (page, size) => ({
  type: SET_PAGINATION,
  page,
  size
});

// Thunk action creators
export const loadGroups = (page, size) => async (dispatch, getState) => {
  const state = getState();
  const groupPage = state.group.page;
  const numGroups = Object.values(state.group.groups).length;
  if (groupPage !== page) dispatch(setPagination(page, size));
  if (numGroups > (page - 1) * size || (numGroups % size !== 0)) return;

  const response = await csrfFetch(`/api/groups?page=${page}&size=${size}`);

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

export const loadGroupDetails = groupId => async (dispatch, getState) => {
  if (getState().group.groupDetails[groupId]) return;

  const response1 = await csrfFetch(`/api/groups/${groupId}`);

  if (response1.ok) {
    const group = await response1.json();
    const image = group.GroupImages.find(image => image.preview);
    if (image) {
      group.previewImage = image.url;
      group.previewImageId = image.id;
    } else {
      group.previewImage = "Preview Image Not Found";
    }

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
    const response3 = await csrfFetch(`/api/groups/${groupData.id}/images`, {
      method: 'POST',
      body: JSON.stringify({
        url: payload.image,
        preview: true
      })
    });

    if (response3.ok) {
      const image = await response3.json();
      groupData.previewImage = image.url;
      groupData.previewImageId = image.id;
    }
  }

  dispatch(addGroup(groupData));
  return groupData;
};

export const updateGroup = (payload, groupId) => async dispatch => {
  const response1 = await csrfFetch(`/api/groups/${groupId}`, {
    method: 'PUT',
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
    let response3, url, method;
    if (payload.imageId) { // update image
      url = `/api/group-images/${payload.imageId}`;
      method = 'PUT';
    } else { // create image
      url = `/api/groups/${groupId}/images`;
      method = 'POST';
    }
    response3 = await csrfFetch(url, {
      method,
      body: JSON.stringify({
        url: payload.image,
        preview: true
      })
    });

    if (response3.ok) {
      const image = await response3.json();
      groupData.previewImage = image.url;
      groupData.previewImageId = image.id;
    }
  }

  dispatch(addGroup(groupData));
  dispatch(removeGroupDetails(groupData.id)); // remove to force details page reload
  return groupData;
};

export const deleteGroup = groupId => async dispatch => {
  const response = await csrfFetch(`/api/groups/${groupId}`, {
    method: 'DELETE'
  });

  if (response.ok) {
    const data = await response.json();
    dispatch(removeGroup(groupId));
    return data;
  }
};

export const loadCurrentUserGroups = () => async dispatch => {
  const response = await csrfFetch(`/api/groups/current`);

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

// Custom selectors
export const getGroups = state => {
  const page = state.group.page;
  const size = state.group.size;
  const offset = (page - 1) * size;
  const groups = state.group.groups;
  const groupsArr = Object.values(groups);
  const selectedGroupsArr = groupsArr.slice(offset, offset + size)
  return selectedGroupsArr;
};

export const getGroupById = groupId => createSelector(
  state => state.group.groupDetails,
  groups => groups ? groups[groupId] : {}
);

// Reducer
const initialState = { groups: {}, groupDetails: {}, page: 0, size: 0 };

function groupReducer(state = initialState, action) {
  switch (action.type) {
    case LOAD_GROUPS:
      return {
        ...state,
        groups: {
          ...state.groups,
          ...action.groups.reduce((state, group) => (state[group.id] = group) && state, {})
        }
      };
    case ADD_GROUP_DETAILS:
      return {
        ...state,
        groupDetails: { ...state.groupDetails, [action.group.id]: action.group }
      };
    case ADD_GROUP:
      return {
        ...state,
        groups: { ...state.groups, [action.group.id]: action.group }
      };
    case REMOVE_GROUP: {
      const newState = { ...state };
      delete newState.groups[action.groupId];
      return newState;
    }
    case REMOVE_GROUP_DETAILS: {
      const newState = { ...state };
      delete newState.groupDetails[action.groupId];
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

export default groupReducer;
