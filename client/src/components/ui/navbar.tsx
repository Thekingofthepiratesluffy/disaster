import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Menu } from "lucide-react";
import { Button } from "./button";

const NavLink = ({ href, children }: { href: string; children: React.ReactNode }) => {
  const [location] = useLocation();
  const isActive = location === href || (href !== "/" && location.startsWith(href));

  return (
    <Link href={href}>
      <span
        className={`text-gray-600 hover:text-primary transition font-medium cursor-pointer ${
          isActive ? "text-primary" : ""
        }`}
      >
        {children}
      </span>
    </Link>
  );
};

export const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex flex-col md:flex-row justify-between items-center">
        <div className="flex items-center justify-between w-full md:w-auto mb-4 md:mb-0">
          <Link href="/">
            <span className="text-primary font-bold text-2xl cursor-pointer">DisasterReady</span>
          </Link>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden bg-primary-50 text-primary"
            onClick={toggleMobileMenu}
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-6">
          <NavLink href="/resources">Resources</NavLink>
          <NavLink href="/planning-tools">Planning Tools</NavLink>
          <NavLink href="/#testimonials">Testimonials</NavLink>
          <NavLink href="/#contact">Contact</NavLink>
        </nav>
      </div>

      {/* Mobile Navigation Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100">
          <div className="container mx-auto px-4 py-3 flex flex-col space-y-3">
            <NavLink href="/resources">Resources</NavLink>
            <NavLink href="/planning-tools">Planning Tools</NavLink>
            <NavLink href="/#testimonials">Testimonials</NavLink>
            <NavLink href="/#contact">Contact</NavLink>
          </div>
        </div>
      )}
    </header>
  );
};
