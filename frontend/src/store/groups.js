
import { csrfFetch } from './csrf';
// TYPES
const GROUPS_GET = 'groups/getGroups';
const GROUP_GET = 'groups/getGroup';

// ACTION CREATORS
const getGroups = (groups) => {
  return {
    type: GROUPS_GET,
    payload: groups,
  };
};

const getGroup = (group) => {
  return {
    type: GROUP_GET,
    payload: group
  };
};

// THUNKS
export const grabAllGroups = () => async (dispatch) => {

  const response = await csrfFetch('/api/groups');

  const data = await response.json();
  dispatch(getGroups(data));
  return response
};

export const grabOneGroup = (groupId) => async dispatch => {
  const response = await csrfFetch(`/api/groups/${groupId}`);
  const data = await response.json();
  dispatch(getGroup(data));
  return response;
};

// // Signup
// export const signup = (user) => async (dispatch) => {
//   const { firstName, lastName, username, email, password } = user;
//   const response = await csrfFetch("/api/users", {
//     method: "POST",
//     body: JSON.stringify({
//       firstName,
//       lastName,
//       username,
//       email,
//       password,
//     }),
//   });
//   const data = await response.json();
//   dispatch(setUser(data.user));
//   return response;
// };


// // Logout
// export const logout = () => async (dispatch) => {
//   const response = await csrfFetch('/api/session', {
//     method: 'DELETE',
//   });
//   dispatch(removeUser());
//   return response;
// };



// REDUCER STUFF
const initialState = grabAllGroups();

const groupsReducer = (state = initialState, action) => {
  const newState = Object.assign({}, state);
  switch (action.type) {
    case GROUPS_GET:

      return newState;
    case GROUPS_GET:

      return newState;
    default:
      return state;
  }
};

export default groupsReducer;
