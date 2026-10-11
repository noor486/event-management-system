import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchEvents } from '../features/events/eventsSlice';

// Basic version. Step 6 adds cards, search, filters and paging.
export default function Events() {
  const dispatch = useDispatch();
  const { list, status, error } = useSelector((state) => state.events);

  useEffect(() => {
    dispatch(fetchEvents());
  }, [dispatch]);

  return (
    <section>
      <h1>Upcoming events</h1>
      {status === 'loading' && <p className="muted">Loading events…</p>}
      {status === 'failed' && <p className="form-error" role="alert">{error}</p>}
      {status === 'succeeded' && (
        <ul>
          {list.map((event) => (
            <li key={event.id}>{event.name} – {event.city}</li>
          ))}
        </ul>
      )}
    </section>
  );
}