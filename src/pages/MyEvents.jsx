import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import EventCard from '../components/EventCard';
import { EmptyState } from '../components/Feedback';
import { cancelRegistration, selectMyRegistrations } from '../features/registrations/registrationsSlice';
import { isPastEvent } from '../utils/format';

export default function MyEvents() {
  const dispatch = useDispatch();
  const registrations = useSelector(selectMyRegistrations);
  const [tab, setTab] = useState('upcoming');

  // Upcoming: soonest first. Completed: most recent first.
  const upcoming = registrations
    .filter((e) => !isPastEvent(e))
    .sort((a, b) => a.startsAt.localeCompare(b.startsAt));
  const completed = registrations
    .filter(isPastEvent)
    .sort((a, b) => b.startsAt.localeCompare(a.startsAt));
  const shown = tab === 'upcoming' ? upcoming : completed;

  const handleCancel = (event) => {
    if (window.confirm(`Cancel your registration for ${event.name}?`)) dispatch(cancelRegistration(event));
  };

  return (
    <section>
      <div className="page-head">
        <h1>My events</h1>
        <p className="muted">Events you have registered for.</p>
      </div>

      <div className="tabs" role="tablist">
        <button
          role="tab"
          aria-selected={tab === 'upcoming'}
          className={`tab ${tab === 'upcoming' ? 'tab-on' : ''}`}
          onClick={() => setTab('upcoming')}
        >
          Upcoming ({upcoming.length})
        </button>
        <button
          role="tab"
          aria-selected={tab === 'completed'}
          className={`tab ${tab === 'completed' ? 'tab-on' : ''}`}
          onClick={() => setTab('completed')}
        >
          Completed ({completed.length})
        </button>
      </div>

      {shown.length === 0 ? (
        <EmptyState title={tab === 'upcoming' ? 'No upcoming events' : 'No completed events yet'}>
          {tab === 'upcoming' && <Link className="btn btn-primary" to="/events">Browse events</Link>}
        </EmptyState>
      ) : (
        <div className="grid">
          {shown.map((event) => (
            <EventCard key={event.id} event={event}>
              {tab === 'upcoming' ? (
                <button className="btn btn-danger" onClick={() => handleCancel(event)}>Cancel registration</button>
              ) : (
                <span className="muted">This event has taken place</span>
              )}
            </EventCard>
          ))}
        </div>
      )}
    </section>
  );
}