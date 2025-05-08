import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { resourceSchema, testimonialSchema, contactFormSchema, strategyRequestSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Resources API
  app.get("/api/resources", async (req, res) => {
    const skillLevel = req.query.skillLevel as string || "All Levels";
    const type = req.query.type as string || "All Types";
    const search = req.query.search as string || "";
    const page = parseInt(req.query.page as string || "1");
    const perPage = parseInt(req.query.perPage as string || "6");

    try {
      const { resources, total } = await storage.getResources(
        skillLevel !== "All Levels" ? skillLevel : undefined,
        type !== "All Types" ? type : undefined,
        search,
        page,
        perPage
      );
      res.json({ resources, total, page, perPage });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch resources" });
    }
  });

  app.get("/api/resources/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    
    try {
      const resource = await storage.getResourceById(id);
      if (!resource) {
        return res.status(404).json({ message: "Resource not found" });
      }
      res.json(resource);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch resource" });
    }
  });

  // Strategy comparison
  app.get("/api/strategy-comparison", async (req, res) => {
    try {
      const strategies = await storage.getStrategyComparisons();
      res.json(strategies);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch strategy comparisons" });
    }
  });

  // Downloadable resources
  app.get("/api/downloadable-resources", async (req, res) => {
    try {
      const resources = await storage.getDownloadableResources();
      res.json(resources);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch downloadable resources" });
    }
  });

  app.get("/api/download-resource/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    
    try {
      const resource = await storage.getDownloadableResourceById(id);
      if (!resource) {
        return res.status(404).json({ message: "Resource not found" });
      }
      
      // In a real app, this would serve the file
      // For this demo, we'll just return a success message
      res.json({ 
        message: "Download started", 
        resource: { 
          name: resource.name,
          type: resource.type
        } 
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to download resource" });
    }
  });

  // Testimonials
  app.get("/api/testimonials", async (req, res) => {
    try {
      const testimonials = await storage.getTestimonials();
      res.json(testimonials);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch testimonials" });
    }
  });

  app.post("/api/testimonials", async (req, res) => {
    try {
      const testimonialData = testimonialSchema.parse(req.body);
      const testimonial = await storage.createTestimonial(testimonialData);
      res.status(201).json(testimonial);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid testimonial data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to submit testimonial" });
    }
  });

  // Contact form
  app.post("/api/contact", async (req, res) => {
    try {
      const contactData = contactFormSchema.parse(req.body);
      const contact = await storage.createContact(contactData);
      res.status(201).json(contact);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid contact data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to submit contact form" });
    }
  });

  // Strategy generator
  app.post("/api/planning-tool/generate", async (req, res) => {
    try {
      const strategyRequest = strategyRequestSchema.parse(req.body);
      const strategy = await storage.generateStrategy(strategyRequest);
      res.json(strategy);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid strategy request", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to generate strategy" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
