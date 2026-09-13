export type ShellGroup = 'Gastropod' | 'Bivalve' | 'Cephalopod' | 'Echinoderm' | 'Other';

/** Which stylised SVG silhouette to draw for a species. */
export type Glyph =
  | 'spire' | 'cone' | 'cowrie' | 'scallop' | 'clam' | 'nautilus' | 'murex'
  | 'auger' | 'abalone' | 'turban' | 'conch' | 'olive' | 'moon' | 'spindle'
  | 'whelk' | 'oyster' | 'wentletrap' | 'sundial' | 'sanddollar' | 'angelwing'
  | 'worm' | 'slipper' | 'helmet' | 'ark' | 'cerith' | 'bubble';

/** Where a species lives in the field guide. */
export type Region = 'Southwest Florida' | 'World';

export interface Species {
  id: string;
  /** the name used in the inventory sheet */
  common: string;
  scientific: string;
  family: string;
  group: ShellGroup;
  region: Region;
  habitat: string;
  /** typical adult size in inches: [min, max] */
  sizeIn: [number, number];
  /** 1 = everywhere on the beach, 5 = a grail */
  rarity: 1 | 2 | 3 | 4 | 5;
  glyph: Glyph;
  /** [base colour, accent colour] used by the glyph renderer */
  palette: [string, string];
  blurb: string;
  facts: string[];
  /** true when the rarity came from the sheet rather than an estimate */
  rarityFromSheet: boolean;
}

/** One row of the inventory: a lot of shells of one species, size band and colour. */
export interface Lot {
  speciesId: string;
  /** size band as written in the sheet, e.g. "<1", "1-2", ">5"; blank when not tracked */
  size: string;
  /** colour / form / pairing variant, e.g. "Red", "Left", "Pair", "Albino" */
  variant: string;
  /** estimated value in USD of one shell in this lot */
  unitValue: number;
  quantity: number;
  /** free-text status from the sheet, e.g. "Good", "Lost" */
  note?: string;
}

export interface NotableFind {
  speciesId: string;
  size: string;
  location: string;
  date: string;
}
