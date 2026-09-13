import { RARITY_LABEL } from '../lib/stats';

/** Five little shells, filled up to the rarity level. */
export default function Rarity({ level, showLabel = true }: { level: number; showLabel?: boolean }) {
  return (
    <span className="rarity" title={`Rarity ${level} of 5 — ${RARITY_LABEL[level]}`}>
      <span className="rarity-pips" aria-hidden="true">
        {[1, 2, 3, 4, 5].map((i) => (
          <svg key={i} viewBox="0 0 100 120" width="11" height="13" className={i <= level ? 'on' : ''}>
            <path d="M50 8 L70 62 Q82 98 50 114 Q18 98 30 62 Z" />
          </svg>
        ))}
      </span>
      {showLabel && <span className="rarity-label">{RARITY_LABEL[level]}</span>}
    </span>
  );
}
