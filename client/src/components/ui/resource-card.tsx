import { Link } from "wouter";
import { Star } from "lucide-react";
import { ResourceType } from "@/lib/types";

interface ResourceCardProps {
  resource: ResourceType;
}

export const ResourceCard = ({ resource }: ResourceCardProps) => {
  const getSkillBadgeClass = (skill: string) => {
    switch (skill.toLowerCase()) {
      case "beginner":
        return "badge-beginner";
      case "intermediate":
        return "badge-intermediate";
      case "advanced":
        return "badge-advanced";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getSkillBorderClass = (skill: string) => {
    switch (skill.toLowerCase()) {
      case "beginner":
        return "skill-beginner";
      case "intermediate":
        return "skill-intermediate";
      case "advanced":
        return "skill-advanced";
      default:
        return "";
    }
  };

  return (
    <div className={`bg-white rounded-lg shadow-md overflow-hidden ${getSkillBorderClass(resource.skillLevel)}`}>
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className={`text-xs font-semibold px-2 py-1 rounded ${getSkillBadgeClass(resource.skillLevel)}`}>
            {resource.skillLevel}
          </div>
          <div className="flex items-center">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${
                    i < Math.floor(resource.averageRating) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                  }`}
                />
              ))}
            </div>
            <span className="text-xs text-gray-500 ml-1">({resource.reviewCount})</span>
          </div>
        </div>
        <h3 className="font-semibold text-lg mb-2">{resource.title}</h3>
        <p className="text-gray-600 text-sm mb-4">{resource.description}</p>
        <div className="flex justify-between items-center">
          <span className="text-xs text-gray-500">Last updated: {new Date(resource.lastUpdated).toLocaleDateString()}</span>
          <Link href={`/resources/${resource.id}`}>
            <a className="text-primary text-sm font-medium hover:underline">Access Resource</a>
          </Link>
        </div>
      </div>
    </div>
  );
};
