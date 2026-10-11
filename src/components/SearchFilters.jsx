import { useEffect, useState } from 'react';

const COUNTRIES = [
  ['', 'All countries'], ['US', 'United States'], ['CA', 'Canada'], ['GB', 'United Kingdom'],
  ['AU', 'Australia'], ['IE', 'Ireland'], ['DE', 'Germany'], ['ES', 'Spain'], ['FR', 'France'],
  ['NL', 'Netherlands'], ['MX', 'Mexico'], ['AE', 'United Arab Emirates'],
];

export default function SearchFilters({ filters, categories, onApply, onReset }) {
  const [draft, setDraft] = useState(filters);
  useEffect(() => setDraft(filters), [filters]); // keep the form in step with the store

  const update = (field) => (e) => setDraft({ ...draft, [field]: e.target.value });
  const submit = (e) => {
    e.preventDefault();
    onApply(draft);
  };

  return (
    <form className="filters" onSubmit={submit}>
      <label className="field field-wide">
        <span>Search</span>
        <input type="search" placeholder="Artist, team or event name" value={draft.keyword} onChange={update('keyword')} />
      </label>
      <label className="field">
        <span>Category</span>
        <select value={draft.segmentId} onChange={update('segmentId')}>
          <option value="">All categories</option>
          {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
      </label>
      <label className="field">
        <span>Country</span>
        <select value={draft.countryCode} onChange={update('countryCode')}>
          {COUNTRIES.map(([code, name]) => <option key={code} value={code}>{name}</option>)}
        </select>
      </label>
      <label className="field">
        <span>City</span>
        <input type="text" placeholder="e.g. Chicago" value={draft.city} onChange={update('city')} />
      </label>
      <label className="field">
        <span>When</span>
        <select value={draft.range} onChange={update('range')}>
          <option value="any">Any upcoming date</option>
          <option value="week">Next 7 days</option>
          <option value="month">Next 30 days</option>
          <option value="quarter">Next 90 days</option>
        </select>
      </label>
      <label className="field">
        <span>Sort by</span>
        <select value={draft.sort} onChange={update('sort')}>
          <option value="date,asc">Soonest first</option>
          <option value="name,asc">Name A–Z</option>
          <option value="relevance,desc">Best match</option>
        </select>
      </label>
      <div className="filter-actions">
        <button type="submit" className="btn btn-primary">Search events</button>
        <button type="button" className="btn btn-ghost" onClick={onReset}>Clear</button>
      </div>
    </form>
  );
}