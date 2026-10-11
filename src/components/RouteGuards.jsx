import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';

// Login and Register are hidden once you are logged in.
export function GuestRoute() {
  const user = useSelector((state) => state.auth.user);
  if (user) return <Navigate to="/events" replace />;
  return <Outlet />;
}