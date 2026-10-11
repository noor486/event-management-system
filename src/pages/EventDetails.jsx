import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import { ErrorMessage, Loader } from '../components/Feedback';
import { clearCurrentEvent, fetchEventById } from '../features/events/eventsSlice';
import {
  cancelRegistration,
  registerForEvent,
  selectMyRegistrations,
} from '../features/registrations/registrationsSlice';
import { formatEventDate, formatPrice, isPastEvent } from '../utils/format';

export default function EventDetails() {
  const { id } = useParams(); // the :id from the web address
  const dispatch = useDispatch();
  const { current: event, currentStatus, currentError } = useSelector((state) => state.events);
  const user = useSelector((state) => state.auth.user);
  const registrations = useSelector(selectMyRegistrations);

  // Load this event when the page opens. Clear it when leaving, so an old event never flashes.
  useEffect(() => {
    dispatch(fetchEventById(id));
    return () => dispatch(clearCurrentEvent());
  }, [dispatch, id]);

  if (currentStatus === 'loading' || currentStatus === 'idle') return <Loader label="Loading event…" />;
  if (currentStatus === 'failed') {
    return (
      <>
        <ErrorMessage message={currentError} onRetry={() => dispatch(fetchEventById(id))} />
        <Link to="/events">Back to events</Link>
      </>
    );
  }

  const registered = registrations.some((r) => r.id === event.id);
  const past = isPastEvent(event);
  const cancelled = ['cancelled', 'canceled'].includes(event.status);
  const location = [event.address, event.city, event.state, event.country].filter(Boolean).join(', ');
  const categories = [event.category, event.genre, event.subGenre].filter(Boolean);

  const handleCancel = () => {
    if (window.confirm('Cancel your registration for this event?')) dispatch(cancelRegistration(event));
  };

  return (
    <article className="details">
      <Link to="/events" className="back">← Back to events</Link>
      {event.image && <img className="hero" src={event.image} alt={event.name} />}

      <div className="details-grid">
        <div>
          <div className="chips-static">
            {categories.map((c) => <span key={c} className="tag tag-plain">{c}</span>)}
          </div>
          <h1>{event.name}</h1>
          <dl className="facts">
            <div><dt>Date and time</dt><dd>{formatEventDate(event)}</dd></div>
            <div><dt>Venue</dt><dd>{event.venue}</dd></div>
            <div><dt>Location</dt><dd>{location || 'Not listed'}</dd></div>
            <div><dt>Price</dt><dd>{formatPrice(event)}</dd></div>
            <div><dt>Ticket status</dt><dd className="status">{event.status}</dd></div>
            {event.attractions.length > 0 && <div><dt>Featuring</dt><dd>{event.attractions.join(', ')}</dd></div>}
          </dl>
          {event.info && (<><h2>About this event</h2><p>{event.info}</p></>)}
          {event.pleaseNote && (<><h2>Good to know</h2><p>{event.pleaseNote}</p></>)}
          {event.seatmap && (<><h2>Seat map</h2><img className="seatmap" src={event.seatmap} alt={`Seat map for ${event.venue}`} /></>)}
        </div>

        <aside className="panel">
          <h2>Register</h2>
          {past && <p className="muted">This event has already taken place.</p>}
          {!past && cancelled && <p className="muted">This event was cancelled, so registration is closed.</p>}

          {/* Not logged in: send them to log in, and bring them back here afterwards. */}
          {!past && !cancelled && !user && (
            <>
              <p className="muted">Log in to register for this event.</p>
              <Link className="btn btn-primary btn-block" to="/login" state={{ from: `/events/${event.id}` }}>
                Log in to register
              </Link>
            </>
          )}

          {/* Logged in but not registered yet. */}
          {!past && !cancelled && user && !registered && (
            <button className="btn btn-primary btn-block" onClick={() => dispatch(registerForEvent(event))}>
              Register for this event
            </button>
          )}

          {/* Already registered: show a confirmation and the cancel button. */}
          {user && registered && (
            <>
              <p className="ok">✓ You are registered.</p>
              {!past && <button className="btn btn-danger btn-block" onClick={handleCancel}>Cancel registration</button>}
            </>
          )}

          {event.url && (
            <a className="btn btn-ghost btn-block" href={event.url} target="_blank" rel="noreferrer">
              Buy tickets on Ticketmaster
            </a>
          )}
        </aside>
      </div>
    </article>
  );
}