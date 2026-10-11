// Small helpers that keep Redux state in Local Storage.
const KEYS = {
  users: 'stubly_users',
  session: 'stubly_session',
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

// Used when the app starts: bring back saved accounts and the logged-in user.
export function loadState() {
  return {
    auth: { users: read(KEYS.users, []), user: read(KEYS.session, null), error: null },
  };
}

export function saveAuth({ users, user }) {
  write(KEYS.users, users);
  write(KEYS.session, user);
}