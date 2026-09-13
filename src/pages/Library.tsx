import { useMemo, useState } from 'react';
import ShellGlyph from '../components/ShellGlyph';
import Rarity from '../components/Rarity';
import { HOLDINGS, fmtInt, fmtMoney, type SpeciesHolding } from '../lib/stats';

type Sort = 'count' | 'value' | 'name' | 'rarity';

export default function Library() {
  const [sort, setSort] = useState<Sort>('count');
  const [q, setQ] = useState('');

  const list = useMemo(() => {
    const term = q.trim().toLowerCase();
    const filtered = HOLDINGS.filter((h) => h.count > 0 && (!term || h.species.common.toLowerCase().includes(term) || h.species.scientific.toLowerCase().includes(term) || h.species.family.toLowerCase().includes(term)));
    const cmp: Record<Sort, (a: SpeciesHolding, b: SpeciesHolding) => number> = {
      count: (a, b) => b.count - a.count,
      value: (a, b) => b.value - a.value,
      name: (a, b) => a.species.common.localeCompare(b.species.common),
      rarity: (a, b) => b.species.rarity - a.species.rarity || b.value - a.value,
    };
    return filtered.sort(cmp[sort]);
  }, [sort, q]);

  return (
    <>
      <section className="hero hero--compact">
        <p className="eyebrow">Library</p>
        <h1>Every species on the shelves.</h1>
        <p className="lede">Click a plate to open its drawer: the size and colour breakdown, and a few things worth knowing about the animal that made it.</p>
      </section>

      <div className="toolbar">
        <input className="search" type="search" placeholder="Search by name, family…" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Search species" />
        <div className="seg" role="group" aria-label="Sort">
          {(['count', 'value', 'name', 'rarity'] as Sort[]).map((s) => (
            <button key={s} className={sort === s ? 'on' : ''} onClick={() => setSort(s)}>{s === 'name' ? 'A–Z' : s[0].toUpperCase() + s.slice(1)}</button>
          ))}
        </div>
        <span className="toolbar-count">{list.length} species</span>
      </div>

      <section className="grid">
        {list.map((h, i) => <Card key={h.species.id} h={h} plate={i + 1} />)}
      </section>
    </>
  );
}

function Card({ h, plate }: { h: SpeciesHolding; plate: number }) {
  const s = h.species;
  // Variation strip: one segment per lot with shells, coloured by variant.
  const segs = h.lots.filter((l) => l.quantity > 0);
  const variantColours = variantPalette(h.variants, s.palette);
  return (
    <a href={`#/library/${s.id}`} className="plate plate--card">
      <span className="plate-no">Pl. {String(plate).padStart(2, '0')}</span>
      <ShellGlyph glyph={s.glyph} palette={s.palette} size={92} />
      <span className="plate-name">{s.common}</span>
      <span className="plate-sci">{s.scientific}</span>
      <span className="plate-meta">
        <b>{fmtInt(h.count)}</b> shells · {fmtMoney(h.value)}
      </span>
      <span className="strip" aria-label="Breakdown by size and colour">
        {segs.map((l, i) => (
          <span key={i} style={{ flex: l.quantity, background: variantColours[l.variant] }} title={`${l.variant || 'Standard'}${l.size ? ` · ${l.size}"` : ''}: ${l.quantity}`} />
        ))}
      </span>
      <span className="plate-foot">
        <Rarity level={s.rarity} showLabel={false} />
        <span>{h.variants.filter(Boolean).length > 1 ? `${h.variants.filter(Boolean).length} forms` : h.sizes.filter(Boolean).length > 1 ? `${h.sizes.filter(Boolean).length} size bands` : s.family}</span>
      </span>
    </a>
  );
}

/** Assign a colour to each variant label; standard/unlabelled uses the accent. */
export function variantPalette(variants: string[], palette: [string, string]): Record<string, string> {
  const named: Record<string, string> = {
    Red: '#b5432e', Orange: '#d9822b', Black: '#2a2420', White: '#e9e2d3', Light: '#d9c39a', Dark: '#5b3d2a',
    Left: '#8fa9b8', Right: '#c7b299', Albino: '#f4efe4', Pair: '#8a6d3b', Spiral: '#b08a5a', Random: '#6f5a45',
  };
  const out: Record<string, string> = {};
  const fallbacks = [palette[1], palette[0], '#a5843d', '#6f8f8a', '#8a5a6a'];
  let f = 0;
  for (const v of variants) {
    const key = v.split(' ')[0];
    out[v] = named[key] ?? named[v] ?? fallbacks[f++ % fallbacks.length];
  }
  return out;
}
