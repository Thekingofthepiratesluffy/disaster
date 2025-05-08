import { useQuery } from "@tanstack/react-query";
import { Download, FileText, Calculator, ClipboardList, CalendarClock } from "lucide-react";
import { DownloadableResource } from "@/lib/types";

export const ResourceLibrary = () => {
  const { data: resources = [], isLoading } = useQuery({
    queryKey: ["/api/downloadable-resources"],
  });

  const getIconForType = (type: string) => {
    switch (type.toLowerCase()) {
      case "template":
        return <FileText className="text-primary mr-2" />;
      case "calculator":
        return <Calculator className="text-primary mr-2" />;
      case "form":
        return <ClipboardList className="text-primary mr-2" />;
      case "guide":
        return <CalendarClock className="text-primary mr-2" />;
      default:
        return <FileText className="text-primary mr-2" />;
    }
  };

  if (isLoading) {
    return (
      <div className="mt-12">
        <h3 className="font-semibold text-xl mb-6">Resource Library</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white border border-gray-200 rounded-lg p-4 animate-pulse">
              <div className="h-6 bg-gray-200 rounded w-3/4 mb-3"></div>
              <div className="h-4 bg-gray-200 rounded w-full mb-3"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mt-12">
      <h3 className="font-semibold text-xl mb-6">Resource Library</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {resources.map((resource: DownloadableResource) => (
          <div key={resource.id} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition">
            <div className="flex items-center mb-3">
              {getIconForType(resource.type)}
              <h4 className="font-medium">{resource.name}</h4>
            </div>
            <p className="text-gray-600 text-sm mb-3">{resource.description}</p>
            <a
              href={`/api/download-resource/${resource.id}`}
              className="text-primary text-sm font-medium hover:underline flex items-center"
            >
              <span>Download</span>
              <Download className="h-4 w-4 ml-1" />
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};
