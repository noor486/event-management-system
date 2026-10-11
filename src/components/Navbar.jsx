import { useDispatch, useSelector } from 'react-redux';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { logoutUser } from '../features/auth/authSlice';
import { selectMyRegistrations } from '../features/registrations/registrationsSlice';
import { showToast } from '../features/ui/uiSlice';

export default function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  const count = useSelector(selectMyRegistrations).length;

  const handleLogout = () => {
    dispatch(logoutUser());
    dispatch(showToast({ type: 'info', message: 'You are logged out.' }));
    navigate('/events');
  };

  return (
    <header className="navbar">
      <div className="container navbar-inner">
        <Link to="/events" className="brand">Stubly</Link>
        <nav className="nav-links" aria-label="Main">
          <NavLink to="/events">Events</NavLink>
          {user && (
            <NavLink to="/my-events">
              My Events{count > 0 && <span className="count">{count}</span>}
            </NavLink>
          )}
        </nav>
        <div className="nav-user">
          {user ? (
            <>
              <span className="hello">Hi, {user.name.split(' ')[0]}</span>
              <button className="btn btn-ghost" onClick={handleLogout}>Log out</button>
            </>
          ) : (
            <>
              <Link className="btn btn-ghost" to="/login">Log in</Link>
              <Link className="btn btn-primary" to="/register">Sign up</Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}