/**
 * Reference observations of Messor sancta digging (Buhl et al.).
 *
 * Source used for the numbers: the open preliminary report of the same
 * experiment, Buhl, Deneubourg, Grimal & Theraulaz (2001), "Morphogenèse des
 * réseaux de galeries chez la fourmi Messor sancta", Actes des Colloques
 * Insectes Sociaux 14: 52–105. The journal article with the full analysis is
 * Buhl et al. (2005), Behav. Ecol. Sociobiol. 58: 9–17,
 * doi:10.1007/s00265-004-0906-2.
 *
 * Setup: moist sand disk 20 cm wide and 5 mm thick under glass, groups of 50,
 * 100 and 200 workers, five 3-day replicates per group size.
 */
export const BUHL_SOURCE = {
  report:
    "Buhl, Deneubourg, Grimal & Theraulaz (2001). Actes Coll. Insectes Sociaux 14: 52-105",
  reportUrl:
    "https://dictionnaire-amoureux-des-fourmis.fr/Noms%20propres/Publis/2001/ACTES-COLLOQUES-INSECTES-SOCIAUX-VOL14-Buhlf.pdf",
  article:
    "Buhl, Deneubourg, Grimal & Theraulaz (2005). Behav. Ecol. Sociobiol. 58: 9-17",
  articleDoi: "10.1007/s00265-004-0906-2",
  horizonHours: 72,
  replicatesPerGroup: 5,
} as const;

export interface BuhlGroup {
  workers: number;
  /** Table 1: mean total excavated volume after 3 days (cm³). */
  volumeCm3: number;
  /** Table 1: excavated mass rate (mg per ant per hour). */
  massRateMgPerAntHour: number;
  /** Table 1: total gallery network length (cm). */
  networkLengthCm: number;
  /** Table 1: number of galleries. */
  galleries: number;
  /**
   * Figure 2a, mean excavated volume (cm³) at 0, 12, 24, 36, 48, 60 and 72 h.
   * Read by eye from the scanned figure: treat as ±3 cm³, not as raw data.
   */
  curveCm3: readonly number[];
}

export const BUHL_CURVE_HOURS = [0, 12, 24, 36, 48, 60, 72] as const;

export const BUHL_GROUPS: readonly BuhlGroup[] = [
  {
    workers: 50,
    volumeCm3: 25.25,
    massRateMgPerAntHour: 10.4,
    networkLengthCm: 79.8,
    galleries: 23.6,
    curveCm3: [0, 6, 12, 16.5, 20.5, 23, 25],
  },
  {
    workers: 100,
    volumeCm3: 37.49,
    massRateMgPerAntHour: 7.7,
    networkLengthCm: 115.6,
    galleries: 40.2,
    curveCm3: [0, 10, 19, 26, 31, 34, 37],
  },
  {
    workers: 200,
    volumeCm3: 60.9,
    massRateMgPerAntHour: 6.4,
    networkLengthCm: 199.3,
    galleries: 85.4,
    curveCm3: [0, 17, 31, 39, 47, 54, 59],
  },
];
