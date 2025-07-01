// frontend/app/components/Header.tsx

"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  Menu,
  BookOpen,
  Trophy,
  X,
  User as UserIcon,
  LogOut,
} from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import Cookies from "js-cookie";

export default function Header() {
  const { isAuthenticated, user, isLoading } = useAuthStore();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target as Node)
      ) {
        setIsProfileMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  const handleLogout = () => {
    useAuthStore.getState().setUser(null);
    Cookies.remove("access_token");
    window.location.href = "/login";
  };

  const renderAuthSection = () => {
    // Desktop view logic remains the same
    if (isLoading) {
      return (
        <div className="h-10 w-32 bg-card-bg rounded-md animate-pulse"></div>
      );
    }
    if (isAuthenticated && user) {
      return (
        <div className="relative" ref={profileMenuRef}>
          <button
            onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
            className="w-10 h-10 flex items-center justify-center bg-accent text-primary rounded-full font-bold text-lg hover:opacity-90 transition-opacity"
          >
            {user.username.charAt(0).toUpperCase()}
          </button>
          {isProfileMenuOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-card-bg border border-border rounded-md shadow-lg py-1">
              <div className="px-4 py-3 border-b border-border">
                <p className="font-semibold text-text truncate">
                  {user.username}
                </p>
                <p className="text-sm text-muted-accent truncate">
                  {user.email}
                </p>
              </div>
              <div className="py-1">
                <Link
                  href="/profile"
                  onClick={() => setIsProfileMenuOpen(false)}
                  className="w-full text-left flex items-center gap-3 px-4 py-2 text-sm text-muted-accent hover:bg-border hover:text-text"
                >
                  <UserIcon size={16} /> My Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full text-left flex items-center gap-3 px-4 py-2 text-sm text-red-400 hover:bg-border"
                >
                  <LogOut size={16} /> Logout
                </button>
              </div>
            </div>
          )}
        </div>
      );
    } else {
      return (
        <div className="flex items-center space-x-2">
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
      );
    }
  };

  return (
    <header className="bg-card-bg/80 backdrop-blur-sm sticky top-0 z-50 border-b border-border">
      <nav className="container mx-auto px-6 py-3 flex justify-between items-center">
        <Link href="/" className="text-xl font-bold text-accent">
          Cognis
        </Link>
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
        <div className="hidden md:flex">{renderAuthSection()}</div>
        <div className="md:hidden">
          <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* --- Mobile Menu with the requested change --- */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-card-bg border-b border-border shadow-lg">
          <div className="container mx-auto px-6 py-4 flex flex-col">
            {/* User Profile Section - Now it's a LINK */}
            {isAuthenticated && user && (
              <>
                <Link
                  href="/profile"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-3 mb-4 p-2 rounded-md hover:bg-border"
                >
                  <div className="w-10 h-10 flex items-center justify-center bg-accent text-primary rounded-full font-bold text-lg">
                    {user.username.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-semibold text-text truncate">
                      {user.username}
                    </p>
                    <p className="text-sm text-muted-accent truncate">
                      {user.email}
                    </p>
                  </div>
                </Link>
                <hr className="border-border mb-4" />
              </>
            )}

            {/* Main Navigation Links - "My Profile" is removed from here */}
            <div className="flex flex-col space-y-4 mb-4">
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
            </div>

            <hr className="border-border" />

            {/* Auth Actions Section */}
            <div className="mt-4">
              {isLoading ? (
                <div className="h-10 w-full bg-border rounded-md animate-pulse"></div>
              ) : isAuthenticated ? (
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-sm text-red-400 rounded-md hover:bg-border"
                >
                  Logout
                </button>
              ) : (
                <div className="flex flex-col space-y-2">
                  <Link
                    href="/login"
                    className="px-4 py-2 text-center text-sm font-semibold text-primary bg-accent rounded-md"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    className="px-4 py-2 text-center text-sm font-semibold text-text bg-border rounded-md"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
