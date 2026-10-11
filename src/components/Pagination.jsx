// The Ticketmaster API only allows paging up to 1,000 results, so we cap the page count.
const MAX_PAGES = 80;

export default function Pagination({ pageNumber, totalPages, onChange }) {
  const pages = Math.min(totalPages, MAX_PAGES);
  if (pages <= 1) return null;
  return (
    <nav className="pagination" aria-label="Pages">
      <button className="btn btn-ghost" disabled={pageNumber === 0} onClick={() => onChange(pageNumber - 1)}>Previous</button>
      <span>Page {pageNumber + 1} of {pages}</span>
      <button className="btn btn-ghost" disabled={pageNumber + 1 >= pages} onClick={() => onChange(pageNumber + 1)}>Next</button>
    </nav>
  );
}