import { csrfFetch } from './csrf';

// -------------- TYPES --------------- \\
const GET_ALL_GROUPS = 'groups/getAllGroups';
const GET_ONE_GROUP = 'groups/getOneGroup';
const REMOVE_SINGLE_GROUP = 'groups/removeSingleGroup';
const CREATE_GROUP = 'groups/createGroup';
const DELETE_GROUP = 'groups/deleteGroup';
const EDIT_GROUP = 'groups/editGroup';

// ---------- ACTION CREATORS ----------- \\
const getAllGroups = (groups) => {
  return {
    type: GET_ALL_GROUPS,
    payload: groups,
  };
};

const getOneGroup = (group) => {
  return {
    type: GET_ONE_GROUP,
    payload: group
  };
};
const removeSingleGroup = () => {
  return {
    type: REMOVE_SINGLE_GROUP
  };
};

const createGroup = (newGroup) => {
  return {
    type: CREATE_GROUP,
    payload: newGroup
  };
};

const deleteGroup = (groupId) => {
  return {
    type: DELETE_GROUP,
    payload: groupId
  };
};

const editGroup = (groupId) => {
  return {
    type: EDIT_GROUP,
    payload: groupId
  };
};

// -------------- THUNKS --------------- \\

//GET /api/groups/current -- line 141 backend/routes/api/groups.js
/// TODO make a thunk for current user groups.

//GET /api/groups -- line 590 backend/routes/api/groups.js
export const grabAllGroups = () => async (dispatch) => {
  const response = await csrfFetch('/api/groups');
  const data = await response.json();
  dispatch(getAllGroups(data));
  return response
};

//GET /api/groups/:groupId/members -- line 373 backend/routes/api/groups.js
//TODO get all members thunk

//GET /api/groups/:groupId -- line 184 backend/routes/api/groups.js
// Details page thunk
export const grabOneGroup = (groupId) => async dispatch => {
  const response = await csrfFetch(`/api/groups/${groupId}`);
  const data = await response.json();
  dispatch(getOneGroup(data));
  return response;
};

export const removeSingleGroupThunk = ()=> async dispatch =>{
  dispatch(removeSingleGroup());
  return
}

//POST /api/groups -- line 631 backend/routes/api/groups.js
export const createGroupThunk = ({ name, about, type, visibility, city, state }) => async (dispatch) => {
  const response = await csrfFetch("/api/groups", {
    method: 'POST',
    body: JSON.stringify({
      name,
      about,
      type,
      private: visibility,
      city,
      state
    }),
  });
  const data = await response.json();
  dispatch(createGroup(data));
  return response;
};

//DELEETE /api/groups/:groupId -- line 250 backend/routes/api/groups.js
export const deleteGroupThunk = (groupId) => async (dispatch) => {
  const response = await csrfFetch(`/api/groups/${groupId}`, {
    method: 'DELETE',
  });

  dispatch(deleteGroup());

  return response;
};

//PUT /api/groups/:groupId -- line 555 backend/routes/api/groups.js
export const editGroupThunk = (newGroup, groupId) => async (dispatch) => {
  const { name, about, type, city, state } = newGroup;
  const response = await csrfFetch(`/api/groups/${groupId}`, {
    method: 'PUT',
    body: JSON.stringify({
      name,
      about,
      type,
      private: newGroup.private,
      city,
      state
    }),
  });

  const data = await response.json();
  dispatch(editGroup(data));
  return response;
};


// -------------- REDUCER STUFF --------------- \\

// --- NORMALIZE DATA SPACE --- \\
const initialState = {groups: {}};

// -- REDUCER -- \\
const groupsReducer = (state = initialState, action) => {
  //shallow copy of current STATE
  const newState ={ ...state };

  switch (action.type) {

    case GET_ALL_GROUPS:
      newState.groups = {}
      action.payload.Groups.forEach(
        group => {
          newState.groups[group.id] = group;
        }
      )

      return newState;

    case GET_ONE_GROUP:
      newState["singleGroup"] = action.payload
      return newState;

    case REMOVE_SINGLE_GROUP:
      newState["singleGroup"] = {}
      return newState

    // case CREATE_GROUP:

    //   return newState

    case DELETE_GROUP:
        delete newState.groups[action.payload.id]
       return newState

    case EDIT_GROUP:
        newState.groups[action.payload.id] = action.payload
       return newState

    default:
      return state;
  }
};

export default groupsReducer;
