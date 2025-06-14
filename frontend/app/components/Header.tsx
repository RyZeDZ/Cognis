"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, BookOpen, Trophy, X } from "lucide-react";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-card-bg/80 backdrop-blur-sm sticky top-0 z-50 border-b border-border">
      <nav className="container mx-auto px-6 py-3 flex justify-between items-center">
        <Link href="/" className="text-xl font-bold text-accent">
          Cognis
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-6">
          <Link
            href="/#subjects"
            className="text-muted-accent hover:text-text flex items-center gap-2"
          >
            <BookOpen size={18} /> Subjects
          </Link>
          <Link
            href="/guides"
            className="text-muted-accent hover:text-text flex items-center gap-2"
          >
            <Menu size={18} /> Guides
          </Link>
          <Link
            href="/leaderboard"
            className="text-muted-accent hover:text-text flex items-center gap-2"
          >
            <Trophy size={18} /> Leaderboard
          </Link>
        </div>

        {/* Desktop Auth Buttons */}
        <div className="hidden md:flex items-center space-x-2">
          <Link
            href="/login"
            className="px-4 py-2 text-sm font-semibold text-primary bg-accent rounded-md hover:opacity-90 transition-opacity"
          >
            Login
          </Link>
          <Link
            href="/register"
            className="px-4 py-2 text-sm font-semibold text-text bg-card-bg rounded-md border border-border hover:bg-border transition-colors"
          >
            Register
          </Link>
        </div>

        {/* Hamburger Menu Button */}
        <div className="md:hidden">
          <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-card-bg border-b border-border shadow-lg">
          <div className="container mx-auto px-6 py-4 flex flex-col space-y-4">
            <Link
              href="/#subjects"
              className="text-muted-accent hover:text-text"
              onClick={() => setIsMenuOpen(false)}
            >
              Subjects
            </Link>
            <Link
              href="/guides"
              className="text-muted-accent hover:text-text"
              onClick={() => setIsMenuOpen(false)}
            >
              Guides
            </Link>
            <Link
              href="/leaderboard"
              className="text-muted-accent hover:text-text"
              onClick={() => setIsMenuOpen(false)}
            >
              Leaderboard
            </Link>

            {/* Divider */}
            <hr className="border-border" />

            {/* Mobile Auth Buttons */}
            <div className="flex flex-col space-y-2">
              <Link
                href="/login"
                className="px-4 py-2 text-center text-sm font-semibold text-primary bg-accent rounded-md hover:opacity-90 transition-opacity"
                onClick={() => setIsMenuOpen(false)}
              >
                Login
              </Link>
              <Link
                href="/register"
                className="px-4 py-2 text-center text-sm font-semibold text-text bg-border rounded-md hover:opacity-90"
                onClick={() => setIsMenuOpen(false)}
              >
                Register
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
