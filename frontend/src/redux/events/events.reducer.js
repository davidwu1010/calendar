import EventsActionTypes from './events.types';

const INITIAL_STATE = {
  events: []
};

const eventsReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case EventsActionTypes.SET_EVENTS:
      return {
        ...state,
        events: action.payload
      };
    default:
      return state;
  }
};

export default eventsReducer;