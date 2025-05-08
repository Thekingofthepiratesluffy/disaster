import { Navbar } from "@/components/ui/navbar";
import { Footer } from "@/components/ui/footer";
import { PlanningTool } from "@/components/ui/planning-tool";
import { ComparisonMatrix } from "@/components/ui/comparison-matrix";
import { ResourceLibrary } from "@/components/ui/resource-library";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEffect, useState } from "react";
import { useLocation } from "wouter";

export default function PlanningTools() {
  const [location] = useLocation();
  const [activeTab, setActiveTab] = useState("strategy-builder");

  // Parse hash from URL for direct access to specific tool
  useEffect(() => {
    const hash = location.split("#")[1];
    if (hash) {
      const validTabs = ["strategy-builder", "comparison-matrix", "cost-calculator", "risk-assessment"];
      if (validTabs.includes(hash)) {
        setActiveTab(hash);
      }
    }
  }, [location]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <div className="bg-primary text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl font-bold mb-4">Disaster Recovery Planning Tools</h1>
          <p className="text-xl">Interactive tools to help you design and implement your disaster recovery strategy</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <TabsTrigger value="strategy-builder" className="text-sm md:text-base">
              Strategy Builder
            </TabsTrigger>
            <TabsTrigger value="comparison-matrix" className="text-sm md:text-base">
              Comparison Matrix
            </TabsTrigger>
            <TabsTrigger value="cost-calculator" className="text-sm md:text-base">
              Cost Calculator
            </TabsTrigger>
            <TabsTrigger value="risk-assessment" className="text-sm md:text-base">
              Risk Assessment
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="strategy-builder" id="strategy-builder">
            <div className="max-w-2xl mx-auto">
              <h2 className="text-2xl font-bold mb-6">Interactive Backup Strategy Builder</h2>
              <p className="text-gray-600 mb-8">
                Use our interactive tool to create a personalized backup strategy based on your organization's specific requirements.
                Answer a few questions about your infrastructure, and we'll recommend the optimal disaster recovery approach.
              </p>
              <PlanningTool />
            </div>
          </TabsContent>
          
          <TabsContent value="comparison-matrix" id="comparison-matrix">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl font-bold mb-6">Strategy Comparison Matrix</h2>
              <p className="text-gray-600 mb-8">
                Compare different backup and disaster recovery strategies side by side to determine which approach
                best meets your organization's needs. Evaluate options based on recovery time, data loss potential,
                cost, and implementation complexity.
              </p>
              <ComparisonMatrix />
            </div>
          </TabsContent>
          
          <TabsContent value="cost-calculator" id="cost-calculator">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-2xl font-bold mb-6">Disaster Recovery Cost Calculator</h2>
              <p className="text-gray-600 mb-8">
                Estimate the total cost of ownership for your disaster recovery solution, including implementation,
                maintenance, and potential downtime costs. This calculator helps you build a comprehensive budget
                for your DR strategy.
              </p>
              <div className="bg-gray-50 rounded-lg shadow-md p-6 text-center">
                <p className="text-gray-600 mb-4">This tool is coming soon!</p>
                <p className="text-gray-600">
                  In the meantime, check out our TCO Calculator in the Resource Library below.
                </p>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="risk-assessment" id="risk-assessment">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-2xl font-bold mb-6">Disaster Recovery Risk Assessment</h2>
              <p className="text-gray-600 mb-8">
                Identify and prioritize the most critical risks to your infrastructure and data. This assessment
                tool helps you understand your vulnerabilities and develop a targeted disaster recovery plan.
              </p>
              <div className="bg-gray-50 rounded-lg shadow-md p-6 text-center">
                <p className="text-gray-600 mb-4">This tool is coming soon!</p>
                <p className="text-gray-600">
                  In the meantime, check out our Risk Assessment Form in the Resource Library below.
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
        
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-8">Related Resources</h2>
          <ResourceLibrary />
        </div>
      </div>

      <Footer />
    </div>
  );
}
