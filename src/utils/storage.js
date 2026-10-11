// Small helpers that keep Redux state in Local Storage.
const KEYS = {
  users: 'stubly_users',
  session: 'stubly_session',
  registrations: 'stubly_registrations',
};

function read(key, fallback) {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
}

function write(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Storage can be full or blocked. The app still works for this visit.
  }
}

// Used when the app starts: bring back saved accounts, the logged-in user and registrations.
export function loadState() {
  return {
    auth: { users: read(KEYS.users, []), user: read(KEYS.session, null), error: null },
    registrations: { byUser: read(KEYS.registrations, {}) },
  };
}

export function saveAuth({ users, user }) {
  write(KEYS.users, users);
  write(KEYS.session, user);
}

export function saveRegistrations({ byUser }) {
  write(KEYS.registrations, byUser);
}