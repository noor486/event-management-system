import { createSlice } from '@reduxjs/toolkit';

// Frontend-only login simulation. Accounts live in Local Storage.
// (A real app would never store passwords in the browser.)
const authSlice = createSlice({
  name: 'auth',
  initialState: { users: [], user: null, error: null },
  reducers: {
    registerUser(state, action) {
      const { name, email, password } = action.payload;
      const cleanEmail = email.trim().toLowerCase();
      if (state.users.some((u) => u.email === cleanEmail)) {
        state.error = 'An account with this email already exists. Try logging in.';
        return;
      }
      const account = { id: crypto.randomUUID(), name: name.trim(), email: cleanEmail, password };
      state.users.push(account);
      state.user = { id: account.id, name: account.name, email: account.email };
      state.error = null;
    },
    loginUser(state, action) {
      const cleanEmail = action.payload.email.trim().toLowerCase();
      const account = state.users.find(
        (u) => u.email === cleanEmail && u.password === action.payload.password
      );
      if (!account) {
        state.error = 'Email or password is incorrect.';
        return;
      }
      state.user = { id: account.id, name: account.name, email: account.email };
      state.error = null;
    },
    logoutUser(state) {
      state.user = null;
      state.error = null;
    },
    clearAuthError(state) {
      state.error = null;
    },
  },
});

export const { registerUser, loginUser, logoutUser, clearAuthError } = authSlice.actions;
export default authSlice.reducer;