import { Link } from "wouter";
import { Facebook, Twitter, Linkedin } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-bold text-xl mb-4">DisasterReady</h3>
            <p className="text-gray-300 mb-4">
              Empowering organizations with educational resources for effective disaster recovery planning.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-300 hover:text-white transition">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Resources</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/resources?level=beginner" className="text-gray-300 hover:text-white transition">
                  Beginner Guides
                </Link>
              </li>
              <li>
                <Link href="/resources?level=intermediate" className="text-gray-300 hover:text-white transition">
                  Intermediate Resources
                </Link>
              </li>
              <li>
                <Link href="/resources?level=advanced" className="text-gray-300 hover:text-white transition">
                  Advanced Techniques
                </Link>
              </li>
              <li>
                <Link href="/resources?type=template" className="text-gray-300 hover:text-white transition">
                  Templates & Tools
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Planning Tools</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/planning-tools#strategy-builder" className="text-gray-300 hover:text-white transition">
                  Strategy Builder
                </Link>
              </li>
              <li>
                <Link href="/planning-tools#comparison-matrix" className="text-gray-300 hover:text-white transition">
                  Comparison Matrix
                </Link>
              </li>
              <li>
                <Link href="/planning-tools#cost-calculator" className="text-gray-300 hover:text-white transition">
                  Cost Calculator
                </Link>
              </li>
              <li>
                <Link href="/planning-tools#risk-assessment" className="text-gray-300 hover:text-white transition">
                  Risk Assessment
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition">About Us</a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition">Our Team</a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition">Privacy Policy</a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition">Terms of Service</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400 text-sm">
          <p>&copy; {new Date().getFullYear()} DisasterReady. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};
