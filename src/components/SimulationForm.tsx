import { SimulationParams } from "../types/simulation";
import { useToast } from "../hooks/use-toast";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "./ui/hover-card";
import { Info } from "lucide-react";

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
    if (params.budgetPerPeriod < 0.05 || params.budgetPerPeriod > params.budget) {
      toast({ 
        title: "Error", 
        description: `Budget per period must be between 0.05 ETH and ${params.budget} ETH (Initial Budget)` 
      });
      return;
    }
    if (params.creatorRewards < 1 || params.creatorRewards > 50) {
      toast({ title: "Error", description: "Creator rewards must be between 1% and 50%" });
      return;
    }
    if (params.avgPricePerArtifact < 0.00001 || params.avgPricePerArtifact > params.budgetPerPeriod) {
      toast({ 
        title: "Error", 
        description: `Average price per artifact must be between 0.00001 ETH and ${params.budgetPerPeriod} ETH (Budget per Period)` 
      });
      return;
    }

    onSubmit(params);
  };

  return (
    <form onSubmit={handleSubmit} className="glass-card p-6 space-y-4">
      <h2 className="text-xl font-semibold mb-4">Simulation Parameters</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <label htmlFor="budget" className="block text-sm font-medium">
              Initial Budget (ETH)
            </label>
            <HoverCard>
              <HoverCardTrigger>
                <Info className="h-4 w-4 text-foreground/60" />
              </HoverCardTrigger>
              <HoverCardContent className="w-80">
                Amount of ETH you give your agent to control. Larger values may attract more artifact creators. Don't risk more than you can afford to lose.
              </HoverCardContent>
            </HoverCard>
          </div>
          <input
            type="number"
            name="budget"
            id="budget"
            min="0.1"
            step="any"
            defaultValue="1.0"
            className="input-field w-full"
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <label htmlFor="budgetPerPeriod" className="block text-sm font-medium">
              Budget per Period (ETH)
            </label>
            <HoverCard>
              <HoverCardTrigger>
                <Info className="h-4 w-4 text-foreground/60" />
              </HoverCardTrigger>
              <HoverCardContent className="w-80">
                Max amount your agent can spend in a single round. This cannot be changed once the agent is deployed. Larger values may attract more users but also risk spending the budget faster.
              </HoverCardContent>
            </HoverCard>
          </div>
          <input
            type="number"
            name="budgetPerPeriod"
            id="budgetPerPeriod"
            min="0.05"
            step="any"
            defaultValue="0.5"
            className="input-field w-full"
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <label htmlFor="creatorRewards" className="block text-sm font-medium">
              Creator Rewards (%)
            </label>
            <HoverCard>
              <HoverCardTrigger>
                <Info className="h-4 w-4 text-foreground/60" />
              </HoverCardTrigger>
              <HoverCardContent className="w-80">
                Percentage you get from each listing based on the artifact price. Larger rates lead to more rewards per artifact but may discourage artifact creators.
              </HoverCardContent>
            </HoverCard>
          </div>
          <input
            type="number"
            name="creatorRewards"
            id="creatorRewards"
            min="1"
            max="50"
            defaultValue="30"
            className="input-field w-full"
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <label htmlFor="avgListingsPerPeriod" className="block text-sm font-medium">
              Average Listings per Period
            </label>
            <HoverCard>
              <HoverCardTrigger>
                <Info className="h-4 w-4 text-foreground/60" />
              </HoverCardTrigger>
              <HoverCardContent className="w-80">
                Estimation for artifact creator behavior. If your input is too high, you might overestimate your earnings. You can check previous agents to see how many listings they got per period.
              </HoverCardContent>
            </HoverCard>
          </div>
          <input
            type="number"
            name="avgListingsPerPeriod"
            id="avgListingsPerPeriod"
            min="1"
            defaultValue="10"
            className="input-field w-full"
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <label htmlFor="avgPricePerArtifact" className="block text-sm font-medium">
              Average Price per Artifact (ETH)
            </label>
            <HoverCard>
              <HoverCardTrigger>
                <Info className="h-4 w-4 text-foreground/60" />
              </HoverCardTrigger>
              <HoverCardContent className="w-80">
                Estimation for artifact creator behavior. If your input is too high, you might overestimate your earnings. You can check previous agents the artifact prices.
              </HoverCardContent>
            </HoverCard>
          </div>
          <input
            type="number"
            name="avgPricePerArtifact"
            id="avgPricePerArtifact"
            min="0.00001"
            step="any"
            defaultValue="0.1"
            className="input-field w-full"
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <label htmlFor="avgPercentageSold" className="block text-sm font-medium">
              Average % of Artifacts Sold
            </label>
            <HoverCard>
              <HoverCardTrigger>
                <Info className="h-4 w-4 text-foreground/60" />
              </HoverCardTrigger>
              <HoverCardContent className="w-80">
                Estimation for artifact creator behavior. If your input is too low, you might overestimate your earnings. You can check previous agents to see the sold artifacts.
              </HoverCardContent>
            </HoverCard>
          </div>
          <input
            type="number"
            name="avgPercentageSold"
            id="avgPercentageSold"
            min="0"
            max="100"
            defaultValue="10"
            className="input-field w-full"
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <label htmlFor="maxPeriods" className="block text-sm font-medium">
              Max Periods for Simulation
            </label>
            <HoverCard>
              <HoverCardTrigger>
                <Info className="h-4 w-4 text-foreground/60" />
              </HoverCardTrigger>
              <HoverCardContent className="w-80">
                Number of periods the simulation will run for if doesn't run out of budget before that number.
              </HoverCardContent>
            </HoverCard>
          </div>
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