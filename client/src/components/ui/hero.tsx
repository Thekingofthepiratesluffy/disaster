import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export const Hero = () => {
  return (
    <section className="bg-primary text-white py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-4">Educational Resources for Disaster Recovery</h1>
          <p className="text-xl mb-8">Access enterprise-grade disaster recovery strategies organized by skill level</p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button asChild variant="secondary" className="bg-white text-primary hover:bg-gray-100">
              <Link href="/resources">Browse Resources</Link>
            </Button>
            <Button asChild variant="outline" className="border-white text-white hover:bg-white hover:text-primary">
              <Link href="/planning-tools">Try Planning Tools</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};
