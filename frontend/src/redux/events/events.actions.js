import EventsActionTypes from './events.types';

export const setEvents = events => ({
  type: EventsActionTypes.SET_EVENTS,
  payload: events
});