import { useMemo, useState } from 'react';
import ShellGlyph from '../components/ShellGlyph';
import Rarity from '../components/Rarity';
import { SPECIES } from '../data/species';
import type { Region, Species } from '../data/types';
import { countFor, fmtInt, loadManualFound, saveManualFound, RARITY_LABEL } from '../lib/stats';

type Status = 'all' | 'found' | 'missing';
const REGIONS: Region[] = ['Southwest Florida', 'World'];

export default function FieldGuide() {
  const [region, setRegion] = useState<Region>('Southwest Florida');
  const [status, setStatus] = useState<Status>('all');
  const [manual, setManual] = useState<Set<string>>(loadManualFound);

  const isFound = (s: Species) => countFor(s.id) > 0 || manual.has(s.id);
  const toggle = (id: string) => {
    const next = new Set(manual);
    if (next.has(id)) next.delete(id); else next.add(id);
    setManual(next);
    saveManualFound(next);
  };

  const progress = REGIONS.map((r) => {
    const all = SPECIES.filter((s) => s.region === r);
    return { region: r, total: all.length, found: all.filter(isFound).length };
  });

  const tiers = useMemo(() => {
    const inRegion = SPECIES.filter((s) => s.region === region && s.id !== 'unknown');
    const shown = inRegion.filter((s) => status === 'all' || (status === 'found') === isFound(s));
    return [5, 4, 3, 2, 1].map((r) => ({
      rarity: r,
      total: inRegion.filter((s) => s.rarity === r).length,
      found: inRegion.filter((s) => s.rarity === r && isFound(s)).length,
      items: shown.filter((s) => s.rarity === r).sort((a, b) => Number(isFound(b)) - Number(isFound(a)) || a.common.localeCompare(b.common)),
    })).filter((t) => t.total > 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [region, status, manual]);

  const nextTargets = SPECIES.filter((s) => s.region === region && !isFound(s) && s.rarity <= 3).sort((a, b) => a.rarity - b.rarity).slice(0, 3);

  return (
    <>
      <section className="hero hero--compact">
        <p className="eyebrow">Field guide</p>
        <h1>The ones still out there.</h1>
        <p className="lede">Every species worth going after, sorted from grail to everyday. Filled plates are in the cabinet; outlined ones are the reason to keep walking the tide line.</p>
      </section>

      <section className="progress-row">
        {progress.map((p) => (
          <button key={p.region} className={`progress ${region === p.region ? 'on' : ''}`} onClick={() => setRegion(p.region)}>
            <Ring pct={p.found / p.total} />
            <span>
              <span className="progress-title">{p.region}</span>
              <span className="progress-sub">{p.found} of {p.total} species</span>
            </span>
          </button>
        ))}
        <div className="targets">
          <span className="progress-title">Easy wins next</span>
          {nextTargets.length ? nextTargets.map((s) => <a key={s.id} href={`#/library/${s.id}`}>{s.common} <Rarity level={s.rarity} showLabel={false} /></a>) : <span className="progress-sub">Nothing easy left — only the hard ones remain.</span>}
        </div>
      </section>

      <div className="toolbar">
        <div className="seg" role="group" aria-label="Show">
          {(['all', 'found', 'missing'] as Status[]).map((s) => (
            <button key={s} className={status === s ? 'on' : ''} onClick={() => setStatus(s)}>{s[0].toUpperCase() + s.slice(1)}</button>
          ))}
        </div>
        <span className="toolbar-count">Tap an outlined plate to mark it found by hand — the mark is remembered on this device until it lands in the inventory.</span>
      </div>

      {tiers.map((t) => (
        <section key={t.rarity} className="tier">
          <header className="tier-head">
            <h2><Rarity level={t.rarity} showLabel={false} /> {RARITY_LABEL[t.rarity]}</h2>
            <span className="tier-progress">{t.found} / {t.total}</span>
          </header>
          {t.items.length === 0 ? <p className="muted tier-empty">Nothing to show with this filter.</p> : (
            <div className="grid grid--guide">
              {t.items.map((s) => {
                const n = countFor(s.id);
                const found = isFound(s);
                const manualOnly = found && n === 0;
                return (
                  <div key={s.id} className={`plate plate--guide ${found ? 'found' : 'missing'}`}>
                    <a href={`#/library/${s.id}`} className="plate-link" aria-label={`Open ${s.common}`}>
                      <ShellGlyph glyph={s.glyph} palette={s.palette} size={84} muted={!found} />
                      <span className="plate-name">{s.common}</span>
                      <span className="plate-sci">{s.scientific}</span>
                    </a>
                    {found ? (
                      <span className="seal" title={manualOnly ? 'Marked found by hand' : `${fmtInt(n)} in the collection`}>
                        {manualOnly ? '✓' : fmtInt(n)}
                      </span>
                    ) : (
                      <button className="mark" onClick={() => toggle(s.id)}>Mark found</button>
                    )}
                    {manualOnly && <button className="unmark" onClick={() => toggle(s.id)}>undo</button>}
                    <span className="plate-habitat">{s.habitat}</span>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      ))}
    </>
  );
}

function Ring({ pct }: { pct: number }) {
  const r = 26;
  const c = 2 * Math.PI * r;
  return (
    <svg viewBox="0 0 64 64" width="64" height="64" className="ring" aria-hidden="true">
      <circle cx="32" cy="32" r={r} className="ring-bg" />
      <circle cx="32" cy="32" r={r} className="ring-fg" strokeDasharray={`${c * pct} ${c}`} transform="rotate(-90 32 32)" />
      <text x="32" y="36" textAnchor="middle">{Math.round(pct * 100)}%</text>
    </svg>
  );
}
