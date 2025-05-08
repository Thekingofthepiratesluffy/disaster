import { 
  ResourceType, 
  StrategyComparisonType, 
  DownloadableResourceType, 
  TestimonialType, 
  ContactFormType, 
  StrategyRequestType, 
  StrategyResponseType,
  InsertTestimonialType,
  InsertContactFormType,
  resources,
  strategyComparisons,
  downloadableResources,
  testimonials,
  contactForms
} from "@shared/schema";
import { eq, or, like } from "drizzle-orm";

// modify the interface with any CRUD methods
// you might need
export interface IStorage {
  // Resources
  getResources(
    skillLevel?: string,
    type?: string,
    search?: string,
    page?: number,
    perPage?: number
  ): Promise<{ resources: ResourceType[], total: number }>;
  getResourceById(id: number): Promise<ResourceType | undefined>;
  
  // Strategy comparisons
  getStrategyComparisons(): Promise<StrategyComparisonType[]>;
  
  // Downloadable resources
  getDownloadableResources(): Promise<DownloadableResourceType[]>;
  getDownloadableResourceById(id: number): Promise<DownloadableResourceType | undefined>;
  
  // Testimonials
  getTestimonials(): Promise<TestimonialType[]>;
  createTestimonial(testimonial: InsertTestimonialType): Promise<TestimonialType>;
  
  // Contact form
  createContact(contact: InsertContactFormType): Promise<ContactFormType>;
  
  // Strategy generator
  generateStrategy(request: StrategyRequestType): Promise<StrategyResponseType>;
}

export class DatabaseStorage implements IStorage {
  // Initialize database with seed data flag to track if data has been seeded
  private static hasSeededData = false;

  constructor() {
    this.seedDataIfNeeded();
  }
  
