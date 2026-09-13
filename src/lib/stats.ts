import { LOTS, NOTABLE_FINDS } from '../data/inventory';
import { SPECIES, SPECIES_BY_ID } from '../data/species';
import type { Lot, Species, Region, NotableFind } from '../data/types';

export interface SpeciesHolding {
  species: Species;
  count: number;
  value: number;
  lots: Lot[];
  /** distinct variant labels (colour / form) in inventory order, '' = unlabelled */
  variants: string[];
  /** distinct size bands in inventory order */
  sizes: string[];
  finds: NotableFind[];
}

const SIZE_ORDER = ['<1', '1-1.5', '1-2', '1.5-2', '2-3', '>2', '3-4', '>3', '4-6', '>4', '>5', '6-8', '8-10', '>10', 'Albino', ''];

export function sizeRank(s: string): number {
  const i = SIZE_ORDER.indexOf(s);
  return i === -1 ? 99 : i;
}

export function buildHoldings(): SpeciesHolding[] {
  const map = new Map<string, SpeciesHolding>();
  for (const lot of LOTS) {
    const species = SPECIES_BY_ID[lot.speciesId];
    if (!species) throw new Error(`Inventory references unknown species "${lot.speciesId}"`);
    let h = map.get(lot.speciesId);
    if (!h) {
      h = { species, count: 0, value: 0, lots: [], variants: [], sizes: [], finds: [] };
      map.set(lot.speciesId, h);
    }
    h.lots.push(lot);
    h.count += lot.quantity;
    h.value += lot.quantity * lot.unitValue;
    if (!h.variants.includes(lot.variant)) h.variants.push(lot.variant);
    if (!h.sizes.includes(lot.size)) h.sizes.push(lot.size);
  }
  for (const f of NOTABLE_FINDS) map.get(f.speciesId)?.finds.push(f);
  for (const h of map.values()) h.sizes.sort((a, b) => sizeRank(a) - sizeRank(b));
  return [...map.values()];
}

export const HOLDINGS = buildHoldings();
export const HOLDINGS_BY_ID: Record<string, SpeciesHolding> = Object.fromEntries(HOLDINGS.map((h) => [h.species.id, h]));

export const TOTAL_SHELLS = HOLDINGS.reduce((n, h) => n + h.count, 0);
export const TOTAL_VALUE = HOLDINGS.reduce((n, h) => n + h.value, 0);
export const SPECIES_HELD = HOLDINGS.filter((h) => h.count > 0).length;

export function countFor(id: string): number {
  return HOLDINGS_BY_ID[id]?.count ?? 0;
}

export function regionSpecies(region: Region): Species[] {
  return SPECIES.filter((s) => s.region === region);
}

export const fmtMoney = (n: number) =>
  n.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: n % 1 ? 2 : 0 });
export const fmtInt = (n: number) => n.toLocaleString('en-US');

export const RARITY_LABEL: Record<number, string> = {
  1: 'Everyday', 2: 'Common', 3: 'Good find', 4: 'Prized', 5: 'Grail',
};

/** Manual "found" marks for species not in the inventory (stored per browser). */
const KEY = 'shell-collection:found';
export function loadManualFound(): Set<string> {
  try {
    const raw = localStorage.getItem(KEY);
    return new Set(raw ? (JSON.parse(raw) as string[]) : []);
  } catch {
    return new Set();
  }
}
export function saveManualFound(set: Set<string>) {
  try {
    localStorage.setItem(KEY, JSON.stringify([...set]));
  } catch {
    /* private window etc. — ignore */
  }
}
