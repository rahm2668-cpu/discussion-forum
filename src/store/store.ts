import {configureStore} from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import threadsReducer from './slices/threadsSlice';
import usersReducer from './slices/usersSlice';
import leaderboardsReducer from './slices/leaderboardsSlice';
import uiReducer from './slices/uiSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    threads: threadsReducer,
    users: usersReducer,
    leaderboards: leaderboardsReducer,
    ui: uiReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
