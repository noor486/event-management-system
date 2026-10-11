import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { clearAuthError, loginUser } from '../features/auth/authSlice';
import { showToast } from '../features/ui/uiSlice';

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, error } = useSelector((state) => state.auth);
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});

  // Clear any old error message when leaving this page.
  useEffect(() => () => dispatch(clearAuthError()), [dispatch]);

  // After a successful login, go back to the page the user wanted.
  useEffect(() => {
    if (user) {
      dispatch(showToast({ type: 'success', message: `Welcome back, ${user.name.split(' ')[0]}.` }));
      navigate(location.state?.from || '/events', { replace: true });
    }
  }, [user]); // eslint-disable-line react-hooks/exhaustive-deps

  const submit = (e) => {
    e.preventDefault();
    const next = {};
    if (!/^\S+@\S+\.\S+$/.test(form.email)) next.email = 'Enter a valid email address.';
    if (!form.password) next.password = 'Enter your password.';
    setErrors(next);
    if (Object.keys(next).length === 0) dispatch(loginUser(form));
  };

  return (
    <section className="auth-card">
      <h1>Log in</h1>
      <form onSubmit={submit} noValidate>
        <label className="field">
          <span>Email</span>
          <input type="email" autoComplete="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          {errors.email && <small className="field-error">{errors.email}</small>}
        </label>
        <label className="field">
          <span>Password</span>
          <input type="password" autoComplete="current-password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
          {errors.password && <small className="field-error">{errors.password}</small>}
        </label>
        {error && <p className="form-error" role="alert">{error}</p>}
        <button className="btn btn-primary btn-block" type="submit">Log in</button>
      </form>
      <p className="muted">New here? <Link to="/register">Create an account</Link></p>
    </section>
  );
}