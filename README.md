# Stubly – Event Management System

A React app to explore events from the **Ticketmaster Discovery API**, register for them, and manage your registrations.
Built with **React**, **Redux Toolkit**, **React Router** and **Vite**.

## Features

- Sign up, log in and log out (frontend simulation, saved in Local Storage so a refresh keeps you logged in)
- Browse upcoming events, search by keyword, filter by category, country, city and date range, and sort results
- Category buttons loaded from the API
- Event details: name, date and time, venue, location, category, image, price, extra info, seat map and ticket link
- Register for an event (duplicates are blocked), cancel a registration, and get a message after each action
- My Events page with Upcoming and Completed tabs
- Protected routes, loading and error states, form validation and a responsive layout

## Setup

1. Get a free API key at <https://developer.ticketmaster.com/> (use the **Consumer Key** of your app under My Apps).
2. Install the project:

```bash
   npm install
```

3. Create a file named `.env` in the project root (next to `package.json`) with this line:

```
   VITE_TICKETMASTER_API_KEY=your_consumer_key_here
```

   You can copy `.env.example` and fill it in. The `.env` file is ignored by Git, so your key is never committed.

4. Start the app:

```bash
   npm run dev
```

   Open the address shown in the terminal (usually <http://localhost:5173>).

Restart `npm run dev` after changing `.env`.

Other commands: `npm run build` (production build) and `npm run preview` (preview the build).

## Project structure

```
src/
  app/store.js                           configureStore and Local Storage saving
  features/
    auth/authSlice.js                    accounts, logged-in user, login errors
    events/eventsSlice.js                event list, filters, details, categories (async thunks)
    registrations/registrationsSlice.js  registrations per user, register and cancel
    ui/uiSlice.js                        pop-up messages
  services/ticketmaster.js               all API calls and data cleanup
  components/                            Navbar, EventCard, SearchFilters, Pagination, Toast, route guards, loaders
  pages/                                 Events, EventDetails, MyEvents, Login, Register, NotFound
  utils/                                 date and price formatting, Local Storage helpers
```

## Routes

| Path | Page | Access |
| --- | --- | --- |
| `/events` | Event list, search and filters | Everyone |
| `/events/:id` | Event details and registration | Everyone (log in to register) |
| `/login`, `/register` | Authentication | Logged-out users only |
| `/my-events` | Registered events | Logged-in users only |

## Redux structure

- `auth`: registered accounts, the current user and any login error
- `events`: the event list, filters, page number, the selected event and the category list, with a loading status for each
- `registrations`: saved events grouped by user id
- `ui`: the pop-up message

## Notes

- Authentication is a simulation: accounts and passwords are stored in the browser. A real app would use a backend.
- The API allows 5,000 requests per day and 2 per second. If you see "Too many requests", wait a moment.
- Ticketmaster only returns the first 1,000 results of a search, so very broad searches stop at page 80.