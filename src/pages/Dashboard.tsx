import ShellGlyph from '../components/ShellGlyph';
import Rarity from '../components/Rarity';
import { SPECIES, SPECIES_BY_ID } from '../data/species';
import { NOTABLE_FINDS, TODO, NEEDS_STORAGE } from '../data/inventory';
import { HOLDINGS, TOTAL_SHELLS, TOTAL_VALUE, SPECIES_HELD, fmtInt, fmtMoney } from '../lib/stats';

const SPECIES_BY_ID_SAFE = (id: string) => SPECIES_BY_ID[id]?.common ?? id;

export default function Dashboard() {
  const held = HOLDINGS.filter((h) => h.count > 0);
  const byValue = [...held].sort((a, b) => b.value - a.value);
  const byCount = [...held].sort((a, b) => b.count - a.count);
  const gallery = [...byValue.slice(0, 18)].sort((a, b) => a.species.common.localeCompare(b.species.common));
  const rarest = [...held].sort((a, b) => b.species.rarity - a.species.rarity || a.count - b.count)[0];
  const priciest = [...held].sort((a, b) => b.lots.reduce((m, l) => Math.max(m, l.unitValue), 0) - a.lots.reduce((m, l) => Math.max(m, l.unitValue), 0))[0];
  const priciestUnit = priciest.lots.reduce((m, l) => Math.max(m, l.unitValue), 0);
  const swfl = SPECIES.filter((s) => s.region === 'Southwest Florida');
  const swflFound = swfl.filter((s) => (HOLDINGS.find((h) => h.species.id === s.id)?.count ?? 0) > 0).length;
  const maxValue = byValue[0]?.value ?? 1;

  return (
    <>
      <section className="hero">
        <p className="eyebrow">Collection summary</p>
        <h1>Five thousand shells, one coastline.</h1>
        <p className="lede">
          Everything here was picked up by hand on the beaches and flats of Sanibel Island and the
          surrounding Gulf coast, then sorted by species, size and colour.
        </p>
      </section>

      <section className="stats">
        <div className="stat">
          <span className="stat-label">Collection value</span>
          <span className="stat-value">{fmtMoney(TOTAL_VALUE)}</span>
          <span className="stat-foot">collector's estimate</span>
        </div>
        <div className="stat">
          <span className="stat-label">Shells</span>
          <span className="stat-value">{fmtInt(TOTAL_SHELLS)}</span>
          <span className="stat-foot">across {HOLDINGS.reduce((n, h) => n + h.lots.filter((l) => l.quantity > 0).length, 0)} sorted lots</span>
        </div>
        <div className="stat">
          <span className="stat-label">Species</span>
          <span className="stat-value">{SPECIES_HELD}</span>
          <span className="stat-foot">{swflFound} of {swfl.length} Southwest Florida species</span>
        </div>
        <div className="stat">
          <span className="stat-label">Rarest piece</span>
          <span className="stat-value stat-value--text">{rarest.species.common}</span>
          <span className="stat-foot"><Rarity level={rarest.species.rarity} /></span>
        </div>
      </section>

      <section className="gallery" aria-label="Gallery of shell types in the collection">
        <div className="gallery-track">
          {[...gallery, ...gallery].map((h, i) => (
            <a key={`${h.species.id}-${i}`} href={`#/library/${h.species.id}`} className="plate plate--gallery" aria-hidden={i >= gallery.length}>
              <ShellGlyph glyph={h.species.glyph} palette={h.species.palette} size={80} />
              <span className="plate-name">{h.species.common}</span>
              <span className="plate-sci">{h.species.scientific}</span>
              <span className="plate-count">{fmtInt(h.count)}</span>
            </a>
          ))}
        </div>
      </section>

      <section className="two-col">
        <div className="panel">
          <h2 className="panel-title">By value</h2>
          <ol className="bars">
            {byValue.slice(0, 8).map((h) => (
              <li key={h.species.id}>
                <a href={`#/library/${h.species.id}`} className="bar-label">{h.species.common}</a>
                <span className="bar-track"><span className="bar-fill" style={{ width: `${(h.value / maxValue) * 100}%`, background: h.species.palette[1] }} /></span>
                <span className="bar-num">{fmtMoney(h.value)}</span>
              </li>
            ))}
          </ol>
        </div>
        <div className="panel">
          <h2 className="panel-title">By count</h2>
          <ol className="bars">
            {byCount.slice(0, 8).map((h) => (
              <li key={h.species.id}>
                <a href={`#/library/${h.species.id}`} className="bar-label">{h.species.common}</a>
                <span className="bar-track"><span className="bar-fill" style={{ width: `${(h.count / byCount[0].count) * 100}%`, background: h.species.palette[1] }} /></span>
                <span className="bar-num">{fmtInt(h.count)}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="two-col">
        <div className="panel">
          <h2 className="panel-title">Notable finds</h2>
          <table className="ledger">
            <thead><tr><th>Shell</th><th>Size</th><th>Where</th><th>When</th></tr></thead>
            <tbody>
              {NOTABLE_FINDS.map((f, i) => (
                <tr key={i}>
                  <td><a href={`#/library/${f.speciesId}`}>{SPECIES_BY_ID_SAFE(f.speciesId)}</a></td>
                  <td>{f.size}</td><td>{f.location}</td><td>{f.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="panel-note">
            Single most valuable shell: a {priciest.species.common.toLowerCase()} at {fmtMoney(priciestUnit)}.
          </p>
        </div>
        <div className="panel">
          <h2 className="panel-title">Curator's notes</h2>
          <h3 className="sub">To sort</h3>
          <ul className="checklist">{TODO.map((t) => <li key={t}>{t}</li>)}</ul>
          <h3 className="sub">Needs storage</h3>
          <ul className="checklist">{NEEDS_STORAGE.map((t) => <li key={t}>{t}</li>)}</ul>
        </div>
      </section>
    </>
  );
}
