import { SimulationParams } from "../types/simulation";
import { useToast } from "../hooks/use-toast";

interface SimulationFormProps {
  onSubmit: (params: SimulationParams) => void;
}

export default function SimulationForm({ onSubmit }: SimulationFormProps) {
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const params: SimulationParams = {
      budget: Number(formData.get("budget")),
      budgetPerPeriod: Number(formData.get("budgetPerPeriod")),
      creatorRewards: Number(formData.get("creatorRewards")),
      avgListingsPerPeriod: Number(formData.get("avgListingsPerPeriod")),
      avgPricePerArtifact: Number(formData.get("avgPricePerArtifact")),
      avgPercentageSold: Number(formData.get("avgPercentageSold")),
      maxPeriods: Number(formData.get("maxPeriods")),
    };

    // Validate inputs
    if (params.budget < 0.1) {
      toast({ title: "Error", description: "Budget must be at least 0.1 ETH" });
      return;
    }
    if (params.budgetPerPeriod < 0.05) {
      toast({ title: "Error", description: "Budget per period must be at least 0.05 ETH" });
      return;
    }
    if (params.creatorRewards < 1 || params.creatorRewards > 50) {
      toast({ title: "Error", description: "Creator rewards must be between 1% and 50%" });
      return;
    }

    onSubmit(params);
  };

  return (
    <form onSubmit={handleSubmit} className="glass-card p-6 space-y-4">
      <h2 className="text-xl font-semibold mb-4">Simulation Parameters</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label htmlFor="budget" className="block text-sm font-medium">
            Initial Budget (ETH)
          </label>
          <input
            type="number"
            name="budget"
            id="budget"
            min="0.1"
            step="0.1"
            defaultValue="1"
            className="input-field w-full"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="budgetPerPeriod" className="block text-sm font-medium">
            Budget per Period (ETH)
          </label>
          <input
            type="number"
            name="budgetPerPeriod"
            id="budgetPerPeriod"
            min="0.05"
            step="0.05"
            defaultValue="0.5"
            className="input-field w-full"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="creatorRewards" className="block text-sm font-medium">
            Creator Rewards (%)
          </label>
          <input
            type="number"
            name="creatorRewards"
            id="creatorRewards"
            min="1"
            max="50"
            defaultValue="10"
            className="input-field w-full"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="avgListingsPerPeriod" className="block text-sm font-medium">
            Average Listings per Period
          </label>
          <input
            type="number"
            name="avgListingsPerPeriod"
            id="avgListingsPerPeriod"
            min="1"
            defaultValue="5"
            className="input-field w-full"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="avgPricePerArtifact" className="block text-sm font-medium">
            Average Price per Artifact (ETH)
          </label>
          <input
            type="number"
            name="avgPricePerArtifact"
            id="avgPricePerArtifact"
            min="0.00001"
            step="0.1"
            defaultValue="0.1"
            className="input-field w-full"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="avgPercentageSold" className="block text-sm font-medium">
            Average % of Artifacts Sold
          </label>
          <input
            type="number"
            name="avgPercentageSold"
            id="avgPercentageSold"
            min="0"
            max="100"
            defaultValue="50"
            className="input-field w-full"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="maxPeriods" className="block text-sm font-medium">
            Max Periods for Simulation
          </label>
          <input
            type="number"
            name="maxPeriods"
            id="maxPeriods"
            min="1"
            defaultValue="10"
            className="input-field w-full"
          />
        </div>
      </div>

      <button
        type="submit"
        className="w-full mt-6 bg-primary text-primary-foreground font-medium py-2 rounded-md hover:bg-primary/90 transition-colors"
      >
        Run Simulation
      </button>
    </form>
  );
}