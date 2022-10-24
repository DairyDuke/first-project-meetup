import { csrfFetch } from './csrf';

// -------------- TYPES --------------- \\
const GET_ALL_EVENTS = 'events/getAllEvents';
const GET_ONE_EVENT = 'events/getOneEvent';
const CREATE_EVENT = 'events/createEvent'
const DELETE_EVENT = 'events/deleteEvent'
const EDIT_EVENT = 'events/editEvent'

// ---------- ACTION CREATORS ----------- \\
const getAllEvents = (events) => {
  return {
    type: GET_ALL_EVENTS,
    payload: events,
  };
};

const getOneEvent = (data) => {
  return {
    type: GET_ONE_EVENT,
    payload: data
  };
};

const createEvent = (newEvent) => {
  return {
    type: CREATE_EVENT,
    payload: newEvent
  };
};

const deleteEvent = (eventId) => {
  return {
    type: DELETE_EVENT,
    payload: eventId
  };
};

const editEvent = (eventId) => {
  return {
    type: EDIT_EVENT,
    payload: eventId
  };
};

// -------------- THUNKS --------------- \\

//GET /api/groups/current -- line 141 backend/routes/api/groups.js
/// TODO make a thunk for current user groups.

//GET /api/events -- line 67 backend/routes/api/events.js
export const grabAllEvents = () => async (dispatch) => {
  const response = await csrfFetch('/api/events');
  const data = await response.json();
  dispatch(getAllEvents(data));
  return response
};

//GET /api/events/:eventId/attendees -- line 195 backend/routes/api/events.js
//TODO get all attendees of an event thunk

//GET /api/events/:eventId -- line 422 backend/routes/api/events.js
// Details page thunk
export const grabOneEvent = (eventId) => async dispatch => {
  const response = await csrfFetch(`/api/events/${eventId}`);
  const data = await response.json();
  dispatch(getOneEvent(data));
  return response;
};

//POST /api/groups/:groupId/events -- line 631 backend/routes/api/groups.js
export const createEventThunk = ({ name, description, type, capacity, price, startDate, endDate }, groupId) => async (dispatch) => {
  // const { venueId, name, type, capacity, price, description, startDate, endDate } = newEvent;
  const response = await csrfFetch(`/api/groups/${groupId}/events`, {
    method: "POST",
    body: JSON.stringify({
      venueId: null,
      name,
      description,
      type,
      capacity,
      price,
      startDate,
      endDate
    }),
  });
  const data = await response.json();
  dispatch(createEvent(data));
  return response;
};

//DELEETE /api/events/:eventId -- line 301 backend/routes/api/events.js
export const deleteEventThunk = (eventId) => async (dispatch) => {
  const response = await csrfFetch(`/api/events/${eventId}`, {
    method: 'DELETE',
  });

  dispatch(deleteEvent());

  return response;
};

//PUT /api/events/:eventId -- line 257 backend/routes/api/events.js
export const editEventThunk = ({ name, description, type, capacity, price, startDate, endDate }, eventId) => async (dispatch) => {

  const response = await csrfFetch(`/api/events/${eventId}`, {
    method: 'PUT',
    body: JSON.stringify({
     venueId: null,
     name,
     type,
     capacity,
     price,
     description,
     startDate,
     endDate
    }),
  });

  const data = await response.json();
  dispatch(editEvent(data));
  return response;
};


//POST /api/events/:eventId/images -- line 279 backend/routes/api/events.js
// TODO add events eventid, url, peview


// -------------- REDUCER STUFF --------------- \\

// --- NORMALIZE DATA SPACE --- \\
const initialState = {events: {}};

// -- REDUCER -- \\
const eventsReducer = (state = initialState, action) => {
  //shallow copy of current STATE
  const newState ={ ...state };

  switch (action.type) {

    case GET_ALL_EVENTS:
      newState.events = {}
      action.payload.Events.forEach(
        event => {
          newState.events[event.id] = event;
        }
      )

      return newState;

    case GET_ONE_EVENT:
      newState["singleEvent"] = action.payload
      return newState;


    // case CREATE_GROUP:

    //   return newState

    case DELETE_EVENT:
        delete newState.events[action.payload.id]
       return newState

    case EDIT_EVENT:
        newState.events[action.payload.id] = action.payload
       return newState

    default:
      return state;
  }
};

export default eventsReducer;
