import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Navbar } from "@/components/ui/navbar";
import { Footer } from "@/components/ui/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search } from "lucide-react";
import { ResourceCard } from "@/components/ui/resource-card";
import { ResourceType } from "@/lib/types";

const skillLevels = ["All Levels", "Beginner", "Intermediate", "Advanced"];
const resourceTypes = ["All Types", "Guides", "Templates", "Webinars", "Case Studies"];

export default function Resources() {
  const [location, setLocation] = useLocation();
  
  // Parse query parameters from the URL
  const searchParams = new URLSearchParams(location.split("?")[1] || "");
  const initialSkill = searchParams.get("level") || "All Levels";
  const initialType = searchParams.get("type") || "All Types";
  const initialSearch = searchParams.get("search") || "";

  const [selectedSkill, setSelectedSkill] = useState<string>(initialSkill);
  const [selectedType, setSelectedType] = useState<string>(initialType);
  const [searchQuery, setSearchQuery] = useState<string>(initialSearch);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const resourcesPerPage = 9;

  const { data, isLoading } = useQuery({
    queryKey: ["/api/resources", selectedSkill, selectedType, searchQuery, currentPage],
  });
  
  const resources = data?.resources || [];
  const totalResources = data?.total || 0;
  const totalPages = Math.ceil(totalResources / resourcesPerPage);

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    if (selectedSkill !== "All Levels") params.set("level", selectedSkill);
    if (selectedType !== "All Types") params.set("type", selectedType);
    if (searchQuery) params.set("search", searchQuery);
    
    const newUrl = params.toString() ? `/resources?${params.toString()}` : "/resources";
    setLocation(newUrl);
  }, [selectedSkill, selectedType, searchQuery, setLocation]);

  const handleSkillClick = (skill: string) => {
    setSelectedSkill(skill);
    setCurrentPage(1);
  };

  const handleResourceTypeChange = (value: string) => {
    setSelectedType(value);
    setCurrentPage(1);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
  };

  const handleLoadMore = () => {
    setCurrentPage(prev => prev + 1);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <div className="bg-primary text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl font-bold mb-4">Disaster Recovery Resources</h1>
          <p className="text-xl">Browse our comprehensive library of educational materials</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="font-semibold text-xl mb-4">Filter Resources</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-gray-600 mb-2">Skill Level</label>
              <div className="flex flex-wrap gap-2">
                {skillLevels.map((skill) => (
                  <Button
                    key={skill}
                    variant={selectedSkill === skill ? "default" : "outline"}
                    className={
                      selectedSkill === skill
                        ? "bg-accent-50 text-accent border border-accent-200 font-medium"
                        : "bg-gray-100 text-gray-600 border border-gray-200 font-medium"
                    }
                    onClick={() => handleSkillClick(skill)}
                  >
                    {skill}
                  </Button>
                ))}
              </div>
            </div>
            
            <div>
              <label className="block text-gray-600 mb-2">Resource Type</label>
              <Select value={selectedType} onValueChange={handleResourceTypeChange}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {resourceTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="block text-gray-600 mb-2">Search</label>
              <form onSubmit={handleSearchSubmit}>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Search resources..."
                    className="w-full pl-10"
                    value={searchQuery}
                    onChange={handleSearchChange}
                  />
                </div>
              </form>
            </div>
          </div>
        </div>
        
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow-md p-6 h-48 animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-full mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-full mb-4"></div>
                <div className="flex justify-between">
                  <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <>
            {resources.length === 0 ? (
              <div className="text-center py-12">
                <h3 className="text-xl font-medium mb-2">No resources found</h3>
                <p className="text-gray-600 mb-4">Try adjusting your filters or search criteria</p>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSelectedSkill("All Levels");
                    setSelectedType("All Types");
                    setSearchQuery("");
                  }}
                >
                  Clear Filters
                </Button>
              </div>
            ) : (
              <>
                <div className="mb-6">
                  <p className="text-gray-600">
                    Showing {resources.length} of {totalResources} resources
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {resources.map((resource: ResourceType) => (
                    <ResourceCard key={resource.id} resource={resource} />
                  ))}
                </div>
                
                {currentPage < totalPages && (
                  <div className="mt-8 text-center">
                    <Button
                      className="bg-primary-50 text-primary font-medium hover:bg-primary-100 transition"
                      onClick={handleLoadMore}
                    >
                      Load More Resources
                    </Button>
                  </div>
                )}
              </>
            )}
          </>
        )}
      </div>

      <Footer />
    </div>
  );
}
