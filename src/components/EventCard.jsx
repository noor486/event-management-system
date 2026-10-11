import { Link } from 'react-router-dom';
import { formatEventDate } from '../utils/format';

export default function EventCard({ event, registered, children }) {
  const place = [event.venue, event.city].filter(Boolean).join(', ');
  return (
    <article className="ticket">
      <Link to={`/events/${event.id}`} className="ticket-image" aria-label={`View ${event.name}`}>
        {event.image ? <img src={event.image} alt="" loading="lazy" /> : <div className="image-fallback">No image</div>}
        <span className="tag">{event.category}</span>
        {registered && <span className="tag tag-ok">Registered</span>}
      </Link>
      <div className="ticket-divider" aria-hidden="true" />
      <div className="ticket-body">
        <h3><Link to={`/events/${event.id}`}>{event.name}</Link></h3>
        <p className="meta">{formatEventDate(event)}</p>
        <p className="meta muted">{place}</p>
        {children && <div className="ticket-actions">{children}</div>}
      </div>
    </article>
  );
}