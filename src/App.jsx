import { Navigate, Outlet, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Toast from './components/Toast';
import { GuestRoute } from './components/RouteGuards';
import Login from './pages/Login';
import Register from './pages/Register';
import NotFound from './pages/NotFound';
import Events from './pages/Events';
import EventDetails from './pages/EventDetails';

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
        <Route path="/events" element={<Events />} />
        <Route path="/events/:id" element={<EventDetails />} />
        <Route element={<GuestRoute />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}