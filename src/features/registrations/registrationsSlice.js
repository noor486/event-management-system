import { createSlice } from '@reduxjs/toolkit';
import { showToast } from '../ui/uiSlice';

const NONE = []; // one shared empty array so selectors don't cause extra re-renders

// byUser = { [userId]: [ saved event, ... ] }
const registrationsSlice = createSlice({
  name: 'registrations',
  initialState: { byUser: {} },
  reducers: {
    addRegistration(state, action) {
      const { userId, event } = action.payload;
      const list = state.byUser[userId] || [];
      if (list.some((item) => item.id === event.id)) return; // no duplicates
      state.byUser[userId] = [...list, { ...event, registeredAt: new Date().toISOString() }];
    },
    removeRegistration(state, action) {
      const { userId, eventId } = action.payload;
      state.byUser[userId] = (state.byUser[userId] || []).filter((item) => item.id !== eventId);
    },
  },
});

export const { addRegistration, removeRegistration } = registrationsSlice.actions;
export default registrationsSlice.reducer;

// Gives the registrations of whoever is logged in.
export const selectMyRegistrations = (state) => state.registrations.byUser[state.auth.user?.id] || NONE;

// These two check the rules, update the store, then show a message.
export const registerForEvent = (event) => (dispatch, getState) => {
  const state = getState();
  const user = state.auth.user;
  if (!user) {
    dispatch(showToast({ type: 'error', message: 'Log in to register for events.' }));
    return;
  }
  if (selectMyRegistrations(state).some((item) => item.id === event.id)) {
    dispatch(showToast({ type: 'info', message: 'You are already registered for this event.' }));
    return;
  }
  dispatch(addRegistration({ userId: user.id, event }));
  dispatch(showToast({ type: 'success', message: `You are registered for ${event.name}.` }));
};

export const cancelRegistration = (event) => (dispatch, getState) => {
  const user = getState().auth.user;
  if (!user) return;
  dispatch(removeRegistration({ userId: user.id, eventId: event.id }));
  dispatch(showToast({ type: 'info', message: `Registration cancelled for ${event.name}.` }));
};