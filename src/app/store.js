import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import eventsReducer from '../features/events/eventsSlice';
import registrationsReducer from '../features/registrations/registrationsSlice';
import uiReducer from '../features/ui/uiSlice';
import { loadState, saveAuth, saveRegistrations } from '../utils/storage';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    events: eventsReducer,
    registrations: registrationsReducer,
    ui: uiReducer,
  },
  preloadedState: loadState(), // restores login and registrations after a refresh
});

// Save to Local Storage only when these slices actually change.
let lastAuth = store.getState().auth;
let lastRegistrations = store.getState().registrations;
store.subscribe(() => {
  const { auth, registrations } = store.getState();
  if (auth !== lastAuth) {
    lastAuth = auth;
    saveAuth(auth);
  }
  if (registrations !== lastRegistrations) {
    lastRegistrations = registrations;
    saveRegistrations(registrations);
  }
});