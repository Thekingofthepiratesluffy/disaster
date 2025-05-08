// Resource Types
export interface ResourceType {
  id: number;
  title: string;
  description: string;
  content: string;
  skillLevel: string;
  type: string;
  averageRating: number;
  reviewCount: number;
  lastUpdated: string;
  readingTime: number;
  implementationTime: string;
  prerequisites: string[];
  downloadableFiles?: {
    id: number;
    name: string;
    size: string;
  }[];
}

// Strategy Types
export interface StrategyType {
  id: number;
  name: string;
  rto: string;
  rpo: string;
  cost: number;
  complexity: number;
}

// Downloadable Resource Types
export interface DownloadableResource {
  id: number;
  name: string;
  description: string;
  type: string;
  downloadUrl: string;
}

// Testimonial Types
export interface TestimonialType {
  id: number;
  name: string;
  company: string;
  rating: number;
  comment: string;
  date: string;
}

// Backup Strategy
export interface BackupStrategy {
  id: number;
  name: string;
  description: string;
  estimatedCost: string;
  implementationTime: string;
  complexity: string;
  recommendations: string[];
}

// Contact Form
export interface ContactFormData {
  fullName: string;
  email: string;
  organization: string;
  areaOfInterest: string;
  message: string;
  agreeToReceiveInfo: boolean;
}

// Review Form
export interface ReviewFormData {
  name: string;
  company: string;
  rating: number;
  comment: string;
}
