export interface SimulationParams {
  budget: number;
  budgetPerPeriod: number;
  creatorRewards: number;
  avgListingsPerPeriod: number;
  avgPricePerArtifact: number;
  avgPercentageSold: number;
  maxPeriods: number;
}

export interface Artifact {
  id: number;
  name: string;
  price: number;
  creatorRewards: number;
  sold: boolean;
}

export interface PeriodSummary {
  period: number;
  creatorRewards: number;
  spentOnArtifacts: number;
  budgetLeft: number;
  artifacts: Artifact[];
}