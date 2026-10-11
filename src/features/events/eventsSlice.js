import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getCategories, getEventById, searchEvents } from '../../services/ticketmaster';

export const defaultFilters = {
  keyword: '',
  segmentId: '',
  countryCode: '',
  city: '',
  range: 'any',
  sort: 'date,asc',
};

export const fetchEvents = createAsyncThunk('events/fetchEvents', async (_, { getState, rejectWithValue }) => {
  const { filters, pageNumber } = getState().events;
  try {
    return await searchEvents(filters, pageNumber);
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

export const fetchEventById = createAsyncThunk('events/fetchEventById', async (id, { rejectWithValue }) => {
  try {
    return await getEventById(id);
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

export const fetchCategories = createAsyncThunk(
  'events/fetchCategories',
  async (_, { rejectWithValue }) => {
    try {
      return await getCategories();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
  { condition: (_, { getState }) => getState().events.categoriesStatus === 'idle' }
);

const initialState = {
  list: [],
  status: 'idle', // idle | loading | succeeded | failed
  error: null,
  requestId: null,
  filters: defaultFilters,
  pageNumber: 0,
  totalPages: 0,
  totalElements: 0,
  current: null,
  currentStatus: 'idle',
  currentError: null,
  categories: [],
  categoriesStatus: 'idle',
};

const eventsSlice = createSlice({
  name: 'events',
  initialState,
  reducers: {
    setFilters(state, action) {
      state.filters = { ...state.filters, ...action.payload };
      state.pageNumber = 0;
    },
    resetFilters(state) {
      state.filters = defaultFilters;
      state.pageNumber = 0;
    },
    setPageNumber(state, action) {
      state.pageNumber = action.payload;
    },
    clearCurrentEvent(state) {
      state.current = null;
      state.currentStatus = 'idle';
      state.currentError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchEvents.pending, (state, action) => {
        state.status = 'loading';
        state.error = null;
        state.requestId = action.meta.requestId;
      })
      .addCase(fetchEvents.fulfilled, (state, action) => {
        if (state.requestId !== action.meta.requestId) return; // ignore out-of-date responses
        state.status = 'succeeded';
        state.list = action.payload.events;
        state.totalPages = action.payload.page.totalPages;
        state.totalElements = action.payload.page.totalElements;
      })
      .addCase(fetchEvents.rejected, (state, action) => {
        if (state.requestId !== action.meta.requestId) return;
        state.status = 'failed';
        state.error = action.payload || 'Something went wrong while loading events.';
      })
      .addCase(fetchEventById.pending, (state) => {
        state.currentStatus = 'loading';
        state.currentError = null;
      })
      .addCase(fetchEventById.fulfilled, (state, action) => {
        state.currentStatus = 'succeeded';
        state.current = action.payload;
      })
      .addCase(fetchEventById.rejected, (state, action) => {
        state.currentStatus = 'failed';
        state.currentError = action.payload || 'Could not load this event.';
      })
      .addCase(fetchCategories.pending, (state) => {
        state.categoriesStatus = 'loading';
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.categoriesStatus = 'succeeded';
        state.categories = action.payload;
      })
      .addCase(fetchCategories.rejected, (state) => {
        state.categoriesStatus = 'failed';
      });
  },
});

export const { setFilters, resetFilters, setPageNumber, clearCurrentEvent } = eventsSlice.actions;
export default eventsSlice.reducer;