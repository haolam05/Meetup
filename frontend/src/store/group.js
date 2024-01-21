import { csrfFetch } from './csrf';
import { createSelector } from 'reselect';

const LOAD_GROUPS = '/groups/LOAD_GROUPS';
const LOAD_GROUP_DETAILS = '/groups/LOAD_GROUP_DETAILS';

// POJO action creators
const getAllGroups = groups => ({
  type: LOAD_GROUPS, groups
});

const getAllGroupDetails = group => ({
  type: LOAD_GROUP_DETAILS,
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
}

export const loadGroupDetails = groupId => async dispatch => {
  const response1 = await csrfFetch(`/api/groups/${groupId}`);

  if (response1.ok) {
    const group = await response1.json();
    const image = group.GroupImages.find(image => image.preview);
    group.previewImage = image ? image.url : "Preview Image Not Found";

    const sortAsc = dates => dates.sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());
    const sortDesc = dates => dates.sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime());
    const pastDates = dates => dates.filter(event => new Date(event.startDate).getTime() <= Date.now());
    const futureDates = dates => dates.filter(event => new Date(event.startDate).getTime() > Date.now());

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
      group.upcomingEvents = sortAsc(futureDates(eventDetails));
      group.pastEvents = sortDesc(pastDates(eventDetails));
      console.log(group);
    }

    dispatch(getAllGroupDetails(group));
  }
}

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
    default:
      return state;
  }
}

export default groupReducer;
