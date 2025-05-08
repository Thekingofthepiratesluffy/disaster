import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { apiRequest } from "@/lib/queryClient";
import { Card, CardContent } from "@/components/ui/card";
import { BackupStrategy } from "@/lib/types";

const organizationSizes = ["Small (1-50)", "Medium (51-200)", "Large (201+)"];
const rtoOptions = [
  "Immediate (0-15 minutes)",
  "Quick (15 minutes - 1 hour)",
  "Same day (1-8 hours)",
  "Next day (8-24 hours)",
  "Extended (24+ hours)",
];
const budgetOptions = ["Limited", "Moderate", "Extensive"];

export const PlanningTool = () => {
  const [orgSize, setOrgSize] = useState<string>("Small (1-50)");
  const [dataVolume, setDataVolume] = useState<number[]>([30]);
  const [rto, setRto] = useState<string>("Quick (15 minutes - 1 hour)");
  const [budget, setBudget] = useState<string>("Moderate");
  const [generatedStrategy, setGeneratedStrategy] = useState<BackupStrategy | null>(null);

  const generateMutation = useMutation({
    mutationFn: (data: any) => {
      return apiRequest("POST", "/api/planning-tool/generate", data);
    },
    onSuccess: async (response) => {
      const strategy = await response.json();
      setGeneratedStrategy(strategy);
    },
  });

  const handleOrgSizeClick = (size: string) => {
    setOrgSize(size);
  };

  const handleBudgetClick = (budgetOption: string) => {
    setBudget(budgetOption);
  };

  const handleRtoChange = (value: string) => {
    setRto(value);
  };

  const handleDataVolumeChange = (value: number[]) => {
    setDataVolume(value);
  };

  const handleGenerateStrategy = () => {
    generateMutation.mutate({
      organizationSize: orgSize,
      dataVolume: dataVolume[0],
      recoveryTimeObjective: rto,
      budget: budget,
    });
  };

  const getDataVolumeLabel = (value: number) => {
    if (value < 20) return "<1TB";
    if (value < 40) return "5TB";
    if (value < 60) return "10TB";
    if (value < 80) return "50TB";
    return "100TB+";
  };

  return (
    <div className="bg-gray-50 rounded-lg shadow-md p-6">
      <h3 className="font-semibold text-xl mb-4">Interactive Backup Planning Tool</h3>
      <p className="text-gray-600 mb-6">
        Build a personalized backup strategy based on your specific requirements and constraints.
      </p>

      <div className="space-y-6">
        <div>
          <label className="block text-gray-600 mb-2">Organization Size</label>
          <div className="flex flex-wrap gap-2">
            {organizationSizes.map((size) => (
              <Button
                key={size}
                variant={orgSize === size ? "default" : "outline"}
                className={
                  orgSize === size
                    ? "bg-primary-50 text-primary border border-primary-200 font-medium"
                    : "bg-gray-100 text-gray-600 border border-gray-200 font-medium"
                }
                onClick={() => handleOrgSizeClick(size)}
              >
                {size}
              </Button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-gray-600 mb-2">
            Data Volume ({getDataVolumeLabel(dataVolume[0])})
          </label>
          <Slider
            value={dataVolume}
            onValueChange={handleDataVolumeChange}
            max={100}
            step={1}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>&lt;1TB</span>
            <span>5TB</span>
            <span>10TB</span>
            <span>50TB</span>
            <span>100TB+</span>
          </div>
        </div>

        <div>
          <label className="block text-gray-600 mb-2">Recovery Time Objective (RTO)</label>
          <Select value={rto} onValueChange={handleRtoChange}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select RTO" />
            </SelectTrigger>
            <SelectContent>
              {rtoOptions.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="block text-gray-600 mb-2">Budget Constraints</label>
          <div className="flex flex-wrap gap-2">
            {budgetOptions.map((option) => (
              <Button
                key={option}
                variant={budget === option ? "default" : "outline"}
                className={
                  budget === option
                    ? "bg-primary-50 text-primary border border-primary-200 font-medium"
                    : "bg-gray-100 text-gray-600 border border-gray-200 font-medium"
                }
                onClick={() => handleBudgetClick(option)}
              >
                {option}
              </Button>
            ))}
          </div>
        </div>

        <div>
          <Button
            className="w-full bg-primary text-white font-semibold hover:bg-primary/90"
            onClick={handleGenerateStrategy}
            disabled={generateMutation.isPending}
          >
            {generateMutation.isPending ? "Generating..." : "Generate Backup Strategy"}
          </Button>
        </div>
      </div>

      {generateMutation.isPending && (
        <Card className="mt-6">
          <CardContent className="p-4">
            <div className="flex items-center justify-center space-x-2 animate-pulse">
              <div className="w-4 h-4 bg-primary rounded-full"></div>
              <div className="w-4 h-4 bg-primary rounded-full"></div>
              <div className="w-4 h-4 bg-primary rounded-full"></div>
            </div>
            <p className="text-center text-sm text-gray-500 mt-2">Generating your strategy...</p>
          </CardContent>
        </Card>
      )}

      {generatedStrategy && (
        <Card className="mt-6">
          <CardContent className="p-4">
            <h4 className="font-semibold text-lg mb-2">Recommended Strategy</h4>
            <p className="font-medium text-primary">{generatedStrategy.name}</p>
            <p className="text-sm text-gray-600 mt-2 mb-4">{generatedStrategy.description}</p>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Estimated Cost:</span>
                <span className="text-sm font-medium">{generatedStrategy.estimatedCost}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Implementation Time:</span>
                <span className="text-sm font-medium">{generatedStrategy.implementationTime}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Complexity:</span>
                <span className="text-sm font-medium">{generatedStrategy.complexity}</span>
              </div>
            </div>
            
            <Button className="w-full mt-4 bg-accent text-white hover:bg-accent/90">
              Download Full Strategy Report
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
