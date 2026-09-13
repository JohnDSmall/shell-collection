import ShellGlyph from '../components/ShellGlyph';
import Rarity from '../components/Rarity';
import { SPECIES_BY_ID } from '../data/species';
import { HOLDINGS_BY_ID, fmtInt, fmtMoney, sizeRank } from '../lib/stats';
import { variantPalette } from './Library';

export default function SpeciesDetail({ id }: { id: string }) {
  const s = SPECIES_BY_ID[id];
  if (!s) {
    return (
      <section className="hero hero--compact">
        <p className="eyebrow">Library</p>
        <h1>No such drawer.</h1>
        <p className="lede"><a href="#/library">Back to the library</a></p>
      </section>
    );
  }
  const h = HOLDINGS_BY_ID[id];
  const lots = h?.lots.filter((l) => l.quantity > 0 || h.lots.some((o) => o.variant === l.variant && o.quantity > 0)) ?? [];
  const sizes = [...new Set(lots.map((l) => l.size))].sort((a, b) => sizeRank(a) - sizeRank(b));
  const variants = [...new Set(lots.map((l) => l.variant))];
  const colours = variantPalette(variants, s.palette);
  const showGrid = lots.length > 1;
  const sizeLabel = (x: string) => (x ? `${x}″` : '—');

  return (
    <>
      <p className="crumbs"><a href="#/library">Library</a> / {s.common}</p>
      <section className="detail">
        <div className="detail-plate">
          <ShellGlyph glyph={s.glyph} palette={s.palette} size={220} />
          <span className="detail-plate-caption">{s.family}</span>
        </div>
        <div className="detail-body">
          <p className="eyebrow">{s.group} · {s.region}</p>
          <h1>{s.common}</h1>
          <p className="sci">{s.scientific}</p>
          <p className="lede">{s.blurb}</p>

          <dl className="facts-grid">
            <div><dt>Rarity</dt><dd><Rarity level={s.rarity} />{s.rarityFromSheet ? '' : <span className="muted"> (est.)</span>}</dd></div>
            <div><dt>Typical size</dt><dd>{s.sizeIn[1] ? `${s.sizeIn[0]}–${s.sizeIn[1]}″` : '—'}</dd></div>
            <div><dt>Habitat</dt><dd>{s.habitat}</dd></div>
            {h && <div><dt>In the collection</dt><dd><b>{fmtInt(h.count)}</b> shells · {fmtMoney(h.value)}</dd></div>}
          </dl>

          <h2 className="panel-title">Worth knowing</h2>
          <ul className="fact-list">{s.facts.map((f) => <li key={f}>{f}</li>)}</ul>
        </div>
      </section>

      {h && h.count > 0 && (
        <section className="panel">
          <h2 className="panel-title">The drawer</h2>
          {showGrid ? (
            <div className="table-wrap">
              <table className="ledger ledger--grid">
                <thead>
                  <tr>
                    <th>Size</th>
                    {variants.map((v) => (
                      <th key={v}><span className="swatch" style={{ background: colours[v] }} />{v || 'Standard'}</th>
                    ))}
                    <th className="num">Each</th>
                    <th className="num">Row total</th>
                  </tr>
                </thead>
                <tbody>
                  {sizes.map((sz) => {
                    const row = variants.map((v) => lots.find((l) => l.size === sz && l.variant === v));
                    const qty = row.reduce((n, l) => n + (l?.quantity ?? 0), 0);
                    const val = row.reduce((n, l) => n + (l ? l.quantity * l.unitValue : 0), 0);
                    const unit = [...new Set(row.filter(Boolean).map((l) => l!.unitValue))];
                    return (
                      <tr key={sz}>
                        <td>{sizeLabel(sz)}</td>
                        {row.map((l, i) => <td key={i} className={`num ${l && l.quantity ? '' : 'zero'}`}>{l ? fmtInt(l.quantity) : '·'}</td>)}
                        <td className="num muted">{unit.length === 1 ? fmtMoney(unit[0]) : unit.map(fmtMoney).join(' / ')}</td>
                        <td className="num">{qty ? `${fmtInt(qty)} · ${fmtMoney(val)}` : '—'}</td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot>
                  <tr>
                    <td>Total</td>
                    {variants.map((v) => <td key={v} className="num">{fmtInt(lots.filter((l) => l.variant === v).reduce((n, l) => n + l.quantity, 0))}</td>)}
                    <td />
                    <td className="num"><b>{fmtInt(h.count)} · {fmtMoney(h.value)}</b></td>
                  </tr>
                </tfoot>
              </table>
            </div>
          ) : (
            <p className="lede">{fmtInt(h.count)} shells at {fmtMoney(lots[0].unitValue)} each, not yet sorted by size or colour.</p>
          )}
          {h.lots.some((l) => l.note && l.note !== 'Good') && (
            <p className="panel-note">Notes: {h.lots.filter((l) => l.note && l.note !== 'Good').map((l) => `${l.variant || l.size || 'lot'} — ${l.note}`).join('; ')}</p>
          )}
          {h.finds.length > 0 && (
            <>
              <h3 className="sub">Notable finds</h3>
              <ul className="checklist">
                {h.finds.map((f, i) => <li key={i}>{f.size}, {f.location}, {f.date}</li>)}
              </ul>
            </>
          )}
        </section>
      )}

      {(!h || h.count === 0) && (
        <section className="panel panel--empty">
          <h2 className="panel-title">Not in the collection yet</h2>
          <p className="lede">This one is still on the list. <a href="#/guide">Open the field guide</a> to see where it sits.</p>
        </section>
      )}
    </>
  );
}
