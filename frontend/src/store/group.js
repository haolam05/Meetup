import { csrfFetch } from './csrf';
import { createSelector } from 'reselect';
import { sortAscFuture, sortDescPast } from '../utils/dateConverter';
import * as eventActions from './event';

const LOAD_USER_GROUPS = '/groups/LOAD_USER_GROUPS';
const LOAD_GROUPS = '/groups/LOAD_GROUPS';
const LOAD_GROUP_IMAGES = '/groups/LOAD_GROUP_IMAGES';
const LOAD_GROUP_MEMBERS = '/groups/LOAD_GROUP_MEMBERS';
const ADD_GROUP_DETAILS = '/groups/ADD_GROUP_DETAILS';
const ADD_GROUP = '/groups/ADD_GROUP';
const ADD_USER_GROUP = '/groups/ADD_USER_GROUP';
const ADD_GROUP_IMAGE = '/groups/ADD_GROUP_IMAGE';
const UPDATE_MEMBER = '/groups/UPDATE_MEMBER';
const REMOVE_GROUP_DETAILS = '/groups/REMOVE_GROUP_DETAILS';
const REMOVE_GROUP_IMAGE = '/groups/REMOVE_GROUP_IMAGE';
const REMOVE_MEMBER = '/groups/REMOVE_MEMBER';
const SET_PAGINATION = '/groups/SET_PAGINATION';
const RESET = '/groups/RESET';
const RESET_USER_GROUPS = '/groups/RESET_USER_GROUPS';
const RESET_GROUPS = '/groups/RESET_GROUPS';

// POJO action creators
const getUserGroups = groups => ({
  type: LOAD_USER_GROUPS,
  groups
});

const getAllGroups = groups => ({
  type: LOAD_GROUPS,
  groups
});

const getAllGroupMembers = (groupId, members) => ({
  type: LOAD_GROUP_MEMBERS,
  groupId,
  members
});

const getAllGroupDetails = group => ({
  type: ADD_GROUP_DETAILS,
  group
});

const addGroup = group => ({
  type: ADD_GROUP,
  group
});

const addUserGroup = group => ({
  type: ADD_USER_GROUP,
  group
});

const addGroupImage = (groupId, image) => ({
  type: ADD_GROUP_IMAGE,
  groupId,
  image
});

const editMember = (groupId, memberId, status) => ({
  type: UPDATE_MEMBER,
  groupId,
  memberId,
  status
});

const removeMember = (groupId, memberId) => ({
  type: REMOVE_MEMBER,
  groupId,
  memberId
});

export const removeGroupDetails = groupId => ({
  type: REMOVE_GROUP_DETAILS,
  groupId
});

const getGroupImages = (groupId, images) => ({
  type: LOAD_GROUP_IMAGES,
  groupId,
  images
});

