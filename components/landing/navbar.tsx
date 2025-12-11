"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ShieldAlert, Menu, X } from "lucide-react";
import { useState } from "react";
import { ModeToggle } from "@/components/ui/mode-toggle";

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl">
            <ShieldAlert className="h-6 w-6 text-primary" />
            <span>SafeCampus</span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <Link href="/" className="text-sm font-medium hover:text-primary transition-colors">
            Home
          </Link>
          <Link href="/crime" className="text-sm font-medium hover:text-primary transition-colors">
            Crime Feed
          </Link>
          <Link href="/contact" className="text-sm font-medium hover:text-primary transition-colors">
            Contact
          </Link>
        </nav>

        <div className="hidden md:flex items-center gap-4">
          <ModeToggle />
          <Button asChild variant="ghost">
            <Link href="/auth/login">Login</Link>
          </Button>
          <Button asChild>
            <Link href="/auth/sign-up">Sign Up</Link>
          </Button>
        </div>

        {/* Mobile Menu Toggle */}
        <div className="flex items-center gap-2 md:hidden">
          <ModeToggle />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden border-t p-4 space-y-4 bg-background">
          <nav className="flex flex-col gap-4">
            <Link
              href="/"
              className="text-sm font-medium hover:text-primary transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/crime"
              className="text-sm font-medium hover:text-primary transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Crime Feed
            </Link>
            <Link
              href="/contact"
              className="text-sm font-medium hover:text-primary transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Contact
            </Link>
          </nav>
          <div className="flex flex-col gap-2 pt-4 border-t">
            <Button asChild variant="ghost" className="justify-start">
              <Link href="/auth/login">Login</Link>
            </Button>
            <Button asChild className="justify-start">
              <Link href="/auth/sign-up">Sign Up</Link>
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
