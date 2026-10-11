import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import EventCard from '../components/EventCard';
import Pagination from '../components/Pagination';
import SearchFilters from '../components/SearchFilters';
import { EmptyState, ErrorMessage, Loader } from '../components/Feedback';
import { selectMyRegistrations } from '../features/registrations/registrationsSlice';
import {
  fetchCategories,
  fetchEvents,
  resetFilters,
  setFilters,
  setPageNumber,
} from '../features/events/eventsSlice';

export default function Events() {
  const dispatch = useDispatch();
  const { list, status, error, filters, pageNumber, totalPages, totalElements, categories } = useSelector(
    (state) => state.events
  );
  const registrations = useSelector(selectMyRegistrations);

  // Load the category list once.
  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  // Ask Ticketmaster again whenever the filters or the page number change.
  useEffect(() => {
    dispatch(fetchEvents());
  }, [dispatch, filters, pageNumber]);

  const goToPage = (n) => {
    dispatch(setPageNumber(n));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section>
      <div className="page-head">
        <h1>Upcoming events</h1>
        <p className="muted">Find something to go to.</p>
      </div>

      {categories.length > 0 && (
        <div className="chips" role="group" aria-label="Event categories">
          <button
            className={`chip ${filters.segmentId === '' ? 'chip-on' : ''}`}
            onClick={() => dispatch(setFilters({ segmentId: '' }))}
          >
            All
          </button>
          {categories.map((c) => (
            <button
              key={c.id}
              className={`chip ${filters.segmentId === c.id ? 'chip-on' : ''}`}
              onClick={() => dispatch(setFilters({ segmentId: c.id }))}
            >
              {c.name}
            </button>
          ))}
        </div>
      )}

      <SearchFilters
        filters={filters}
        categories={categories}
        onApply={(values) => dispatch(setFilters(values))}
        onReset={() => dispatch(resetFilters())}
      />

      {status === 'loading' && <Loader label="Finding events…" />}
      {status === 'failed' && <ErrorMessage message={error} onRetry={() => dispatch(fetchEvents())} />}
      {status === 'succeeded' && list.length === 0 && (
        <EmptyState title="No events found">
          <p>Try a different keyword, a wider date range, or clear the filters.</p>
        </EmptyState>
      )}

      {status === 'succeeded' && list.length > 0 && (
        <>
          <p className="muted results-count">{totalElements.toLocaleString()} events found</p>
          <div className="grid">
            {list.map((event) => (
              <EventCard key={event.id} event={event} registered={registrations.some((r) => r.id === event.id)} />
            ))}
          </div>
          <Pagination pageNumber={pageNumber} totalPages={totalPages} onChange={goToPage} />
        </>
      )}
    </section>
  );
}