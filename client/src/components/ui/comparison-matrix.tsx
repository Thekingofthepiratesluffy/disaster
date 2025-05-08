import { useQuery } from "@tanstack/react-query";
import { Download, Star, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StrategyType } from "@/lib/types";

export const ComparisonMatrix = () => {
  const { data: strategies = [], isLoading } = useQuery({
    queryKey: ["/api/strategy-comparison"],
  });

  const renderCost = (cost: number) => {
    return (
      <div className="flex">
        {[...Array(3)].map((_, i) => (
          <DollarSign
            key={i}
            className={`h-4 w-4 ${i < cost ? "text-accent fill-accent" : "text-gray-300"}`}
          />
        ))}
      </div>
    );
  };

  const renderComplexity = (complexity: number) => {
    return (
      <div className="flex">
        {[...Array(3)].map((_, i) => (
          <Star key={i} className={`h-4 w-4 ${i < complexity ? "text-yellow-500 fill-yellow-500" : "text-gray-300"}`} />
        ))}
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="bg-gray-50 rounded-lg shadow-md p-6">
        <h3 className="font-semibold text-xl mb-4">Strategy Comparison Matrix</h3>
        <p className="text-gray-600 mb-6">Loading comparison data...</p>
        <div className="animate-pulse">
          <div className="h-64 bg-gray-200 rounded-md"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 rounded-lg shadow-md p-6">
      <h3 className="font-semibold text-xl mb-4">Strategy Comparison Matrix</h3>
      <p className="text-gray-600 mb-6">
        Compare different backup and recovery strategies based on key metrics.
      </p>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-200 p-3 text-left text-sm font-semibold">Strategy</th>
              <th className="border border-gray-200 p-3 text-left text-sm font-semibold">RTO</th>
              <th className="border border-gray-200 p-3 text-left text-sm font-semibold">RPO</th>
              <th className="border border-gray-200 p-3 text-left text-sm font-semibold">Cost</th>
              <th className="border border-gray-200 p-3 text-left text-sm font-semibold">Complexity</th>
            </tr>
          </thead>
          <tbody>
            {strategies.map((strategy: StrategyType) => (
              <tr key={strategy.id}>
                <td className="border border-gray-200 p-3">{strategy.name}</td>
                <td className="border border-gray-200 p-3">{strategy.rto}</td>
                <td className="border border-gray-200 p-3">{strategy.rpo}</td>
                <td className="border border-gray-200 p-3">{renderCost(strategy.cost)}</td>
                <td className="border border-gray-200 p-3">{renderComplexity(strategy.complexity)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6">
        <Button variant="link" className="text-primary font-medium hover:underline flex items-center">
          <span>Download full comparison guide</span>
          <Download className="h-4 w-4 ml-1" />
        </Button>
      </div>
    </div>
  );
};