  // Seed initial data for demo purposes if not already seeded
  private async seedDataIfNeeded() {
    if (DatabaseStorage.hasSeededData) {
      return;
    }

    try {
      // Import the database module
      const { db } = await import('./db');
      
      // Check if resources already exist
      const existingResources = await db.select().from(resources).limit(1);
      if (existingResources.length > 0) {
        DatabaseStorage.hasSeededData = true;
        return;
      }

      console.log("Seeding database with initial data...");

      // Seed resources
      const resourcesData: Omit<ResourceType, "id">[] = [
        {
          title: "Disaster Recovery Fundamentals",
          description: "Learn the basics of disaster recovery planning and implementation for enterprise environments.",
          content: "<p>This comprehensive guide covers the fundamental principles of disaster recovery planning...</p>",
          skillLevel: "Beginner",
          type: "Guide",
          averageRating: "4.2",
          reviewCount: 42,
          lastUpdated: "2023-06-12",
          readingTime: 25,
          implementationTime: "1-2 weeks",
          prerequisites: ["Basic IT knowledge", "Familiarity with business operations"]
        },
        {
          title: "Backup Strategy Optimization",
          description: "Techniques for optimizing backup strategies for various enterprise scenarios.",
          content: "<p>Learn advanced techniques for optimizing your backup strategies...</p>",
          skillLevel: "Intermediate",
          type: "Guide",
          averageRating: "4.8",
          reviewCount: 28,
          lastUpdated: "2023-07-03",
          readingTime: 35,
          implementationTime: "2-4 weeks",
          prerequisites: ["Basic backup knowledge", "Some IT infrastructure experience"]
        },
        {
          title: "Zero-Downtime Recovery Planning",
          description: "Advanced techniques for implementing zero-downtime recovery systems in enterprise environments.",
          content: "<p>Explore cutting-edge techniques for ensuring zero-downtime in your recovery operations...</p>",
          skillLevel: "Advanced",
          type: "Guide",
          averageRating: "4.9",
          reviewCount: 16,
          lastUpdated: "2023-08-17",
          readingTime: 45,
          implementationTime: "1-3 months",
          prerequisites: ["Advanced IT knowledge", "Experience with high-availability systems", "Previous DR implementation"]
        },
        {
          title: "Backup Terminology Guide",
          description: "A comprehensive guide to understanding backup and recovery terminology.",
          content: "<p>Master the language of backup and recovery with this comprehensive terminology guide...</p>",
          skillLevel: "Beginner",
          type: "Guide",
          averageRating: "3.8",
          reviewCount: 31,
          lastUpdated: "2023-05-22",
          readingTime: 15,
          implementationTime: "N/A",
          prerequisites: ["None"]
        },
        {
          title: "Cloud-Based Recovery Solutions",
          description: "Implementation guide for cloud-based disaster recovery solutions.",
          content: "<p>Discover how to leverage cloud platforms for reliable disaster recovery...</p>",
          skillLevel: "Intermediate",
          type: "Guide",
          averageRating: 4.5,
          reviewCount: 19,
          lastUpdated: "2023-07-19",
          readingTime: 30,
          implementationTime: "3-5 weeks",
          prerequisites: ["Cloud platform familiarity", "Basic networking knowledge"]
        },
        {
          title: "Multi-Site Recovery Architecture",
          description: "Advanced architectural patterns for multi-site disaster recovery implementations.",
          content: "<p>Learn how to design and implement sophisticated multi-site recovery solutions...</p>",
          skillLevel: "Advanced",
          type: "Case Study",
          averageRating: 5.0,
          reviewCount: 24,
          lastUpdated: "2023-08-05",
          readingTime: 50,
          implementationTime: "2-4 months",
          prerequisites: ["Enterprise architecture experience", "Advanced networking", "Multiple DC management"]
        }
      ];
      
      // Insert resources
      for (const resource of resourcesData) {
        await db.insert(resources).values(resource);
      }
      
      // Seed strategy comparisons
      const strategiesData: Omit<StrategyComparisonType, "id">[] = [
        {
          name: "Local Backup",
          rto: "1-4 hours",
          rpo: "24 hours",
          cost: 1,
          complexity: 1
        },
        {
          name: "Cloud Backup",
          rto: "2-8 hours",
          rpo: "12 hours",
          cost: 2,
          complexity: 2
        },
        {
          name: "Hybrid Solution",
          rto: "1-4 hours",
          rpo: "6 hours",
          cost: 3,
          complexity: 3
        },
        {
          name: "Continuous Replication",
          rto: "Minutes",
          rpo: "Near zero",
          cost: 3,
          complexity: 3
        }
      ];
      
      // Insert strategy comparisons
      for (const strategy of strategiesData) {
        await db.insert(strategyComparisons).values(strategy);
      }
      
      // Seed downloadable resources
      const downloadablesData: Omit<DownloadableResourceType, "id">[] = [
        {
          name: "Backup Strategy Template",
          description: "Editable template for creating a comprehensive backup strategy document.",
          type: "Template",
          downloadUrl: "/downloads/backup-strategy-template.docx"
        },
        {
          name: "TCO Calculator",
          description: "Excel-based calculator for estimating total cost of ownership for backup solutions.",
          type: "Calculator",
          downloadUrl: "/downloads/tco-calculator.xlsx"
        },
        {
          name: "Risk Assessment Form",
          description: "Form template for conducting disaster recovery risk assessments.",
          type: "Form",
          downloadUrl: "/downloads/risk-assessment-form.pdf"
        },
        {
          name: "Testing Schedule Guide",
          description: "Guide for creating and maintaining a backup testing schedule.",
          type: "Guide",
          downloadUrl: "/downloads/testing-schedule-guide.pdf"
        }
      ];
      
      // Insert downloadable resources
      for (const resource of downloadablesData) {
        await db.insert(downloadableResources).values(resource);
      }
      
      // Seed testimonials
      const testimonialsData: Omit<TestimonialType, "id">[] = [
        {
          name: "Michael Chen",
          company: "TechSolutions Inc.",
          rating: 5,
          comment: "The disaster recovery resources provided by DisasterReady helped us implement a robust backup strategy that saved our data during a recent outage. The step-by-step guides were invaluable.",
          date: new Date().toISOString()
        },
        {
          name: "Sarah Johnson",
          company: "Healthcare Partners",
          rating: 4,
          comment: "The comparison matrix helped us make an informed decision about which backup strategy would work best for our organization. We were able to clearly see the trade-offs between different approaches.",
          date: new Date().toISOString()
        },
        {
          name: "David Rodriguez",
          company: "Global Finance",
          rating: 5,
          comment: "As someone new to disaster recovery planning, the beginner resources were exactly what I needed. The interactive planning tool generated a strategy that our management team approved immediately.",
          date: new Date().toISOString()
        }
      ];
      
      // Insert testimonials
      for (const testimonial of testimonialsData) {
        await db.insert(testimonials).values(testimonial);
      }
      
      DatabaseStorage.hasSeededData = true;
      console.log("Database seeded successfully");
    } catch (error) {
      console.error("Error seeding database:", error);
    }
  }
  
  // Resources methods
  async getResources(
    skillLevel?: string,
    type?: string,
    search?: string,
    page: number = 1,
    perPage: number = 6
  ): Promise<{ resources: ResourceType[], total: number }> {
    const { db } = await import('./db');
    
    let query = db.select().from(resources);
    
    // Apply filters
    if (skillLevel) {
      query = query.where(eq(resources.skillLevel, skillLevel));
    }
    
    if (type) {
      query = query.where(eq(resources.type, type));
    }
    
    if (search) {
      query = query.where(
        or(
          like(resources.title, `%${search}%`),
          like(resources.description, `%${search}%`)
        )
      );
    }
    
    // Get total count (without pagination)
    const allResults = await query;
    const total = allResults.length;
    
    // Apply pagination
    const offset = (page - 1) * perPage;
    const paginatedResults = await query.limit(perPage).offset(offset);
    
    return { resources: paginatedResults, total };
  }
  
  async getResourceById(id: number): Promise<ResourceType | undefined> {
    const { db } = await import('./db');
    const [resource] = await db.select().from(resources).where(eq(resources.id, id));
    return resource;
  }
  
