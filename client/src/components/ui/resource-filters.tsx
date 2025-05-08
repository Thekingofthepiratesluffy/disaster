import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search } from "lucide-react";
import { ResourceCard } from "@/components/ui/resource-card";
import { ResourceType } from "@/lib/types";

const skillLevels = ["Beginner", "Intermediate", "Advanced"];
const resourceTypes = ["All Types", "Guides", "Templates", "Webinars", "Case Studies"];

export const ResourceFilters = () => {
  const [selectedSkill, setSelectedSkill] = useState<string>("Beginner");
  const [selectedType, setSelectedType] = useState<string>("All Types");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const { data: resources = [], isLoading } = useQuery({
    queryKey: ["/api/resources", selectedSkill, selectedType, searchQuery],
  });

  const handleSkillClick = (skill: string) => {
    setSelectedSkill(skill);
  };

  const handleResourceTypeChange = (value: string) => {
    setSelectedType(value);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  return (
    <section id="resources" className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-10">Educational Resources</h2>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h3 className="font-semibold text-xl mb-4">Filter Resources</h3>
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {resources.map((resource: ResourceType) => (
              <ResourceCard key={resource.id} resource={resource} />
            ))}
          </div>
        )}
        
        <div className="mt-8 text-center">
          <Button
            className="bg-primary-50 text-primary font-medium hover:bg-primary-100 transition"
          >
            Load More Resources
          </Button>
        </div>
      </div>
    </section>
  );
};
