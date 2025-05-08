import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
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
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Download, HelpCircle, Save } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface CostItem {
  name: string;
  description: string;
  baseMonthly: number;
  baseYearly: number;
  value: number;
  enabled: boolean;
}

interface StorageCost {
  type: string;
  costPerGB: number;
  amount: number;
}

interface DiscountTier {
  min: number;
  max: number | null;
  percentage: number;
}

export const CostCalculator = () => {
  const [dataVolume, setDataVolume] = useState<number>(1000);
  const [growthRate, setGrowthRate] = useState<number>(10);
  const [retentionPeriod, setRetentionPeriod] = useState<number>(30);
  const [rpo, setRpo] = useState<string>("24h");
  const [rto, setRto] = useState<string>("8h");
  const [backupType, setBackupType] = useState<string>("hybrid");
  const [region, setRegion] = useState<string>("us-east");
  const [includeCost, setIncludeCost] = useState<{ [key: string]: boolean }>({
    storage: true,
    backup: true,
    recovery: true,
    network: true,
    support: true
  });
  
  const [totalMonthlyCost, setTotalMonthlyCost] = useState<number>(0);
  const [totalYearlyCost, setTotalYearlyCost] = useState<number>(0);
  const [detailedCosts, setDetailedCosts] = useState<CostItem[]>([]);
  const [storageDetails, setStorageDetails] = useState<StorageCost[]>([]);
  
  // Define regional cost multipliers
  const regionMultipliers: { [key: string]: number } = {
    "us-east": 1.0,
    "us-west": 1.05,
    "eu-central": 1.15,
    "eu-west": 1.10,
    "ap-east": 1.20,
    "ap-south": 1.15
  };
  
  // Define RPO to backup frequency mapping
  const rpoToBackupFrequency: { [key: string]: number } = {
    "24h": 1,     // Once per day
    "12h": 2,     // Twice per day
    "6h": 4,      // Four times per day
    "1h": 24,     // Hourly
    "15m": 96,    // Every 15 minutes
    "5m": 288,    // Every 5 minutes
    "0m": 8640    // "Continuous" (approx. every 10 seconds)
  };
  
  // Define RTO to recovery infrastructure cost mapping (higher = more expensive)
  const rtoToInfraMultiplier: { [key: string]: number } = {
    "72h": 0.5,   // Very slow recovery
    "48h": 0.7,   // Slow recovery
    "24h": 0.9,   // Standard recovery
    "8h": 1.2,    // Fast recovery
    "4h": 1.5,    // Very fast recovery
    "1h": 2.0,    // Near-immediate recovery
    "0h": 3.0     // Immediate recovery (hot standby)
  };
  
  // Define backup type base costs and multipliers
  const backupTypes: { [key: string]: {name: string, multiplier: number, baseCost: number} } = {
    "local": {
      name: "Local Backup",
      multiplier: 0.8,
      baseCost: 50
    },
    "cloud": {
      name: "Cloud Backup",
      multiplier: 1.0,
      baseCost: 200
    },
    "hybrid": {
      name: "Hybrid Backup",
      multiplier: 1.2,
      baseCost: 300
    },
    "multicloud": {
      name: "Multi-Cloud Backup",
      multiplier: 1.5,
      baseCost: 500
    },
  };
  
  // Storage costs per GB per month by type
  const storageCosts: { [key: string]: number } = {
    "hot": 0.023,      // Hot storage (frequently accessed)
    "warm": 0.015,     // Warm storage (occasionally accessed)
    "cold": 0.004,     // Cold storage (rarely accessed)
    "archive": 0.001   // Archive storage (very rarely accessed)
  };
  
  // Volume discount tiers
  const discountTiers: DiscountTier[] = [
    { min: 0, max: 10000, percentage: 0 },
    { min: 10000, max: 50000, percentage: 10 },
    { min: 50000, max: 100000, percentage: 15 },
    { min: 100000, max: null, percentage: 20 }
  ];
  
  // Calculate the discount based on data volume
  const calculateVolumeDiscount = (volume: number): number => {
    const tier = discountTiers.find(tier => 
      volume >= tier.min && (tier.max === null || volume < tier.max)
    );
    return tier ? tier.percentage / 100 : 0;
  };
  
  // Calculate storage distribution based on retention and access patterns
  const calculateStorageDistribution = (): StorageCost[] => {
    let totalData = dataVolume;
    
    // Assume distribution changes based on retention period
    let hotPercentage = 0.3;
    let warmPercentage = 0.3;
    let coldPercentage = 0.3;
    let archivePercentage = 0.1;
    
    // Adjust percentages based on retention period
    if (retentionPeriod <= 7) {
      // Short retention - more hot storage
      hotPercentage = 0.6;
      warmPercentage = 0.3;
      coldPercentage = 0.1;
      archivePercentage = 0;
    } else if (retentionPeriod <= 30) {
      // Medium retention
      hotPercentage = 0.3;
      warmPercentage = 0.4;
      coldPercentage = 0.2;
      archivePercentage = 0.1;
    } else if (retentionPeriod <= 90) {
      // Longer retention
      hotPercentage = 0.2;
      warmPercentage = 0.3;
      coldPercentage = 0.3;
      archivePercentage = 0.2;
    } else {
      // Very long retention
      hotPercentage = 0.1;
      warmPercentage = 0.2;
      coldPercentage = 0.3;
      archivePercentage = 0.4;
    }
    
    // Adjust for RTO - faster RTO needs more hot storage
    if (rto === "0h" || rto === "1h") {
      hotPercentage += 0.2;
      warmPercentage += 0.1;
      coldPercentage -= 0.1;
      archivePercentage -= 0.2;
    } else if (rto === "4h") {
      hotPercentage += 0.1;
      warmPercentage += 0.1;
      coldPercentage -= 0.1;
      archivePercentage -= 0.1;
    }
    
    // Ensure percentages are valid
    archivePercentage = Math.max(0, archivePercentage);
    coldPercentage = Math.max(0, coldPercentage);
    
    // Normalize percentages to sum to 1
    const total = hotPercentage + warmPercentage + coldPercentage + archivePercentage;
    hotPercentage /= total;
    warmPercentage /= total;
    coldPercentage /= total;
    archivePercentage /= total;
    
    return [
      { type: "Hot Storage", costPerGB: storageCosts.hot, amount: Math.round(totalData * hotPercentage) },
      { type: "Warm Storage", costPerGB: storageCosts.warm, amount: Math.round(totalData * warmPercentage) },
      { type: "Cold Storage", costPerGB: storageCosts.cold, amount: Math.round(totalData * coldPercentage) },
      { type: "Archive Storage", costPerGB: storageCosts.archive, amount: Math.round(totalData * archivePercentage) }
    ];
  };
  
  const calculateCosts = () => {
    const regionMultiplier = regionMultipliers[region];
    const backupFrequency = rpoToBackupFrequency[rpo];
    const rtoMultiplier = rtoToInfraMultiplier[rto];
    const backupInfo = backupTypes[backupType];
    const backupMultiplier = backupInfo.multiplier;
    const volumeDiscount = calculateVolumeDiscount(dataVolume);
    
    // Calculate storage costs
    const storageDistribution = calculateStorageDistribution();
    setStorageDetails(storageDistribution);
    
    let totalStorageCost = 0;
    storageDistribution.forEach(item => {
      totalStorageCost += item.amount * item.costPerGB;
    });
    
    // Apply regional pricing
    totalStorageCost *= regionMultiplier;
    
    // Calculate backup processing costs based on backup frequency and volume
    const backupProcessingCost = backupInfo.baseCost * backupMultiplier * (backupFrequency / 24) * Math.log10(dataVolume / 100);
    
    // Recovery preparation infrastructure cost based on RTO
    const recoveryInfraCost = 200 * rtoMultiplier * (dataVolume / 1000);
    
    // Network egress costs (estimated)
    const networkCost = 0.08 * (dataVolume * 0.1); // Assume 10% of data is transferred out monthly
    
    // Support costs
    const supportCost = 100 + (0.05 * (backupProcessingCost + recoveryInfraCost));
    
    // Create detailed cost breakdown
    const costItems: CostItem[] = [
      {
        name: "Storage Costs",
        description: "Cost of storing your backup data across different storage tiers",
        baseMonthly: totalStorageCost,
        baseYearly: totalStorageCost * 12,
        value: includeCost.storage ? totalStorageCost : 0,
        enabled: includeCost.storage
      },
      {
        name: "Backup Processing",
        description: `Cost of performing backups at your selected RPO (${rpo})`,
        baseMonthly: backupProcessingCost,
        baseYearly: backupProcessingCost * 12,
        value: includeCost.backup ? backupProcessingCost : 0,
        enabled: includeCost.backup
      },
      {
        name: "Recovery Infrastructure",
        description: `Infrastructure required to meet your RTO of ${rto}`,
        baseMonthly: recoveryInfraCost,
        baseYearly: recoveryInfraCost * 12,
        value: includeCost.recovery ? recoveryInfraCost : 0,
        enabled: includeCost.recovery
      },
      {
        name: "Network Costs",
        description: "Cost of data transfer during backup and recovery operations",
        baseMonthly: networkCost,
        baseYearly: networkCost * 12,
        value: includeCost.network ? networkCost : 0,
        enabled: includeCost.network
      },
      {
        name: "Support & Maintenance",
        description: "Ongoing support and maintenance of your backup solution",
        baseMonthly: supportCost,
        baseYearly: supportCost * 12,
        value: includeCost.support ? supportCost : 0,
        enabled: includeCost.support
      }
    ];
    
    setDetailedCosts(costItems);
    
    // Calculate monthly and yearly total costs
    let monthlyTotal = costItems.reduce((sum, item) => sum + item.value, 0);
    let yearlyTotal = monthlyTotal * 12;
    
    // Apply volume discount
    if (volumeDiscount > 0) {
      monthlyTotal = monthlyTotal * (1 - volumeDiscount);
      yearlyTotal = yearlyTotal * (1 - volumeDiscount);
    }
    
    setTotalMonthlyCost(monthlyTotal);
    setTotalYearlyCost(yearlyTotal);
  };
  
  // Recalculate when inputs change
  useEffect(() => {
    calculateCosts();
  }, [
    dataVolume, 
    growthRate, 
    retentionPeriod, 
    rpo, 
    rto, 
    backupType, 
    region, 
    includeCost
  ]);
  
  const handleIncludeCostChange = (key: string, checked: boolean) => {
    setIncludeCost({
      ...includeCost,
      [key]: checked
    });
  };
  
  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };
  
  const formatDataSize = (sizeInGB: number) => {
    if (sizeInGB < 1000) {
      return `${sizeInGB} GB`;
    } else {
      return `${(sizeInGB / 1000).toFixed(1)} TB`;
    }
  };
  
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">
            Disaster Recovery Cost Calculator
          </CardTitle>
          <CardDescription>
            Estimate the costs of different backup and disaster recovery solutions 
            for your containerized applications.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="data-volume" className="flex items-center space-x-1">
                  <span>Data Volume</span>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <HelpCircle className="h-4 w-4 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="max-w-xs">Total amount of data that needs to be backed up</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </Label>
                <div className="flex items-center space-x-2 mt-1">
                  <Slider
                    id="data-volume"
                    value={[dataVolume]}
                    min={100}
                    max={50000}
                    step={100}
                    onValueChange={(value) => setDataVolume(value[0])}
                    className="flex-grow"
                  />
                  <div className="w-20">
                    <Input
                      type="number"
                      value={dataVolume}
                      onChange={(e) => setDataVolume(Number(e.target.value))}
                      className="h-8"
                    />
                  </div>
                  <span className="text-sm text-muted-foreground w-12">GB</span>
                </div>
                <span className="text-sm text-muted-foreground">{formatDataSize(dataVolume)}</span>
              </div>

              <div>
                <Label htmlFor="growth-rate" className="flex items-center space-x-1">
                  <span>Annual Growth Rate</span>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <HelpCircle className="h-4 w-4 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="max-w-xs">Projected annual growth rate of your data</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </Label>
                <div className="flex items-center space-x-2 mt-1">
                  <Slider
                    id="growth-rate"
                    value={[growthRate]}
                    min={0}
                    max={100}
                    step={5}
                    onValueChange={(value) => setGrowthRate(value[0])}
                    className="flex-grow"
                  />
                  <div className="w-20">
                    <Input
                      type="number"
                      value={growthRate}
                      onChange={(e) => setGrowthRate(Number(e.target.value))}
                      className="h-8"
                    />
                  </div>
                  <span className="text-sm text-muted-foreground w-12">%</span>
                </div>
              </div>

              <div>
                <Label htmlFor="retention-period" className="flex items-center space-x-1">
                  <span>Retention Period</span>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <HelpCircle className="h-4 w-4 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="max-w-xs">How long backup data needs to be retained</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </Label>
                <div className="flex items-center space-x-2 mt-1">
                  <Slider
                    id="retention-period"
                    value={[retentionPeriod]}
                    min={7}
                    max={365}
                    step={1}
                    onValueChange={(value) => setRetentionPeriod(value[0])}
                    className="flex-grow"
                  />
                  <div className="w-20">
                    <Input
                      type="number"
                      value={retentionPeriod}
                      onChange={(e) => setRetentionPeriod(Number(e.target.value))}
                      className="h-8"
                    />
                  </div>
                  <span className="text-sm text-muted-foreground w-12">days</span>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="rpo" className="flex items-center space-x-1">
                  <span>Recovery Point Objective (RPO)</span>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <HelpCircle className="h-4 w-4 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="max-w-xs">Maximum acceptable amount of data loss measured in time</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </Label>
                <Select value={rpo} onValueChange={setRpo}>
                  <SelectTrigger id="rpo">
                    <SelectValue placeholder="Select RPO" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="24h">24 hours</SelectItem>
                      <SelectItem value="12h">12 hours</SelectItem>
                      <SelectItem value="6h">6 hours</SelectItem>
                      <SelectItem value="1h">1 hour</SelectItem>
                      <SelectItem value="15m">15 minutes</SelectItem>
                      <SelectItem value="5m">5 minutes</SelectItem>
                      <SelectItem value="0m">Near zero</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="rto" className="flex items-center space-x-1">
                  <span>Recovery Time Objective (RTO)</span>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <HelpCircle className="h-4 w-4 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="max-w-xs">Maximum acceptable downtime before recovery</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </Label>
                <Select value={rto} onValueChange={setRto}>
                  <SelectTrigger id="rto">
                    <SelectValue placeholder="Select RTO" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="72h">72 hours</SelectItem>
                      <SelectItem value="48h">48 hours</SelectItem>
                      <SelectItem value="24h">24 hours</SelectItem>
                      <SelectItem value="8h">8 hours</SelectItem>
                      <SelectItem value="4h">4 hours</SelectItem>
                      <SelectItem value="1h">1 hour</SelectItem>
                      <SelectItem value="0h">Near zero</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="backup-type" className="flex items-center space-x-1">
                  <span>Backup Solution Type</span>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <HelpCircle className="h-4 w-4 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="max-w-xs">Type of backup solution to implement</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </Label>
                <Select value={backupType} onValueChange={setBackupType}>
                  <SelectTrigger id="backup-type">
                    <SelectValue placeholder="Select backup type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="local">Local Backup</SelectItem>
                    <SelectItem value="cloud">Cloud Backup</SelectItem>
                    <SelectItem value="hybrid">Hybrid Backup</SelectItem>
                    <SelectItem value="multicloud">Multi-Cloud Backup</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="region" className="flex items-center space-x-1">
                  <span>Primary Region</span>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <HelpCircle className="h-4 w-4 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="max-w-xs">Primary geographic region for your backup solution</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </Label>
                <Select value={region} onValueChange={setRegion}>
                  <SelectTrigger id="region">
                    <SelectValue placeholder="Select region" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="us-east">US East</SelectItem>
                    <SelectItem value="us-west">US West</SelectItem>
                    <SelectItem value="eu-west">EU West</SelectItem>
                    <SelectItem value="eu-central">EU Central</SelectItem>
                    <SelectItem value="ap-east">Asia Pacific East</SelectItem>
                    <SelectItem value="ap-south">Asia Pacific South</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          
          <Separator />
          
          <div>
            <h3 className="text-lg font-medium mb-3">Cost Components to Include</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {Object.entries(includeCost).map(([key, value]) => (
                <div key={key} className="flex items-center space-x-2">
                  <Checkbox 
                    id={`include-${key}`} 
                    checked={value}
                    onCheckedChange={(checked) => handleIncludeCostChange(key, checked as boolean)} 
                  />
                  <Label htmlFor={`include-${key}`} className="capitalize">
                    {key} Costs
                  </Label>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Cost Breakdown</CardTitle>
          <CardDescription>
            Estimated costs for your disaster recovery solution with {backupTypes[backupType].name}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="rounded-lg border bg-card p-6 shadow-sm">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-center mb-4">
              <div>
                <h3 className="text-lg font-medium">Monthly Cost Estimate</h3>
                <div className="text-3xl font-bold text-primary mt-2">
                  {formatCurrency(totalMonthlyCost)}
                </div>
              </div>
              <div>
                <h3 className="text-lg font-medium">Annual Cost Estimate</h3>
                <div className="text-3xl font-bold text-primary mt-2">
                  {formatCurrency(totalYearlyCost)}
                </div>
                {calculateVolumeDiscount(dataVolume) > 0 && (
                  <div className="text-sm text-green-600 font-medium mt-1">
                    Includes {(calculateVolumeDiscount(dataVolume) * 100).toFixed(0)}% volume discount
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-4">Detailed Cost Breakdown</h3>
            <div className="space-y-4">
              {detailedCosts.map((item, index) => (
                <div 
                  key={index} 
                  className={`p-4 border rounded-lg ${item.enabled ? 'bg-white' : 'bg-gray-50'}`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Switch 
                        checked={item.enabled}
                        onCheckedChange={(checked) => {
                          const key = item.name.toLowerCase().split(' ')[0];
                          handleIncludeCostChange(key, checked);
                        }}
                      />
                      <div>
                        <h4 className="font-medium">{item.name}</h4>
                        <p className="text-sm text-muted-foreground">{item.description}</p>
                      </div>
                    </div>
                    <div className={`text-right ${item.enabled ? '' : 'text-muted-foreground'}`}>
                      <div className="font-medium">{formatCurrency(item.value)}/month</div>
                      <div className="text-sm">{formatCurrency(item.value * 12)}/year</div>
                    </div>
                  </div>
                  
                  {/* Show storage details for storage costs */}
                  {item.name === "Storage Costs" && item.enabled && (
                    <div className="mt-4 ml-8 border-t pt-3">
                      <h5 className="text-sm font-medium mb-2">Storage Distribution</h5>
                      <div className="space-y-2">
                        {storageDetails.map((storage, idx) => (
                          <div key={idx} className="flex justify-between text-sm">
                            <span>{storage.type} ({formatDataSize(storage.amount)})</span>
                            <span>{formatCurrency(storage.amount * storage.costPerGB)}/month</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={() => window.print()}>
            Print Estimate
          </Button>
          <Button>
            <Download className="h-4 w-4 mr-2" />
            Download Cost Report
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};