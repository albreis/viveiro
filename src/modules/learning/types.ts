export interface TinyBrain {
  version: 1;
  inputs: 6;
  hidden: 8;
  input: number[];
  bias: number[];
  output: number[];
  offset: number;
}
export interface LearningTrace {
  features: number[];
  reward: number;
  tick: number;
  from: number;
  finished?: boolean;
}
export interface LearningState {
  version: 1;
  enabled: boolean;
  brain: TinyBrain;
  decisions: number;
  updates: number;
  reward: number;
  training?: TrainingReport;
}
export interface PolicyScore {
  deliveries: number;
  episodes: number;
  meanSteps: number;
  meanReward: number;
  hazards: number;
}
export interface TrainingReport {
  seed: string;
  episodes: number;
  trained: PolicyScore;
  baseline: PolicyScore;
  untrained: PolicyScore;
}
export interface TrainingResult {
  brain: TinyBrain;
  report: TrainingReport;
}
