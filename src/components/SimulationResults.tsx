import { useState } from "react";
import { PeriodSummary, Artifact } from "../types/simulation";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Line, ComposedChart, ResponsiveContainer } from "recharts";
import { ChartBarIcon, CoinsIcon, DatabaseIcon } from "lucide-react";
import { Alert, AlertDescription } from "./ui/alert";
import { InfoIcon } from "lucide-react";

interface SimulationResultsProps {
  results: PeriodSummary[];
}

function ArtifactsList({ artifacts }: { artifacts: Artifact[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border">
            <th className="text-left py-2">Name</th>
            <th className="text-right py-2">Price (ETH)</th>
            <th className="text-right py-2">Creator Rewards (ETH)</th>
            <th className="text-center py-2">Status</th>
          </tr>
        </thead>
        <tbody>
          {artifacts.map((artifact) => (
            <tr key={artifact.id} className="border-b border-border/50">
              <td className="py-2">{artifact.name}</td>
              <td className="text-right">{artifact.price.toFixed(5)}</td>
              <td className="text-right">{artifact.creatorRewards.toFixed(5)}</td>
              <td className="text-center">
                <span
                  className={`inline-block px-2 py-1 rounded text-xs ${
                    artifact.sold
                      ? "bg-green-500/20 text-green-400"
                      : "bg-red-500/20 text-red-400"
                  }`}
                >
                  {artifact.sold ? "Sold" : "Not Sold"}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function SimulationResults({ results }: SimulationResultsProps) {
  const [expandedPeriod, setExpandedPeriod] = useState<number | null>(null);

  const chartData = results.map((period) => ({
    period: period.period,
    creatorRewards: Number(period.creatorRewards.toFixed(5)),
    spentOnArtifacts: Number(period.spentOnArtifacts.toFixed(5)),
    budgetLeft: Number(period.budgetLeft.toFixed(5)),
  }));

  const simulationStoppedEarly = results.length < results[0].budgetLeft && results[results.length - 1].budgetLeft < 0.00001;

  return (
    <div className="space-y-6">
      <div className="glass-card p-6">
        <h3 className="text-lg font-semibold mb-4">Simulation Results</h3>
        
        {simulationStoppedEarly && (
          <Alert className="mb-4">
            <InfoIcon className="h-4 w-4" />
            <AlertDescription>
              The simulation stopped because the remaining budget fell below the minimum threshold (0.00001 ETH).
            </AlertDescription>
          </Alert>
        )}

        <div className="h-[400px] mb-6">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={chartData} barGap={0}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis dataKey="period" stroke="#666" />
              <YAxis stroke="#666" domain={[0, 'auto']} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1A1A1A",
                  border: "1px solid #333",
                }}
                formatter={(value: number) => Math.abs(value).toFixed(5)}
              />
              <Bar dataKey="creatorRewards" fill="#00E5E5" name="Creator Rewards" />
              <Bar dataKey="spentOnArtifacts" fill="#FF4444" name="Spent on Artifacts" />
              <Line
                type="monotone"
                dataKey="budgetLeft"
                stroke="#FFAA00"
                name="Budget Left"
                dot={false}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        <div className="space-y-4">
          {results.map((period) => (
            <div key={period.period} className="glass-card p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium">Period {period.period}</h4>
                <button
                  onClick={() =>
                    setExpandedPeriod(
                      expandedPeriod === period.period ? null : period.period
                    )
                  }
                  className="text-primary hover:text-primary/80 transition-colors"
                >
                  {expandedPeriod === period.period ? "Hide Details" : "Show Details"}
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="flex items-center space-x-2">
                  <CoinsIcon className="w-5 h-5 text-primary" />
                  <div>
                    <div className="text-sm text-foreground/60">Creator Rewards</div>
                    <div className="font-medium">
                      {period.creatorRewards.toFixed(5)} ETH
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <ChartBarIcon className="w-5 h-5 text-red-400" />
                  <div>
                    <div className="text-sm text-foreground/60">Spent on Artifacts</div>
                    <div className="font-medium">
                      {period.spentOnArtifacts.toFixed(5)} ETH
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <DatabaseIcon className="w-5 h-5 text-yellow-400" />
                  <div>
                    <div className="text-sm text-foreground/60">Budget Left</div>
                    <div className="font-medium">{period.budgetLeft.toFixed(5)} ETH</div>
                  </div>
                </div>
              </div>

              {expandedPeriod === period.period && (
                <div className="mt-4 border-t border-border pt-4">
                  <h5 className="font-medium mb-2">Artifacts</h5>
                  <ArtifactsList artifacts={period.artifacts} />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}