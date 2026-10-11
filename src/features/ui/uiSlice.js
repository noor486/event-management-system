import { createSlice } from '@reduxjs/toolkit';

// Holds the small message ("toast") shown after actions like registering.
const uiSlice = createSlice({
  name: 'ui',
  initialState: { toast: null },
  reducers: {
    showToast(state, action) {
      state.toast = { id: Date.now(), ...action.payload };
    },
    hideToast(state) {
      state.toast = null;
    },
  },
});

export const { showToast, hideToast } = uiSlice.actions;
export default uiSlice.reducer;