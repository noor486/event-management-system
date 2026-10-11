import { Navigate, Outlet, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Toast from './components/Toast';
import NotFound from './pages/NotFound';

// The parts that stay on every page: top bar and pop-up message.
function Layout() {
  return (
    <>
      <Navbar />
      <main className="container">
        <Outlet />
      </main>
      <Toast />
    </>
  );
}

// Temporary page. We replace it with the real Events page later.
function EventsPlaceholder() {
  return (
    <section>
      <h1>Events</h1>
      <p className="muted">Events will appear here soon.</p>
    </section>
  );
}

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Navigate to="/events" replace />} />
        <Route path="/events" element={<EventsPlaceholder />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}