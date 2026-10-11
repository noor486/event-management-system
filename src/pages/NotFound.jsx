import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <section>
      <h1>Page not found</h1>
      <p className="muted">The page you opened does not exist.</p>
      <Link className="btn btn-primary" to="/events">Back to events</Link>
    </section>
  );
}