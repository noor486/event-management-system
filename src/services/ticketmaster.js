const BASE_URL = 'https://app.ticketmaster.com/discovery/v2';
const API_KEY = import.meta.env.VITE_TICKETMASTER_API_KEY;
export const PAGE_SIZE = 12;

async function request(path, params = {}) {
  if (!API_KEY) {
    throw new Error(
      'Ticketmaster API key is missing. Add VITE_TICKETMASTER_API_KEY to your .env file and restart the dev server.'
    );
  }
  const url = new URL(`${BASE_URL}/${path}`);
  url.searchParams.set('apikey', API_KEY);
  Object.entries(params).forEach(([key, value]) => {
    if (value !== '' && value !== null && value !== undefined) url.searchParams.set(key, value);
  });

  let response;
  try {
    response = await fetch(url);
  } catch {
    throw new Error('Could not reach Ticketmaster. Check your internet connection and try again.');
  }
  if (response.status === 429) throw new Error('Too many requests. Wait a few seconds and try again.');
  if (response.status === 401) throw new Error('Ticketmaster rejected the API key. Check the key in your .env file.');
  if (!response.ok) throw new Error(`Ticketmaster request failed (status ${response.status}).`);
  return response.json();
}

// The API wants UTC dates like 2026-10-11T10:00:00Z (no milliseconds).
const toApiDate = (date) => date.toISOString().replace(/\.\d{3}Z$/, 'Z');

const RANGE_DAYS = { week: 7, month: 30, quarter: 90 };

function pickImage(images = []) {
  const wide = images
    .filter((img) => img.ratio === '16_9' && img.width >= 640)
    .sort((a, b) => a.width - b.width);
  return (wide[0] || images[0] || {}).url || '';
}

const cleanName = (value) => (value && value !== 'Undefined' ? value : '');

// Ticketmaster sends a huge, messy object per event.
// This picks out only what our app needs, with safe defaults.
export function normalizeEvent(raw) {
  const venue = raw._embedded?.venues?.[0] || {};
  const classification = raw.classifications?.[0] || {};
  const price = raw.priceRanges?.[0] || {};
  const start = raw.dates?.start || {};
  const timeKnown = !(start.noSpecificTime || start.timeTBA) && start.localTime;
  return {
    id: raw.id,
    name: raw.name,
    image: pickImage(raw.images),
    url: raw.url || '',
    localDate: start.localDate || '',
    localTime: timeKnown ? start.localTime : '',
    // Used to decide upcoming vs completed.
    startsAt: start.dateTime || (start.localDate ? `${start.localDate}T${start.localTime || '23:59:59'}` : ''),
    status: raw.dates?.status?.code || 'onsale',
    venue: venue.name || 'Venue to be announced',
    address: venue.address?.line1 || '',
    city: venue.city?.name || '',
    state: venue.state?.stateCode || venue.state?.name || '',
    country: venue.country?.name || '',
    category: cleanName(classification.segment?.name) || 'Other',
    genre: cleanName(classification.genre?.name),
    subGenre: cleanName(classification.subGenre?.name),
    priceMin: price.min ?? null,
    priceMax: price.max ?? null,
    currency: price.currency || 'USD',
    info: raw.info || '',
    pleaseNote: raw.pleaseNote || '',
    seatmap: raw.seatmap?.staticUrl || '',
    attractions: (raw._embedded?.attractions || []).map((a) => a.name),
  };
}

export async function searchEvents(filters, pageNumber = 0) {
  const now = new Date();
  const params = {
    keyword: filters.keyword.trim(),
    segmentId: filters.segmentId,
    countryCode: filters.countryCode,
    city: filters.city.trim(),
    sort: filters.sort,
    size: PAGE_SIZE,
    page: pageNumber,
    startDateTime: toApiDate(now), // upcoming events only
  };
  const days = RANGE_DAYS[filters.range];
  if (days) params.endDateTime = toApiDate(new Date(now.getTime() + days * 24 * 60 * 60 * 1000));

  const data = await request('events.json', params);
  return {
    events: (data._embedded?.events || []).map(normalizeEvent),
    page: { totalPages: data.page?.totalPages || 0, totalElements: data.page?.totalElements || 0 },
  };
}

export async function getEventById(id) {
  return normalizeEvent(await request(`events/${encodeURIComponent(id)}.json`));
}

export async function getCategories() {
  const data = await request('classifications.json', { size: 50 });
  const seen = new Map();
  (data._embedded?.classifications || []).forEach(({ segment }) => {
    if (segment?.id && segment.name !== 'Undefined' && !seen.has(segment.id)) {
      seen.set(segment.id, { id: segment.id, name: segment.name });
    }
  });
  return [...seen.values()];
}