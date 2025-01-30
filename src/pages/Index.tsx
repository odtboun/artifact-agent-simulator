import { useState } from "react";
import SimulationForm from "../components/SimulationForm";
import SimulationResults from "../components/SimulationResults";
import { PeriodSummary, SimulationParams } from "../types/simulation";
import { runSimulation } from "../utils/simulation";

export default function Index() {
  const [results, setResults] = useState<PeriodSummary[] | null>(null);

  const handleSimulation = (params: SimulationParams) => {
    const simulationResults = runSimulation(params);
    setResults(simulationResults);
  };

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-2">Swan Agent Economics Simulator</h1>
          <p className="text-foreground/60">
            Simulate your AI agent's economic behavior and analyze the results
          </p>
        </div>

        <SimulationForm onSubmit={handleSimulation} />
        
        {results && <SimulationResults results={results} />}
      </div>
    </div>
  );
}