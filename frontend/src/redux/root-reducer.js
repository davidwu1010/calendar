import { combineReducers } from 'redux';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import userReducer from './user/user.reducer';
import eventsReducer from './events/events.reducer';

const persistConfig = {
  key: 'calendar',
  storage,
  whitelist: []
}

const rootReducer = combineReducers({
  user: userReducer,
  events: eventsReducer,
});

export default persistReducer(persistConfig, rootReducer);
