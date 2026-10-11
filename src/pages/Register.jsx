import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { clearAuthError, registerUser } from '../features/auth/authSlice';
import { showToast } from '../features/ui/uiSlice';

function validate(form) {
  const errors = {};
  if (form.name.trim().length < 2) errors.name = 'Enter your name (at least 2 letters).';
  if (!/^\S+@\S+\.\S+$/.test(form.email)) errors.email = 'Enter a valid email address.';
  if (form.password.length < 6) errors.password = 'Use at least 6 characters.';
  if (form.confirm !== form.password) errors.confirm = 'Passwords do not match.';
  return errors;
}

export default function Register() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, error } = useSelector((state) => state.auth);
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [errors, setErrors] = useState({});

  useEffect(() => () => dispatch(clearAuthError()), [dispatch]);

  useEffect(() => {
    if (user) {
      dispatch(showToast({ type: 'success', message: 'Your account is ready.' }));
      navigate('/events', { replace: true });
    }
  }, [user]); // eslint-disable-line react-hooks/exhaustive-deps

  const change = (field) => (e) => setForm({ ...form, [field]: e.target.value });
  const submit = (e) => {
    e.preventDefault();
    const next = validate(form);
    setErrors(next);
    if (Object.keys(next).length === 0) dispatch(registerUser(form));
  };

  const fields = [
    ['name', 'Name', 'text', 'name'],
    ['email', 'Email', 'email', 'email'],
    ['password', 'Password', 'password', 'new-password'],
    ['confirm', 'Confirm password', 'password', 'new-password'],
  ];

  return (
    <section className="auth-card">
      <h1>Create your account</h1>
      <form onSubmit={submit} noValidate>
        {fields.map(([key, label, type, auto]) => (
          <label className="field" key={key}>
            <span>{label}</span>
            <input type={type} autoComplete={auto} value={form[key]} onChange={change(key)} />
            {errors[key] && <small className="field-error">{errors[key]}</small>}
          </label>
        ))}
        {error && <p className="form-error" role="alert">{error}</p>}
        <button className="btn btn-primary btn-block" type="submit">Create account</button>
      </form>
      <p className="muted">Already have an account? <Link to="/login">Log in</Link></p>
    </section>
  );
}