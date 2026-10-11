// Shows the date and time exactly as the venue lists them (venue-local time).
export function formatEventDate(event) {
  if (!event.localDate) return 'Date to be announced';
  const day = new Date(`${event.localDate}T12:00:00`);
  const date = day.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
  if (!event.localTime) return date;
  const [hours, minutes] = event.localTime.split(':');
  const time = new Date();
  time.setHours(Number(hours), Number(minutes), 0, 0);
  return `${date}, ${time.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}`;
}

export function isPastEvent(event) {
  return event.startsAt ? new Date(event.startsAt) < new Date() : false;
}

export function formatPrice(event) {
  if (event.priceMin == null) return 'Price not listed';
  const money = (n) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: event.currency || 'USD' }).format(n);
  return event.priceMax && event.priceMax !== event.priceMin
    ? `${money(event.priceMin)} – ${money(event.priceMax)}`
    : money(event.priceMin);
}