import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import uiReducer from '../features/ui/uiSlice';
import { loadState, saveAuth } from '../utils/storage';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    ui: uiReducer,
  },
  preloadedState: loadState(), // restores login after a refresh
});

// Every time the store changes, save the auth data if it changed.
let lastAuth = store.getState().auth;
store.subscribe(() => {
  const { auth } = store.getState();
  if (auth !== lastAuth) {
    lastAuth = auth;
    saveAuth(auth);
  }
});