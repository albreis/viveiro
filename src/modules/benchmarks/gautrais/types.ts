export interface GraphNode {
  id: number;
  kind: string;
  x: number;
  y: number;
  radius: number;
}
export interface GraphEdge {
  from: number;
  to: number;
  width: number;
}
export interface ObservedGraph {
  nodes: readonly GraphNode[];
  edges: readonly GraphEdge[];
}
export interface GautraisPlan {
  schema: string;
  graphSetSha256: string;
  groups: {
    workers: number;
    development: string[];
    reserved: string[];
    series: boolean;
  }[];
  measurements: { frames: number[]; nominalMinutesPerFrame: number };
  evaluation: {
    developmentAnalysisOnly: boolean;
    reservedMetricsMayBeComputed: boolean;
  };
}
export interface Replica {
  id: string;
  workers: number;
  series: boolean;
}