const removeGroupImage = (groupId, imageId) => ({
  type: REMOVE_GROUP_IMAGE,
  groupId,
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

export const resetUserGroups = () => ({
  type: RESET_USER_GROUPS
});

const resetGroups = () => ({
  type: RESET_GROUPS
});

// Thunk action creators
export const loadCurrentUserGroups = () => async (dispatch, getState) => {
  if (Object.values(getState().group.userGroups).length) return;

  const response = await csrfFetch(`/api/groups/current`);
  const groups = await response.json();

  if (!response.ok) return groups.errors ? groups : { errors: groups };

  for (let i = 0; i < groups.Groups.length; i++) {
    const group = groups.Groups[i];

    const response = await csrfFetch(`/api/groups/${group.id}/events`);
    if (response.ok) {
      const events = await response.json();
      group.numEvents = events.Events.length;
    }
  }

  dispatch(getUserGroups(groups.Groups));
};

export const loadGroups = (page, size) => async (dispatch, getState) => {
  const state = getState();
  const groupPage = state.group.page;
  const groupSize = state.group.size;
  const numGroups = Object.values(state.group.groups).length;

  // when the size changes, or when the user jump 1+ pages
  if ((groupSize !== size) || (numGroups + size < page * size)) {
    // groups is reset to empty --> if we are on page n, we want (n * size) items
    dispatch(resetGroups());
    dispatch(setPagination(page, size));
    size = page * size;
    page = 1;
  } else {
    if (groupPage !== page) dispatch(setPagination(page, size));
    if ((numGroups > (page - 1) * size) || (numGroups % size !== 0)) return;
  }

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
  // if no id exists, it means groupDetails only have groupImages loaded from loadGroupImages
  if (getState().group.groupDetails[groupId]?.id) return;

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

export const createGroup = payload => async (dispatch, getState) => {
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
    const formData = new FormData();
    formData.append("image", payload.image);
    formData.append("preview", true);

    const response3 = await csrfFetch(`/api/groups/${groupData.id}/images`, {
      method: 'POST',
      body: formData
    });

    if (response3.ok) {
      const image = await response3.json();
      groupData.previewImage = image.url;
      groupData.previewImageId = image.id;
    }
  }

  dispatch(addUserGroup(groupData));

  // only add to store if current numGroups < size, otherwise, force reload
  const state = getState();
  const numGroups = Object.values(state.group.groups).length;
  if (numGroups % state.group.size) dispatch(addGroup(groupData));

  return groupData;
};

export const updateGroup = (payload, groupId) => async (dispatch, getState) => {
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
    const formData = new FormData();
    formData.append("image", payload.image);
    formData.append("preview", true);

    if (payload.imageId) { // update image
      url = `/api/group-images/${payload.imageId}`;
      method = 'PUT';
    } else { // create image
      url = `/api/groups/${groupId}/images`;
      method = 'POST';
    }
    response3 = await csrfFetch(url, {
      method,
      body: formData
    });

    if (response3.ok) {
      const image = await response3.json();
      groupData.previewImage = image.url;
      groupData.previewImageId = image.id;
    }
  }

  // remove to force details page reload
  dispatch(removeGroupDetails(groupData.id));

  // No pagination on /groups/current -> just update to keep data integrity
  dispatch(addUserGroup(groupData));

  // only updated if group is already in the store
  const state = getState();
  if (state.group.groups[groupId]) dispatch(addGroup(groupData));

  // group details page -> list events
  // event details page -> list group
  // ---> force remove to update accordingly
  const eventDetails = Object.values(state.event.eventDetails);
  for (let i = 0; i < eventDetails.length; i++) {
    if (eventDetails[i].groupId === groupData.id) {
      dispatch(eventActions.removeEventDetails(eventDetails[i].id));
    }
  }

  return groupData;
};

export const deleteGroup = groupId => async dispatch => {
  const response = await csrfFetch(`/api/groups/${groupId}`, {
    method: 'DELETE'
  });

  if (response.ok) {
    const data = await response.json();
    dispatch(reset());
    dispatch(eventActions.reset());
    return data;
  }
};

export const loadGroupImages = groupId => async (dispatch, getState) => {
  if (getState().group.groupDetails[groupId]) return;

  const response = await csrfFetch(`/api/groups/${groupId}/images`);
  const images = await response.json();

  if (!response.ok) return images.errors ? images : { errors: images };
  dispatch(getGroupImages(groupId, images.Images));
};

export const loadGroupImage = payload => async dispatch => {
  const { image, groupId } = payload;
  const formData = new FormData();
  formData.append("image", image);
  formData.append("preview", true);

  const response = await csrfFetch(`/api/groups/${groupId}/images`, {
    method: 'POST',
    body: formData
  });

  if (response.ok) {
    const image = await response.json();
    dispatch(addGroupImage(groupId, image));
    return image;
  }
}

export const deleteGroupImage = (groupId, imageId) => async dispatch => {
  const response = await csrfFetch(`/api/group-images/${imageId}`, {
    method: 'DELETE'
  });

  if (response.ok) {
    const data = await response.json();
    dispatch(removeGroupImage(groupId, imageId));
    return data;
  }
};

export const loadGroupMembers = groupId => async (dispatch, getState) => {
  if (getState().group.groupMembers[groupId]) return;
  const response = await csrfFetch(`/api/groups/${groupId}/members`);

  if (response.ok) {
    const members = await response.json();
    dispatch(getAllGroupMembers(groupId, members.Members));
  }
};

export const deleteMember = (groupId, memberId) => async dispatch => {
  const response = await csrfFetch(`/api/groups/${groupId}/membership/${memberId}`, {
    method: 'DELETE'
  });

  if (response.ok) {
    const data = await response.json();
    dispatch(removeMember(groupId, memberId));
    return data;
  }
};

export const updateMember = (groupId, payload) => async dispatch => {
  const response = await csrfFetch(`/api/groups/${groupId}/membership`, {
    method: 'PUT',
    body: JSON.stringify({
      ...payload
    })
  });

  const membership = await response.json();
  if (!response.ok) return membership.errors ? membership : { errors: membership };
  dispatch(editMember(groupId, membership.memberId, membership.status));
};

// Custom selectors
export const getGroupMembers = groupId => createSelector(
  state => state.group.groupMembers,
  members => members[groupId] ? Object.values(members[groupId]) : []
);

export const getCurrentGroupImages = groupId => createSelector(
  state => state.group.groupDetails,
  group => group[groupId]?.GroupImages
);

export const getCurrentUserGroups = createSelector(
  state => state.group.userGroups,
  groups => Object.values(groups)
);

export const getCurrentUserOwnedGroups = userId => createSelector(
  state => state.group.userGroups,
  groups => Object.values(groups).filter(group => group.organizerId === userId)
);

export const getCurrentUserJoinedGroups = userId => createSelector(
  state => state.group.userGroups,
  groups => Object.values(groups).filter(group => group.organizerId !== userId)
);

export const getGroups = createSelector(
  [
    state => state.group.size,
    state => (state.group.page - 1) * state.group.size,
    state => state.group.groups
  ],
  (size, offset, groups) => Object.values(groups).slice(offset, offset + size)
);

export const getGroupsNoOffset = createSelector(
  state => state.group.groups,
  groups => Object.values(groups)
);

export const getGroupById = groupId => createSelector(
  state => state.group.groupDetails,
  groups => groups ? groups[groupId] : {}
);

export const getGroupPage = createSelector(
  state => state.group,
  group => group.page
);

export const getGroupSize = createSelector(
  state => state.group,
  group => group.size
);

// Reducer
const initialState = { userGroups: {}, groups: {}, groupDetails: {}, groupMembers: {}, page: 0, size: 0 };

function groupReducer(state = initialState, action) {
  switch (action.type) {
    case LOAD_USER_GROUPS:
      return {
        ...state,
        userGroups: {
          ...state.userGroups,
          ...action.groups.reduce((state, group) => (state[group.id] = group) && state, {})
        }
      }
    case LOAD_GROUPS:
      return {
        ...state,
        groups: {
          ...state.groups,
          ...action.groups.reduce((state, group) => (state[group.id] = group) && state, {})
        }
      };
    case LOAD_GROUP_MEMBERS:
      return {
        ...state,
        groupMembers: {
          ...state.groupMembers,
          [action.groupId]: {
            ...action.members.reduce((state, member) => (state[member.id] = member) && state, {})
          }
        }
      }
    case LOAD_GROUP_IMAGES:
      return {
        ...state,
        groupDetails: {
          ...state.groupDetails,
          [action.groupId]: {
            ...state.groupDetails[action.groupId],
            GroupImages: action.images
          }
        }
      }
    case ADD_GROUP_DETAILS:
      return {
        ...state,
        groupDetails: {
          ...state.groupDetails,
          [action.group.id]: action.group
        }
      };
    case ADD_USER_GROUP:
      return {
        ...state,
        userGroups: {
          ...state.userGroups,
          [action.group.id]: action.group
        }
      }
    case ADD_GROUP:
      return {
        ...state,
        groups: {
          ...state.groups,
          [action.group.id]: action.group
        }
      };
    case ADD_GROUP_IMAGE:
      return {
        ...state,
        groupDetails: {
          ...state.groupDetails,
          [action.groupId]: {
            ...state.groupDetails[action.groupId],
            GroupImages: [
              ...state.groupDetails[action.groupId].GroupImages,
              action.image
            ]
          }
        }
      }
    case UPDATE_MEMBER:
      return {
        ...state,
        groupMembers: {
          ...state.groupMembers,
          [action.groupId]: {
            ...state.groupMembers[action.groupId],
            [action.memberId]: {
              ...state.groupMembers[action.groupId][action.memberId],
              Membership: {
                status: action.status
              }
            }
          }
        }
      }
    case REMOVE_GROUP_DETAILS: {
      const newState = { ...state };
      delete newState.groupDetails[action.groupId];
      return newState;
    }
    case REMOVE_GROUP_IMAGE: {
      const newState = { ...state };
      const images = newState.groupDetails[action.groupId].GroupImages;
      newState.groupDetails[action.groupId].GroupImages = images.filter(image => image.id !== action.imageId);
      return newState;
    }
    case REMOVE_MEMBER: {
      const newState = { ...state };
      delete newState.groupMembers[action.groupId][action.memberId];
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
    case RESET_GROUPS:
      return {
        ...state,
        groups: {}
      }
    case RESET_USER_GROUPS:
      return {
        ...state,
        userGroups: {}
      }
    default:
      return state;
  }
}

export default groupReducer;
