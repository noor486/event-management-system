import { useSelector } from 'react-redux';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

// Only logged-in users can open the pages inside this gate.
// Anyone else is sent to Login, and brought back afterwards.
export function ProtectedRoute() {
  const user = useSelector((state) => state.auth.user);
  const location = useLocation();
  if (!user) return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  return <Outlet />;
}

// Login and Register are hidden once you are logged in.
// If the user came from another page (like an event), send them back there.
export function GuestRoute() {
  const user = useSelector((state) => state.auth.user);
  const location = useLocation();
  if (user) return <Navigate to={location.state?.from || '/events'} replace />;
  return <Outlet />;
}