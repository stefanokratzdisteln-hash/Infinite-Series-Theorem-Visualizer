
export enum TheoremType {
  LIMIT_COMPARISON = 'Limit Comparison',
  RATIO_TEST = 'Ratio Test',
  ALTERNATING_SERIES = 'Alternating Series',
  REARRANGEMENT = 'Rearrangement'
}

export interface Point {
  n: number;
  val: number;
  label?: string;
}

export interface SeriesData {
  an: Point[];
  bn?: Point[];
  ratio?: Point[];
  partialSums?: Point[];
}
