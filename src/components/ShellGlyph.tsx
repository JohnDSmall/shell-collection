import type { Glyph } from '../data/types';

interface Props {
  glyph: Glyph;
  palette: [string, string];
  size?: number;
  /** line-art only, for species not yet found */
  muted?: boolean;
  className?: string;
}

/**
 * Stylised "plate illustration" of a shell type. Everything lives in a
 * 100×120 box. Base fill + accent detail lines + a soft ink outline so the
 * cards read as engraved plates rather than clip-art.
 */
export default function ShellGlyph({ glyph, palette, size = 96, muted = false, className }: Props) {
  const [base, accent] = muted ? ['transparent', 'currentColor'] : palette;
  const ink = muted ? 'currentColor' : 'rgba(30, 26, 22, 0.55)';
  const common = { fill: base, stroke: ink, strokeWidth: 1.6, strokeLinejoin: 'round' as const };
  const line = { fill: 'none', stroke: accent, strokeWidth: 1.4, strokeLinecap: 'round' as const, opacity: muted ? 0.5 : 0.85 };
  return (
    <svg viewBox="0 0 100 120" width={size} height={size * 1.2} className={className} aria-hidden="true">
      {body(glyph, common, line, accent, muted)}
    </svg>
  );
}

type S = Record<string, unknown>;

