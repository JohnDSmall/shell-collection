import type { Lot, NotableFind } from './types';

// Transcribed from the "detailed inventory" tab of the Google Sheet on 2026-09-12.
// Each row = [speciesId, size band, variant, unit value, quantity, note?]
// Rows with quantity 0 are kept so the size/colour grid shows the gaps.
type L = [string, string, string, number, number, string?];

const lots: L[] = [
  // True Tulip — red vs orange forms
  ['true-tulip', '>5', 'Red', 50, 1, 'Good'],
  ['true-tulip', '3-4', 'Red', 20, 1],
  ['true-tulip', '2-3', 'Red', 12, 5],
  ['true-tulip', '1-2', 'Red', 6, 13],
  ['true-tulip', '<1', 'Red', 3, 4],
  ['true-tulip', '>5', 'Orange', 50, 0],
  ['true-tulip', '3-4', 'Orange', 20, 0],
  ['true-tulip', '2-3', 'Orange', 12, 5],
  ['true-tulip', '1-2', 'Orange', 6, 14],
  ['true-tulip', '<1', 'Orange', 3, 9],

  ['banded-tulip', '<1', '', 1, 50, 'Good'],
  ['banded-tulip', '1-2', '', 2, 316],
  ['banded-tulip', '2-3', '', 3, 247],
  ['banded-tulip', '3-4', '', 8, 2],
  ['banded-tulip', '>4', '', 15, 0],

  ['nutmeg', '<1', 'Light', 1, 41, 'Good'],
  ['nutmeg', '1-1.5', 'Light', 1, 47],
  ['nutmeg', '1.5-2', 'Light', 1, 7],
  ['nutmeg', '>2', 'Light', 2, 0],
  ['nutmeg', '<1', 'Dark', 1, 17],
  ['nutmeg', '1-1.5', 'Dark', 1, 47],
  ['nutmeg', '1.5-2', 'Dark', 1, 5],
  ['nutmeg', '>2', 'Dark', 2, 1],

  ['lace-murex', '<1', '', 1, 62, 'Good'],
  ['lace-murex', '1-2', '', 2, 130],
  ['lace-murex', '2-3', '', 3, 22],
  ['lace-murex', '3-4', '', 5, 1],
  ['lace-murex', '>4', '', 10, 0],

  ['florida-cone', '', '', 2, 220, 'Good'],

  ['jewel-box', '', 'Individual - Spiny', 2, 44],
  ['jewel-box', '', 'Individual - Dull', 1, 32, 'Good'],
  ['jewel-box', '', 'Pair', 4, 9],

  ['alphabet-cone', '<1', 'Light', 8, 4, 'Good'],
  ['alphabet-cone', '1-1.5', 'Light', 8, 18],
  ['alphabet-cone', '1.5-2', 'Light', 10, 25],
  ['alphabet-cone', '2-3', 'Light', 20, 13],
  ['alphabet-cone', '>3', 'Light', 50, 1],
  ['alphabet-cone', '<1', 'Dark', 4, 1],
  ['alphabet-cone', '1-1.5', 'Dark', 6, 9],
  ['alphabet-cone', '1.5-2', 'Dark', 10, 29],
  ['alphabet-cone', '2-3', 'Dark', 20, 7],
  ['alphabet-cone', '>3', 'Dark', 50, 0],

  ['lettered-olive', '', '', 1, 245],

  ['horse-conch', '<1', '', 1, 95],
  ['horse-conch', '1-2', '', 2, 86],
  ['horse-conch', '2-3', '', 4, 28, 'Good'],
  ['horse-conch', '3-4', '', 8, 9],
  ['horse-conch', '4-6', '', 15, 3],
  ['horse-conch', '6-8', '', 25, 1],
  ['horse-conch', '8-10', '', 50, 2],
  ['horse-conch', '>10', '', 75, 1],

  ['moon-shell', '', '', 1, 132, 'Good'],

  ['lightning-whelk', '<1', '', 1, 121],
  ['lightning-whelk', '1-2', '', 1, 381, 'Good'],
  ['lightning-whelk', '2-3', '', 2, 238],
  ['lightning-whelk', '3-4', '', 4, 155],
  ['lightning-whelk', '4-6', '', 8, 30],
  ['lightning-whelk', '6-8', '', 15, 5],
  ['lightning-whelk', '8-10', '', 25, 4],
  ['lightning-whelk', '>10', '', 50, 1],

  ['shark-eye', '', '', 1, 133, 'Good'],

  ['apple-murex', '', '', 2, 249, 'Good'],

  ['angel-wing', '<1', 'Right', 10, 0],
  ['angel-wing', '1-2', 'Right', 10, 1],
  ['angel-wing', '2-3', 'Right', 10, 1, 'Good'],
  ['angel-wing', '3-4', 'Right', 15, 1],
  ['angel-wing', '4-6', 'Right', 20, 0],
  ['angel-wing', '6-8', 'Right', 30, 1],
  ['angel-wing', '<1', 'Left', 10, 0],
  ['angel-wing', '1-2', 'Left', 10, 0],
  ['angel-wing', '2-3', 'Left', 10, 0],
  ['angel-wing', '3-4', 'Left', 15, 3],
  ['angel-wing', '4-6', 'Left', 20, 6],
  ['angel-wing', '6-8', 'Left', 30, 0],

  ['kings-crown', '<1', '', 1, 12, 'Good'],
  ['kings-crown', '1-2', '', 2, 32],
  ['kings-crown', '>2', '', 4, 9],

  ['pear-whelk', '<1', '', 1, 21],
  ['pear-whelk', '1-2', '', 1, 67],
  ['pear-whelk', '2-3', '', 2, 29, 'Good'],
  ['pear-whelk', '3-4', '', 4, 3],
  ['pear-whelk', '>4', '', 8, 2],

  ['fig-shell', '<1', '', 1, 10],
  ['fig-shell', '1-2', '', 1, 17, 'Good'],
  ['fig-shell', '2-3', '', 2, 19],
  ['fig-shell', '3-4', '', 4, 3],
  ['fig-shell', '>4', '', 8, 0],

  ['florida-conch', '', 'Albino', 4, 3],
  ['florida-conch', '<1', '', 1, 90, 'Lost'],
  ['florida-conch', '1-2', '', 1, 88],
  ['florida-conch', '2-3', '', 2, 166],
  ['florida-conch', '>3', '', 3, 17],

  ['top-shell', '', '', 1, 45, 'Good'],
  ['lions-paw', '', '', 50, 1, 'Good'],
  ['sundial', '', '', 0.5, 71, 'Good'],
  ['turkey-wing', '', '', 0.5, 44, 'Good'],
  ['tinted-cantharus', '', '', 0.5, 94],
  ['mauve-mouth-drill', '', '', 0.5, 34],
  ['chestnut-turban', '', '', 1, 93, 'Good'],

  ['worm-shell', '', 'Spiral', 1, 69],
  ['worm-shell', '', 'Random', 1, 82, 'Good'],

  ['scallop', '', 'Orange', 0.5, 23],
  ['scallop', '', 'Black', 0.5, 3],
  ['scallop', '', 'Red', 0.5, 26, 'Good'],
  ['scallop', '', 'White', 0.5, 8],

  ['dark-cerith', '', '', 0.5, 190, 'Good'],
  ['auger', '', '', 0.5, 210, 'Good'],
  ['kittens-paw', '', '', 1, 2],
  ['bubble-shell', '', '', 1, 12],
  ['sharp-rib-drill', '', '', 1, 4],

  ['jingle', '', 'Orange', 0.5, 0],
  ['jingle', '', 'Black', 0.5, 0],
  ['jingle', '', 'White', 0.5, 2],

  ['butterfly', '', 'Together - All', 4, 1],
  ['butterfly', '', 'Individual - All', 0.5, 8],

  ['fly-speck-cerith', '', '', 1, 5],
  ['costate-horn-snail', '', '', 3, 4],
  ['wentletrap', '', '', 5, 2],
  ['unknown', '', '', 2, 3],
  ['dusky-cone', '', '', 1, 17],
  ['prickly-cockle', '', '', 1, 3],
  ['smooth-slipper', '', '', 0.5, 5],

  ['buttercup-clam', '', 'Pair', 2, 1],
  ['buttercup-clam', '', 'Individual', 1, 5],

  ['sand-dollar', '', '', 0, 0],
  ['cabrit-murex', '', '', 15, 1],
  ['rose-murex', '', '', 20, 3],
  ['coffee-melampus', '', '', 4, 1],
  ['yellow-egg-cockle', '', '', 2, 3],
  ['sunray-venus', '', '', 2, 2],
  ['cross-barred-venus', '', '', 1, 1],
];