  // Strategy comparisons methods
  async getStrategyComparisons(): Promise<StrategyComparisonType[]> {
    const { db } = await import('./db');
    return await db.select().from(strategyComparisons);
  }
  
  // Downloadable resources methods
  async getDownloadableResources(): Promise<DownloadableResourceType[]> {
    const { db } = await import('./db');
    return await db.select().from(downloadableResources);
  }
  
  async getDownloadableResourceById(id: number): Promise<DownloadableResourceType | undefined> {
    const { db } = await import('./db');
    const [resource] = await db.select().from(downloadableResources).where(eq(downloadableResources.id, id));
    return resource;
  }
  
  // Testimonials methods
  async getTestimonials(): Promise<TestimonialType[]> {
    const { db } = await import('./db');
    return await db.select().from(testimonials);
  }
  
  async createTestimonial(testimonialData: InsertTestimonialType): Promise<TestimonialType> {
    const { db } = await import('./db');
    
    const newTestimonial = {
      ...testimonialData,
      date: new Date().toISOString()
    };
    
    const [testimonial] = await db.insert(testimonials).values(newTestimonial).returning();
    return testimonial;
  }
  
  // Contact form methods
  async createContact(contactData: InsertContactFormType): Promise<ContactFormType> {
    const { db } = await import('./db');
    
    const newContact = {
      ...contactData,
      createdAt: new Date().toISOString()
    };
    
    const [contact] = await db.insert(contactForms).values(newContact).returning();
    return contact;
  }
  
  // Strategy generator
  async generateStrategy(request: StrategyRequestType): Promise<StrategyResponseType> {
    // Logic to determine the appropriate strategy based on the request
    const { organizationSize, dataVolume, recoveryTimeObjective, budget } = request;
    
    let strategy: StrategyResponseType;
    
    if (recoveryTimeObjective.startsWith("Immediate") || recoveryTimeObjective.startsWith("Quick")) {
      if (budget === "Extensive") {
        strategy = {
          id: 1,
          name: "Continuous Data Protection with Hot Standby",
          description: "A premium solution with real-time data replication and instantly available standby systems for near-zero downtime recovery.",
          estimatedCost: "$$$$$",
          implementationTime: "4-8 weeks",
          complexity: "High",
          recommendations: [
            "Implement continuous data replication",
            "Maintain hot standby systems",
            "Automate failover processes",
            "Conduct monthly recovery tests"
          ]
        };
      } else if (budget === "Moderate") {
        strategy = {
          id: 2,
          name: "Hybrid Cloud Recovery",
          description: "Combines on-premises backup with cloud-based recovery to provide quick restoration times with moderate costs.",
          estimatedCost: "$$$",
          implementationTime: "3-6 weeks",
          complexity: "Medium",
          recommendations: [
            "Implement local backups for critical data",
            "Replicate to cloud for disaster recovery",
            "Set up automated recovery procedures",
            "Test recovery quarterly"
          ]
        };
      } else {
        strategy = {
          id: 3,
          name: "Prioritized Local Recovery",
          description: "Focuses resources on the most critical systems with local backup and optimized recovery procedures.",
          estimatedCost: "$$",
          implementationTime: "2-4 weeks",
          complexity: "Medium-Low",
          recommendations: [
            "Identify and prioritize critical systems",
            "Implement frequent local backups for critical data",
            "Create detailed manual recovery procedures",
            "Test recovery quarterly"
          ]
        };
      }
    } else if (recoveryTimeObjective.startsWith("Same day")) {
      if (dataVolume > 60) {
        strategy = {
          id: 4,
          name: "Tiered Cloud Backup Solution",
          description: "A scalable cloud-based backup solution with tiered recovery priorities for large data volumes.",
          estimatedCost: "$$$",
          implementationTime: "4-6 weeks",
          complexity: "Medium",
          recommendations: [
            "Implement tiered data classification",
            "Use cloud storage with varying retrieval times",
            "Create automation scripts for restore operations",
            "Conduct quarterly recovery tests"
          ]
        };
      } else {
        strategy = {
          id: 5,
          name: "Standard Cloud Backup",
          description: "A reliable cloud-based backup solution suitable for most business needs with same-day recovery capabilities.",
          estimatedCost: "$$",
          implementationTime: "2-4 weeks",
          complexity: "Low",
          recommendations: [
            "Configure daily cloud backups",
            "Implement retention policies",
            "Document recovery procedures",
            "Test recovery quarterly"
          ]
        };
      }
    } else {
      strategy = {
        id: 6,
        name: "Basic Backup Solution",
        description: "A cost-effective backup solution focused on essential data protection with acceptable recovery times.",
        estimatedCost: "$",
        implementationTime: "1-2 weeks",
        complexity: "Low",
        recommendations: [
          "Implement weekly full backups",
          "Configure daily incremental backups",
          "Document basic recovery procedures",
          "Test recovery semi-annually"
        ]
      };
    }
    
    return strategy;
  }
}

export const storage = new DatabaseStorage();
