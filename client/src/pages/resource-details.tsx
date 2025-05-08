import { useState } from "react";
import { useParams, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Navbar } from "@/components/ui/navbar";
import { Footer } from "@/components/ui/footer";
import { Button } from "@/components/ui/button";
import { Star, Download, ArrowLeft, BookOpen, Calendar, Clock } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ResourceType } from "@/lib/types";

export default function ResourceDetails() {
  const { id } = useParams();
  const [_, navigate] = useLocation();
  
  const { data: resource, isLoading, error } = useQuery<ResourceType>({
    queryKey: [`/api/resources/${id}`],
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="container mx-auto px-4 py-8 flex-grow">
          <Button
            variant="ghost"
            className="mb-6 flex items-center text-gray-600"
            onClick={() => navigate("/resources")}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Resources
          </Button>

          <div className="max-w-4xl mx-auto">
            <Skeleton className="h-8 w-3/4 mb-4" />
            <div className="flex items-center mb-6">
              <Skeleton className="h-6 w-24 mr-4" />
              <Skeleton className="h-4 w-32" />
            </div>
            <Skeleton className="h-64 w-full mb-8" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Skeleton className="h-32" />
              <Skeleton className="h-32" />
              <Skeleton className="h-32" />
            </div>
            <Skeleton className="h-64 w-full" />
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !resource) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="container mx-auto px-4 py-16 flex-grow text-center">
          <h2 className="text-2xl font-bold mb-4">Resource Not Found</h2>
          <p className="text-gray-600 mb-8">The resource you're looking for doesn't exist or has been removed.</p>
          <Button onClick={() => navigate("/resources")}>
            Browse All Resources
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  const getSkillBadgeClass = (skill: string) => {
    switch (skill.toLowerCase()) {
      case "beginner":
        return "bg-emerald-100 text-emerald-800 hover:bg-emerald-200";
      case "intermediate":
        return "bg-amber-100 text-amber-800 hover:bg-amber-200";
      case "advanced":
        return "bg-red-100 text-red-800 hover:bg-red-200";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-200";
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <div className="container mx-auto px-4 py-8 flex-grow">
        <Button
          variant="ghost"
          className="mb-6 flex items-center text-gray-600"
          onClick={() => navigate("/resources")}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Resources
        </Button>

        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-4">{resource.title}</h1>
          
          <div className="flex flex-wrap items-center mb-6 gap-4">
            <Badge className={getSkillBadgeClass(resource.skillLevel)}>
              {resource.skillLevel}
            </Badge>
            
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
              <span className="text-sm text-gray-500 ml-1">({resource.reviewCount} reviews)</span>
            </div>
            
            <div className="flex items-center text-sm text-gray-500">
              <Calendar className="h-4 w-4 mr-1" />
              <span>Last updated: {new Date(resource.lastUpdated).toLocaleDateString()}</span>
            </div>
          </div>

          <div className="prose prose-blue max-w-none mb-8">
            <p className="text-xl text-gray-700 mb-6">{resource.description}</p>
            <div dangerouslySetInnerHTML={{ __html: resource.content }} />
          </div>

          <Separator className="my-8" />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold mb-2 flex items-center">
                  <BookOpen className="h-4 w-4 mr-2 text-primary" />
                  Estimated Reading Time
                </h3>
                <p className="text-gray-600">{resource.readingTime} minutes</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold mb-2 flex items-center">
                  <Clock className="h-4 w-4 mr-2 text-primary" />
                  Implementation Time
                </h3>
                <p className="text-gray-600">{resource.implementationTime}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold mb-2">Prerequisites</h3>
                <ul className="text-gray-600 pl-5 list-disc">
                  {resource.prerequisites.map((prereq, index) => (
                    <li key={index}>{prereq}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          {resource.downloadableFiles && resource.downloadableFiles.length > 0 && (
            <div className="bg-gray-50 p-6 rounded-lg mb-8">
              <h3 className="font-semibold text-lg mb-4">Related Downloads</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {resource.downloadableFiles.map((file, index) => (
                  <a
                    key={index}
                    href={`/api/download/${file.id}`}
                    className="flex items-center p-3 bg-white rounded border border-gray-200 hover:border-primary hover:shadow-sm transition"
                  >
                    <Download className="h-5 w-5 text-primary mr-3" />
                    <div>
                      <p className="font-medium">{file.name}</p>
                      <p className="text-xs text-gray-500">{file.size}</p>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
