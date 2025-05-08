import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { 
  Select, 
  SelectContent, 
  SelectGroup, 
  SelectItem, 
  SelectLabel, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, Download, FileText } from "lucide-react";

type RiskCategory = {
  id: string;
  name: string;
  description: string;
  checked: boolean;
  impact: number;
  likelihood: number;
};

type RiskMatrix = {
  [key: number]: {
    [key: number]: { level: string; color: string };
  };
};

export const RiskAssessmentTool = () => {
  const [businessType, setBusinessType] = useState<string>("");
  const [assessmentComplete, setAssessmentComplete] = useState(false);
  const [overallRiskScore, setOverallRiskScore] = useState(0);
  const [riskLevel, setRiskLevel] = useState("");
  
  // Initial risk categories
  const [riskCategories, setRiskCategories] = useState<RiskCategory[]>([
    {
      id: "data-loss",
      name: "Data Loss",
      description: "Loss of critical business data due to hardware failure, human error, or cyber attacks.",
      checked: false,
      impact: 3,
      likelihood: 3,
    },
    {
      id: "system-outage",
      name: "System Outage",
      description: "Unplanned downtime of critical systems affecting business operations.",
      checked: false,
      impact: 3,
      likelihood: 2,
    },
    {
      id: "network-failure",
      name: "Network Failure",
      description: "Loss of connectivity between systems or to external services.",
      checked: false,
      impact: 2,
      likelihood: 2,
    },
    {
      id: "ransomware",
      name: "Ransomware Attack",
      description: "Malicious encryption of data with demands for payment to restore access.",
      checked: false,
      impact: 5,
      likelihood: 3,
    },
    {
      id: "natural-disaster",
      name: "Natural Disaster",
      description: "Physical damage to infrastructure due to fire, flood, earthquake, etc.",
      checked: false,
      impact: 5,
      likelihood: 1,
    },
    {
      id: "cloud-provider",
      name: "Cloud Provider Outage",
      description: "Service disruption from your cloud infrastructure provider.",
      checked: false,
      impact: 4,
      likelihood: 2,
    },
    {
      id: "container-failure",
      name: "Container Orchestration Failure",
      description: "Failures in container management systems like Kubernetes or Docker Swarm.",
      checked: false,
      impact: 3,
      likelihood: 2,
    },
    {
      id: "config-drift",
      name: "Configuration Drift",
      description: "Inconsistencies between environments causing application failures.",
      checked: false,
      impact: 2,
      likelihood: 3,
    },
    {
      id: "ci-cd-pipeline",
      name: "CI/CD Pipeline Failure",
      description: "Failures in automated deployment processes affecting application updates.",
      checked: false,
      impact: 2,
      likelihood: 2,
    },
  ]);

  // Risk matrix levels (Impact x Likelihood)
  const riskMatrix: RiskMatrix = {
    1: {
      1: { level: "Very Low", color: "bg-green-100 text-green-800" },
      2: { level: "Low", color: "bg-green-100 text-green-800" },
      3: { level: "Low", color: "bg-green-100 text-green-800" },
      4: { level: "Medium", color: "bg-yellow-100 text-yellow-800" },
      5: { level: "Medium", color: "bg-yellow-100 text-yellow-800" },
    },
    2: {
      1: { level: "Low", color: "bg-green-100 text-green-800" },
      2: { level: "Low", color: "bg-green-100 text-green-800" },
      3: { level: "Medium", color: "bg-yellow-100 text-yellow-800" },
      4: { level: "Medium", color: "bg-yellow-100 text-yellow-800" },
      5: { level: "High", color: "bg-orange-100 text-orange-800" },
    },
    3: {
      1: { level: "Low", color: "bg-green-100 text-green-800" },
      2: { level: "Medium", color: "bg-yellow-100 text-yellow-800" },
      3: { level: "Medium", color: "bg-yellow-100 text-yellow-800" },
      4: { level: "High", color: "bg-orange-100 text-orange-800" },
      5: { level: "High", color: "bg-orange-100 text-orange-800" },
    },
    4: {
      1: { level: "Medium", color: "bg-yellow-100 text-yellow-800" },
      2: { level: "Medium", color: "bg-yellow-100 text-yellow-800" },
      3: { level: "High", color: "bg-orange-100 text-orange-800" },
      4: { level: "High", color: "bg-orange-100 text-orange-800" },
      5: { level: "Very High", color: "bg-red-100 text-red-800" },
    },
    5: {
      1: { level: "Medium", color: "bg-yellow-100 text-yellow-800" },
      2: { level: "High", color: "bg-orange-100 text-orange-800" },
      3: { level: "High", color: "bg-orange-100 text-orange-800" },
      4: { level: "Very High", color: "bg-red-100 text-red-800" },
      5: { level: "Very High", color: "bg-red-100 text-red-800" },
    },
  };

  const handleRiskToggle = (id: string, checked: boolean) => {
    setRiskCategories(
      riskCategories.map((risk) =>
        risk.id === id ? { ...risk, checked } : risk
      )
    );
  };

  const handleImpactChange = (id: string, value: number[]) => {
    setRiskCategories(
      riskCategories.map((risk) =>
        risk.id === id ? { ...risk, impact: value[0] } : risk
      )
    );
  };

  const handleLikelihoodChange = (id: string, value: number[]) => {
    setRiskCategories(
      riskCategories.map((risk) =>
        risk.id === id ? { ...risk, likelihood: value[0] } : risk
      )
    );
  };

  const calculateRisk = () => {
    const selectedRisks = riskCategories.filter((risk) => risk.checked);
    
    if (selectedRisks.length === 0) {
      setAssessmentComplete(false);
      return;
    }
    
    // Calculate the average risk score from all selected risks
    let totalRiskScore = 0;
    selectedRisks.forEach((risk) => {
      totalRiskScore += risk.impact * risk.likelihood;
    });
    
    const avgRiskScore = Math.round(totalRiskScore / selectedRisks.length);
    setOverallRiskScore(avgRiskScore);
    
    // Determine overall risk level
    if (avgRiskScore < 6) {
      setRiskLevel("Low");
    } else if (avgRiskScore < 12) {
      setRiskLevel("Medium");
    } else if (avgRiskScore < 20) {
      setRiskLevel("High");
    } else {
      setRiskLevel("Very High");
    }
    
    setAssessmentComplete(true);
  };

  const getRiskLevelClass = (level: string) => {
    switch (level) {
      case "Very Low":
        return "bg-green-100 text-green-800";
      case "Low":
        return "bg-green-100 text-green-800";
      case "Medium":
        return "bg-yellow-100 text-yellow-800";
      case "High":
        return "bg-orange-100 text-orange-800";
      case "Very High":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getRecommendations = () => {
    const recommendations = [];
    
    // Basic recommendations based on business type
    if (businessType === "e-commerce") {
      recommendations.push("Implement regular database backups with point-in-time recovery");
      recommendations.push("Establish redundant payment processing systems");
    } else if (businessType === "healthcare") {
      recommendations.push("Ensure HIPAA-compliant backup and disaster recovery processes");
      recommendations.push("Implement encrypted backup storage for patient data");
    } else if (businessType === "finance") {
      recommendations.push("Setup real-time replication for transaction data");
      recommendations.push("Implement multi-region failover capabilities");
    } else if (businessType === "manufacturing") {
      recommendations.push("Create backup systems for production control systems");
      recommendations.push("Implement offline backups of critical production data");
    } else if (businessType === "saas") {
      recommendations.push("Implement multi-region container deployment strategies");
      recommendations.push("Design for graceful service degradation during partial outages");
    }
    
    // Add recommendations based on risk levels
    const highRisks = riskCategories.filter(
      (risk) => risk.checked && risk.impact * risk.likelihood > 15
    );
    
    highRisks.forEach((risk) => {
      if (risk.id === "data-loss") {
        recommendations.push("Implement 3-2-1 backup strategy (3 copies, 2 media types, 1 offsite)");
      } else if (risk.id === "system-outage") {
        recommendations.push("Establish redundant systems with automated failover");
      } else if (risk.id === "ransomware") {
        recommendations.push("Create immutable backups that cannot be modified once created");
      } else if (risk.id === "container-failure") {
        recommendations.push("Implement multi-cluster container orchestration with automated failover");
      } else if (risk.id === "cloud-provider") {
        recommendations.push("Consider multi-cloud strategy for critical applications");
      } else if (risk.id === "natural-disaster") {
        recommendations.push("Create geographically-distributed backup sites");
      }
    });
    
    return recommendations;
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">
            Disaster Recovery Risk Assessment Tool
          </CardTitle>
          <CardDescription>
            Evaluate potential disaster scenarios for your containerized applications and 
            receive customized recommendations for your backup and recovery strategy.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="business-type">Business Type</Label>
            <Select
              value={businessType}
              onValueChange={setBusinessType}
            >
              <SelectTrigger id="business-type" className="w-full">
                <SelectValue placeholder="Select your business type" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Business Categories</SelectLabel>
                  <SelectItem value="e-commerce">E-Commerce</SelectItem>
                  <SelectItem value="healthcare">Healthcare</SelectItem>
                  <SelectItem value="finance">Financial Services</SelectItem>
                  <SelectItem value="manufacturing">Manufacturing</SelectItem>
                  <SelectItem value="saas">Software as a Service</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <Separator className="my-4" />
          
          <div>
            <h3 className="text-lg font-medium mb-4">Select Applicable Risk Scenarios</h3>
            <div className="space-y-6">
              {riskCategories.map((risk) => (
                <div key={risk.id} className="border rounded-lg p-4 space-y-4">
                  <div className="flex items-start space-x-2">
                    <Checkbox
                      id={risk.id}
                      checked={risk.checked}
                      onCheckedChange={(checked) => 
                        handleRiskToggle(risk.id, checked as boolean)
                      }
                    />
                    <div>
                      <Label htmlFor={risk.id} className="font-medium">
                        {risk.name}
                      </Label>
                      <p className="text-sm text-muted-foreground mt-1">
                        {risk.description}
                      </p>
                    </div>
                  </div>
                  
                  {risk.checked && (
                    <div className="pl-6 grid gap-6 sm:grid-cols-2">
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <Label>Impact</Label>
                          <span className="text-sm">
                            {risk.impact} - {
                              risk.impact === 1 ? "Very Low" :
                              risk.impact === 2 ? "Low" :
                              risk.impact === 3 ? "Medium" :
                              risk.impact === 4 ? "High" :
                              "Very High"
                            }
                          </span>
                        </div>
                        <Slider
                          value={[risk.impact]}
                          min={1}
                          max={5}
                          step={1}
                          onValueChange={(value) => handleImpactChange(risk.id, value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <Label>Likelihood</Label>
                          <span className="text-sm">
                            {risk.likelihood} - {
                              risk.likelihood === 1 ? "Very Low" :
                              risk.likelihood === 2 ? "Low" :
                              risk.likelihood === 3 ? "Medium" :
                              risk.likelihood === 4 ? "High" :
                              "Very High"
                            }
                          </span>
                        </div>
                        <Slider
                          value={[risk.likelihood]}
                          min={1}
                          max={5}
                          step={1}
                          onValueChange={(value) => handleLikelihoodChange(risk.id, value)}
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <div className="flex items-center space-x-2">
                          <span className="text-sm">Risk Level:</span>
                          <span className={`text-sm px-2 py-1 rounded-md ${riskMatrix[risk.impact][risk.likelihood].color}`}>
                            {riskMatrix[risk.impact][risk.likelihood].level}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={() => {
            setRiskCategories(riskCategories.map(risk => ({...risk, checked: false})));
            setAssessmentComplete(false);
          }}>
            Reset
          </Button>
          <Button onClick={calculateRisk} disabled={!businessType || !riskCategories.some(r => r.checked)}>
            Calculate Risk Assessment
          </Button>
        </CardFooter>
      </Card>

      {assessmentComplete && (
        <Card>
          <CardHeader>
            <CardTitle>Risk Assessment Results</CardTitle>
            <CardDescription>
              Based on your selected risk scenarios, here's your overall risk assessment and recommendations
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col sm:flex-row items-center justify-between bg-gray-50 p-4 rounded-lg">
              <div>
                <h3 className="font-medium text-lg">Overall Risk Score</h3>
                <p className="text-muted-foreground text-sm">
                  Calculated from your selected risk scenarios
                </p>
              </div>
              <div className="flex flex-col items-center">
                <div className="text-4xl font-bold">{overallRiskScore}/25</div>
                <span className={`mt-2 px-3 py-1 rounded-full text-sm font-medium ${getRiskLevelClass(riskLevel)}`}>
                  {riskLevel} Risk
                </span>
              </div>
            </div>

            <div>
              <h3 className="font-medium text-lg mb-4">Recommended Actions</h3>
              
              {riskLevel === "High" || riskLevel === "Very High" ? (
                <Alert variant="destructive" className="mb-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Critical Risk Level Detected</AlertTitle>
                  <AlertDescription>
                    Your environment is at significant risk. We strongly recommend implementing these 
                    measures as soon as possible.
                  </AlertDescription>
                </Alert>
              ) : null}
              
              <ul className="space-y-2">
                {getRecommendations().map((recommendation, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <div className="h-5 w-5 text-primary flex-shrink-0 mt-0.5">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span>{recommendation}</span>
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col sm:flex-row sm:justify-between gap-3">
            <Button variant="outline" className="w-full sm:w-auto" onClick={() => window.print()}>
              <FileText className="h-4 w-4 mr-2" />
              Print Assessment
            </Button>
            <Button className="w-full sm:w-auto">
              <Download className="h-4 w-4 mr-2" />
              Download Risk Assessment Form
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
};