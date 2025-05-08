import { useState, useEffect } from "react";
import { Navbar } from "@/components/ui/navbar";
import { Hero } from "@/components/ui/hero";
import { ResourceFilters } from "@/components/ui/resource-filters";
import { PlanningTool } from "@/components/ui/planning-tool";
import { ComparisonMatrix } from "@/components/ui/comparison-matrix";
import { ResourceLibrary } from "@/components/ui/resource-library";
import { Testimonials } from "@/components/ui/testimonials";
import { ContactForm } from "@/components/ui/contact-form";
import { Footer } from "@/components/ui/footer";

export default function Home() {
  // Handle smooth scrolling for anchor links
  useEffect(() => {
    const handleAnchorClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest('a[href^="#"]');
      
      if (anchor) {
        e.preventDefault();
        const targetId = anchor.getAttribute('href');
        const targetElement = document.querySelector(targetId || '');
        
        if (targetElement) {
          window.scrollTo({
            top: targetElement.getBoundingClientRect().top + window.scrollY - 80,
            behavior: 'smooth'
          });
        }
      }
    };

    document.addEventListener('click', handleAnchorClick);
    
    return () => {
      document.removeEventListener('click', handleAnchorClick);
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <Hero />
      <ResourceFilters />
      
      <section id="planning-tools" className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-10">Backup Strategy Planning Tools</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <PlanningTool />
            <ComparisonMatrix />
          </div>
          
          <ResourceLibrary />
        </div>
      </section>
      
      <Testimonials />
      <ContactForm />
      <Footer />
    </div>
  );
}
