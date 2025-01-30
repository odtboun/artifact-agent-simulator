import { Artifact, PeriodSummary, SimulationParams } from "../types/simulation";

function normalDistribution(mean: number, stdDev: number): number {
  const u1 = 1 - Math.random();
  const u2 = 1 - Math.random();
  const randStdNormal = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
  return mean + stdDev * randStdNormal;
}

function generateArtifacts(
  numArtifacts: number,
  avgPrice: number,
  creatorRewardsRate: number,
  maxPrice: number
): Artifact[] {
  const artifacts: Artifact[] = [];
  const priceStdDev = avgPrice * 0.3; // 30% of mean as standard deviation

  for (let i = 0; i < numArtifacts; i++) {
    let price = normalDistribution(avgPrice, priceStdDev);
    price = Math.max(0.00001, Math.min(maxPrice, price));
    price = Number(price.toFixed(5));

    artifacts.push({
      id: i + 1,
      name: `Artifact ${i + 1}`,
      price,
      creatorRewards: Number((price * creatorRewardsRate / 100).toFixed(5)),
      sold: false,
    });
  }

  return artifacts;
}

function selectArtifactsToBuy(
  artifacts: Artifact[],
  numToBuy: number,
  budgetPerPeriod: number
): Artifact[] {
  const shuffled = [...artifacts].sort(() => Math.random() - 0.5);
  let selected = shuffled.slice(0, numToBuy);
  
  // Sort by price descending to remove most expensive first if needed
  selected.sort((a, b) => b.price - a.price);
  
  let totalPrice = selected.reduce((sum, art) => sum + art.price, 0);
  
  // Remove expensive artifacts if over budget
  while (totalPrice > budgetPerPeriod && selected.length > 0) {
    selected.shift(); // Remove most expensive
    totalPrice = selected.reduce((sum, art) => sum + art.price, 0);
  }
  
  // Try to add cheaper artifacts if possible
  const remaining = artifacts.filter(a => !selected.includes(a));
  remaining.sort((a, b) => a.price - b.price);
  
  for (const artifact of remaining) {
    if (totalPrice + artifact.price <= budgetPerPeriod && selected.length < numToBuy) {
      selected.push(artifact);
      totalPrice += artifact.price;
    }
  }
  
  return selected;
}

export function runSimulation(params: SimulationParams): PeriodSummary[] {
  const periods: PeriodSummary[] = [];
  let currentBudget = params.budget;
  
  for (let period = 0; period < params.maxPeriods; period++) {
    if (currentBudget < 0.00001) break;
    
    // Generate number of listings
    const listingsStdDev = Math.max(1, params.avgListingsPerPeriod * 0.2);
    let numListings = Math.round(normalDistribution(params.avgListingsPerPeriod, listingsStdDev));
    numListings = Math.max(0, numListings);
    
    // Generate artifacts
    const maxPrice = Math.min(params.budgetPerPeriod, currentBudget);
    const artifacts = generateArtifacts(
      numListings,
      params.avgPricePerArtifact,
      params.creatorRewards,
      maxPrice
    );
    
    // Calculate number of artifacts to buy
    const soldPercentStdDev = 10; // 10% standard deviation
    let soldPercent = normalDistribution(params.avgPercentageSold, soldPercentStdDev);
    soldPercent = Math.max(0, Math.min(100, soldPercent));
    const numToBuy = Math.round((soldPercent / 100) * artifacts.length);
    
    // Select artifacts to buy
    const selectedArtifacts = selectArtifactsToBuy(
      artifacts,
      numToBuy,
      params.budgetPerPeriod
    );
    
    // Mark selected artifacts as sold
    selectedArtifacts.forEach(selected => {
      const artifact = artifacts.find(a => a.id === selected.id);
      if (artifact) artifact.sold = true;
    });
    
    // Calculate period summary
    const creatorRewards = artifacts.reduce((sum, a) => sum + a.creatorRewards, 0);
    const spentOnArtifacts = artifacts.reduce((sum, a) => sum + (a.sold ? a.price : 0), 0);
    currentBudget = currentBudget + creatorRewards - spentOnArtifacts;
    
    periods.push({
      period,
      creatorRewards,
      spentOnArtifacts,
      budgetLeft: currentBudget,
      artifacts,
    });
  }
  
  return periods;
}