export const LOTS: Lot[] = lots.map(([speciesId, size, variant, unitValue, quantity, note]) => ({
  speciesId, size, variant, unitValue, quantity, note,
}));

/** The "Shell / Size / Location / Date" tab. */
export const NOTABLE_FINDS: NotableFind[] = [
  { speciesId: 'lions-paw', size: '1 inch', location: 'Sanibel Island', date: 'December 2020' },
  { speciesId: 'horse-conch', size: '8 inches', location: 'Sanibel Island', date: 'February 2021' },
  { speciesId: 'alphabet-cone', size: '3 inches', location: 'Shell Island', date: 'January 2022' },
];

/** Open curation tasks from the sheet. */
export const TODO: string[] = [
  'Identify all albinos',
  'Split ribbed and tinted cantharus',
  'Identify false and real angel wings',
];

/** Storage & equipment notes from the sheet. */
export const NEEDS_STORAGE: string[] = [
  'Sundials',
  'Scallops — by colour',
  'Jingles — by colour',
  'Butterfly shells — by colour',
  'Driftwood?',
];

export const EQUIPMENT: { item: string; kind: string }[] = [
  { item: 'Dental picks', kind: 'Cleaning' },
  { item: 'Dremel', kind: 'Cleaning' },
  { item: 'Storage for shells', kind: 'Storage' },
];

/** Where the collection lives, for the dashboard masthead. */
export const HOME_WATERS = 'Southwest Florida · Sanibel Island';
