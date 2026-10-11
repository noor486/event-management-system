import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import EventCard from '../components/EventCard';
import { EmptyState, ErrorMessage, Loader } from '../components/Feedback';
import { fetchEvents } from '../features/events/eventsSlice';

export default function Events() {
  const dispatch = useDispatch();
  const { list, status, error } = useSelector((state) => state.events);

  useEffect(() => {
    dispatch(fetchEvents());
  }, [dispatch]);

  return (
    <section>
      <div className="page-head">
        <h1>Upcoming events</h1>
        <p className="muted">Browse what is coming up.</p>
      </div>

      {status === 'loading' && <Loader label="Finding events…" />}
      {status === 'failed' && <ErrorMessage message={error} onRetry={() => dispatch(fetchEvents())} />}
      {status === 'succeeded' && list.length === 0 && (
        <EmptyState title="No events found">
          <p>Try again in a little while.</p>
        </EmptyState>
      )}
      {status === 'succeeded' && list.length > 0 && (
        <div className="grid">
          {list.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      )}
    </section>
  );
}