function body(glyph: Glyph, c: S, l: S, accent: string, muted: boolean) {
  const dot = { fill: muted ? 'none' : accent, stroke: muted ? 'currentColor' : 'none', strokeWidth: 1 };
  switch (glyph) {
    case 'spire':
    case 'cerith':
      return (
        <>
          <path d="M50 6 L70 62 Q82 98 50 114 Q18 98 30 62 Z" {...c} />
          <path d="M42 30 L58 30 M37 44 L63 44 M33 58 L67 58" {...l} />
          <path d="M52 76 Q66 82 60 104" {...l} />
          {glyph === 'cerith' && <path d="M40 72 L46 72 M54 72 L60 72 M38 88 L44 88 M56 88 L62 88" {...l} />}
        </>
      );
    case 'auger':
      return (
        <>
          <path d="M50 4 L63 100 Q50 118 37 100 Z" {...c} />
          <path d="M45 24 L55 24 M43 40 L57 40 M41 56 L59 56 M40 72 L60 72 M39 88 L61 88" {...l} />
        </>
      );
    case 'cone':
      return (
        <>
          <path d="M28 26 Q50 12 72 26 L58 108 Q50 116 42 108 Z" {...c} />
          <path d="M30 26 Q50 36 70 26" {...l} />
          <path d="M36 50 L44 50 M52 46 L60 46 M40 66 L46 66 M54 62 L62 62 M42 82 L48 82 M52 78 L58 78" {...l} />
        </>
      );
    case 'cowrie':
      return (
        <>
          <ellipse cx="50" cy="60" rx="32" ry="46" {...c} />
          <path d="M50 22 Q46 60 50 98" {...l} />
          <path d="M44 34 L48 34 M44 44 L48 44 M44 54 L48 54 M44 64 L48 64 M44 74 L48 74 M44 84 L48 84 M52 30 L56 30 M52 40 L56 40 M52 50 L56 50 M52 60 L56 60 M52 70 L56 70 M52 80 L56 80" {...l} />
          <circle cx="30" cy="48" r="2.4" {...dot} />
          <circle cx="68" cy="40" r="2.2" {...dot} />
          <circle cx="66" cy="72" r="2.6" {...dot} />
          <circle cx="32" cy="76" r="2" {...dot} />
        </>
      );
    case 'scallop':
      return (
        <>
          <path d="M50 108 L12 56 Q22 12 50 10 Q78 12 88 56 Z" {...c} />
          <rect x="34" y="100" width="32" height="10" rx="2" {...c} />
          <path d="M50 106 L22 52 M50 106 L32 30 M50 106 L50 16 M50 106 L68 30 M50 106 L78 52" {...l} />
        </>
      );
    case 'clam':
      return (
        <>
          <path d="M50 14 Q92 18 90 62 Q84 106 50 108 Q16 106 10 62 Q8 18 50 14 Z" {...c} />
          <path d="M22 50 Q50 32 78 50 M18 68 Q50 52 82 68 M22 84 Q50 72 78 84" {...l} />
          <path d="M44 14 Q50 8 56 14" {...l} />
        </>
      );
    case 'ark':
      return (
        <>
          <path d="M14 30 L86 30 Q96 32 92 66 Q84 104 50 106 Q16 104 8 66 Q4 32 14 30 Z" {...c} />
          <path d="M20 30 L14 100 M32 30 L26 104 M44 30 L40 106 M56 30 L58 106 M68 30 L72 104 M80 30 L86 96" {...l} />
        </>
      );
    case 'nautilus':
      return (
        <>
          <path d="M50 110 Q4 108 6 60 Q8 14 54 12 Q94 14 92 52 Q90 84 60 84 Q36 84 36 60 Q36 42 54 42 Q68 42 68 56 Q68 66 58 66" {...c} />
          <path d="M22 96 L36 84 M12 74 L36 66 M14 44 L38 50 M30 22 L46 42 M56 14 L56 42 M80 22 L66 46 M92 52 L68 56 M86 78 L64 66" {...l} />
        </>
      );
    case 'murex':
      return (
        <>
          <path d="M50 8 L64 40 Q78 62 68 84 L58 112 L42 112 L32 84 Q22 62 36 40 Z" {...c} />
          <path d="M36 40 L18 30 L34 50 M64 40 L82 30 L66 50 M30 62 L10 58 L28 72 M70 62 L90 58 L72 72 M34 84 L18 92 L38 92 M66 84 L82 92 L62 92" {...c} />
          <path d="M44 34 L56 34 M40 50 L60 50" {...l} />
        </>
      );
    case 'abalone':
      return (
        <>
          <path d="M34 12 Q86 6 88 54 Q90 110 44 112 Q10 110 14 62 Q16 22 34 12 Z" {...c} />
          <path d="M30 24 Q70 20 72 56 Q74 96 44 100" {...l} />
          <circle cx="40" cy="20" r="2.2" {...dot} />
          <circle cx="52" cy="22" r="2.2" {...dot} />
          <circle cx="63" cy="28" r="2.2" {...dot} />
          <circle cx="72" cy="38" r="2.2" {...dot} />
          <circle cx="78" cy="50" r="2.2" {...dot} />
        </>
      );
    case 'turban':
      return (
        <>
          <path d="M50 14 L74 50 Q90 80 60 108 Q36 116 20 92 Q10 70 26 50 Z" {...c} />
          <path d="M40 40 L62 40 M30 62 Q50 54 78 60" {...l} />
          <path d="M48 76 Q68 80 62 104" {...l} />
        </>
      );
    case 'conch':
      return (
        <>
          <path d="M46 6 L60 34 Q80 60 78 90 Q76 110 58 114 L36 114 Q16 100 18 70 Q20 48 34 34 Z" {...c} />
          <path d="M36 114 Q30 80 34 44" {...l} />
          <path d="M40 24 L52 24 M36 40 L60 40" {...l} />
          <path d="M50 60 Q64 74 60 104" {...l} />
        </>
      );
    case 'helmet':
      return (
        <>
          <path d="M50 10 L80 44 Q92 70 82 100 Q76 112 60 112 L30 112 Q14 100 14 70 Q16 44 34 34 Z" {...c} />
          <path d="M30 112 Q26 70 34 40" {...l} />
          <path d="M40 30 L60 30 M42 56 L60 56 M46 78 L60 78" {...l} />
          <rect x="40" y="48" width="6" height="6" {...dot} />
          <rect x="52" y="66" width="6" height="6" {...dot} />
          <rect x="44" y="88" width="6" height="6" {...dot} />
        </>
      );
    case 'olive':
      return (
        <>
          <path d="M40 14 Q50 6 60 14 L66 30 L66 96 Q60 114 50 116 Q40 114 34 96 L34 30 Z" {...c} />
          <path d="M40 40 L44 46 L40 52 L44 58 L40 64 L44 70 L40 76 M56 36 L60 42 L56 48 L60 54 L56 60 L60 66 L56 72 L60 78" {...l} />
        </>
      );
    case 'moon':
    case 'bubble':
      return (
        <>
          <path d="M50 14 Q92 18 90 60 Q88 104 50 108 Q12 106 10 62 Q10 20 50 14 Z" {...c} />
          <path d="M54 30 Q74 36 70 56 Q66 70 52 66 Q44 62 48 52 Q52 46 58 50" {...l} />
          {glyph === 'moon' && <path d="M22 48 Q28 56 24 66 M76 48 Q70 56 74 66" {...l} />}
        </>
      );
    case 'spindle':
      return (
        <>
          <path d="M50 4 L62 34 Q80 58 70 86 L58 110 Q52 118 46 110 L30 86 Q20 58 38 34 Z" {...c} />
          <path d="M44 22 L56 22 M40 36 L60 36" {...l} />
          <path d="M34 54 Q50 48 66 54 M32 70 Q50 64 68 70 M36 88 Q50 82 64 88" {...l} />
        </>
      );
    case 'whelk':
      return (
        <>
          <path d="M50 6 L58 26 L72 40 Q84 70 66 96 L54 116 L44 116 L32 96 Q16 70 28 40 L42 26 Z" {...c} />
          <path d="M28 40 L36 34 L44 40 L52 34 L60 40 L68 34 L72 40" {...l} />
          <path d="M40 56 L46 74 L42 92 M58 54 L52 72 L58 90" {...l} />
          <path d="M44 116 Q38 90 40 66" {...l} />
        </>
      );
    case 'oyster':
      return (
        <>
          <path d="M40 14 Q84 10 90 50 Q92 90 60 108 Q24 114 12 80 Q4 40 40 14 Z" {...c} />
          <path d="M30 34 Q60 30 72 56 M24 52 Q52 50 70 74 M26 72 Q48 70 60 90" {...l} />
          <path d="M40 14 L46 6 M60 14 L66 4 M78 26 L88 20 M20 50 L10 46 M16 70 L6 70" {...l} />
        </>
      );
    case 'wentletrap':
      return (
        <>
          <path d="M50 6 L72 66 Q82 98 50 114 Q18 98 28 66 Z" {...c} />
          <path d="M44 22 L56 22 M40 36 L60 36 M36 50 L64 50 M33 64 L67 64 M31 78 L69 78 M32 92 L68 92" {...c} />
        </>
      );
    case 'sundial':
      return (
        <>
          <ellipse cx="50" cy="62" rx="44" ry="40" {...c} />
          <ellipse cx="50" cy="62" rx="32" ry="28" {...l} />
          <ellipse cx="50" cy="62" rx="20" ry="17" {...l} />
          <ellipse cx="50" cy="62" rx="8" ry="7" {...l} />
          <path d="M50 22 Q86 40 50 62 Q30 74 50 102" {...l} />
        </>
      );
    case 'sanddollar':
      return (
        <>
          <circle cx="50" cy="60" r="44" {...c} />
          <path d="M50 24 Q60 40 50 56 Q40 40 50 24 Z M78 42 Q66 52 52 56 Q60 40 78 42 Z M22 42 Q34 52 48 56 Q40 40 22 42 Z M70 88 Q58 76 52 60 Q70 70 70 88 Z M30 88 Q42 76 48 60 Q30 70 30 88 Z" {...l} />
          <path d="M50 78 L50 96 M32 66 L16 76 M68 66 L84 76 M40 40 L26 24 M60 40 L74 24" {...l} />
        </>
      );
    case 'angelwing':
      return (
        <>
          <path d="M30 8 Q70 20 82 60 Q88 96 64 112 Q34 110 26 76 Q20 40 30 8 Z" {...c} />
          <path d="M34 14 Q42 60 40 104 M44 18 Q56 60 52 108 M56 26 Q68 62 64 108 M66 36 Q78 66 72 104" {...l} />
        </>
      );
    case 'worm':
      return (
        <>
          <path d="M40 8 L52 30 Q46 44 56 52 Q70 62 58 74 Q44 86 62 96 Q76 104 66 112 L54 114 Q40 110 44 96 Q48 82 36 76 Q22 66 34 54 Q44 44 36 32 Z" {...c} />
          <path d="M44 20 L48 20 M46 40 L52 40 M56 64 L64 64 M52 90 L60 90" {...l} />
        </>
      );
    case 'slipper':
      return (
        <>
          <path d="M14 76 Q22 28 56 26 Q90 28 88 74 Q86 104 50 106 Q14 104 14 76 Z" {...c} />
          <path d="M20 66 Q50 54 80 66" {...l} />
          <path d="M28 44 Q50 36 72 44" {...l} />
        </>
      );
    default:
      return <ellipse cx="50" cy="60" rx="30" ry="44" {...c} />;
  }
}
