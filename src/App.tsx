import { useEffect, useState } from 'react';
import Dashboard from './pages/Dashboard';
import Library from './pages/Library';
import SpeciesDetail from './pages/SpeciesDetail';
import FieldGuide from './pages/FieldGuide';

/** Tiny hash router: #/ · #/library · #/library/<id> · #/guide */
function useRoute(): string[] {
  const read = () => window.location.hash.replace(/^#\/?/, '').split('/').filter(Boolean);
  const [parts, setParts] = useState<string[]>(read);
  useEffect(() => {
    const on = () => {
      setParts(read());
      window.scrollTo({ top: 0 });
    };
    window.addEventListener('hashchange', on);
    return () => window.removeEventListener('hashchange', on);
  }, []);
  return parts;
}

const NAV = [
  { href: '#/', label: 'Cabinet', key: '' },
  { href: '#/library', label: 'Library', key: 'library' },
  { href: '#/guide', label: 'Field Guide', key: 'guide' },
];

export default function App() {
  const parts = useRoute();
  const section = parts[0] ?? '';

  let page: React.ReactNode;
  if (section === 'library' && parts[1]) page = <SpeciesDetail id={parts[1]} />;
  else if (section === 'library') page = <Library />;
  else if (section === 'guide') page = <FieldGuide />;
  else page = <Dashboard />;

  return (
    <>
      <header className="masthead">
        <a href="#/" className="brand">
          <span className="brand-mark" aria-hidden="true">
            <svg viewBox="0 0 100 120" width="26" height="31"><path d="M50 110 Q4 108 6 60 Q8 14 54 12 Q94 14 92 52 Q90 84 60 84 Q36 84 36 60 Q36 42 54 42 Q68 42 68 56 Q68 66 58 66" fill="none" stroke="currentColor" strokeWidth="6" strokeLinecap="round" /></svg>
          </span>
          <span>
            <span className="brand-name">The Shell Cabinet</span>
            <span className="brand-sub">A private collection · Southwest Florida</span>
          </span>
        </a>
        <nav className="nav">
          {NAV.map((n) => (
            <a key={n.key} href={n.href} className={section === n.key ? 'active' : ''}>{n.label}</a>
          ))}
        </nav>
      </header>
      <main className="page">{page}</main>
      <footer className="colophon">
        <span>Inventory as of 12 Sep 2026 · values are the collector's own estimates</span>
        <span>Plates drawn in-house · not to scale</span>
      </footer>
    </>
  );
}
