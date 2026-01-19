// frontend/app/components/Header.tsx

"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Menu,
  BookOpen,
  Trophy,
  X,
  User as UserIcon,
  LogOut,
  Bell,
} from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { useNotificationStore } from "@/store/notificationStore";
import Cookies from "js-cookie";

export default function Header() {
  const { isAuthenticated, user, isLoading: isAuthLoading } = useAuthStore();
  const { notifications, unreadCount, setNotifications, markAllAsRead } =
    useNotificationStore();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isNotificationMenuOpen, setIsNotificationMenuOpen] = useState(false);

  const profileMenuRef = useRef<HTMLDivElement>(null);
  const notificationMenuRef = useRef<HTMLDivElement>(null);

  // Effect to fetch notifications when the user logs in
  useEffect(() => {
    const fetchNotifications = async () => {
      const token = Cookies.get("access_token");
      if (isAuthenticated && token) {
        try {
          const apiUrl = process.env.NEXT_PUBLIC_API_URL;
          const res = await fetch(`${apiUrl}/api/notifications/`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (res.ok) {
            const data = await res.json();
            setNotifications(data);
          }
        } catch (error) {
          console.error("Failed to fetch notifications:", error);
        }
      }
    };

    fetchNotifications();
    // Re-fetch every 60 seconds as a simple polling mechanism
    const interval = setInterval(fetchNotifications, 60000);
    return () => clearInterval(interval);
  }, [isAuthenticated, setNotifications]);

  // Effect to close dropdowns when clicking outside
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target as Node)
      ) {
        setIsProfileMenuOpen(false);
      }
      if (
        notificationMenuRef.current &&
        !notificationMenuRef.current.contains(event.target as Node)
      ) {
        setIsNotificationMenuOpen(false);
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

  const handleMarkAllAsRead = async () => {
    if (unreadCount === 0) return;
    markAllAsRead(); // Optimistic UI update
    const token = Cookies.get("access_token");
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    await fetch(`${apiUrl}/api/notifications/mark-all-read`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    });
  };

  const renderAuthSection = () => {
    if (isAuthLoading) {
      return (
        <div className="h-10 w-40 bg-card-bg rounded-md animate-pulse"></div>
      );
    }

    if (isAuthenticated && user) {
      return (
        <div className="flex items-center gap-4">
          <div className="relative" ref={notificationMenuRef}>
            <button
              onClick={() => {
                setIsNotificationMenuOpen(!isNotificationMenuOpen);
                if (!isNotificationMenuOpen && unreadCount > 0)
                  handleMarkAllAsRead();
              }}
              className="relative p-2 rounded-full text-muted-accent hover:bg-border transition-colors"
              aria-label="Notifications"
            >
              <Bell size={20} />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 block h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-card-bg" />
              )}
            </button>
            {isNotificationMenuOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-card-bg border border-border rounded-md shadow-lg">
                <div className="p-3 border-b border-border">
                  <h3 className="font-semibold text-sm text-text">
                    Notifications
                  </h3>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {notifications.length > 0 ? (
                    notifications.map((n) => (
                      <Link
                        key={n.id}
                        href={n.link || "#"}
                        onClick={() => setIsNotificationMenuOpen(false)}
                        className={`block p-3 border-b border-border last:border-b-0 hover:bg-border transition-colors ${
                          !n.is_read ? "bg-primary" : ""
                        }`}
                      >
                        <p className="text-sm text-text">{n.message}</p>
                        <p className="text-xs text-muted-accent mt-1">
                          {new Date(n.created_at).toLocaleString()}
                        </p>
                      </Link>
                    ))
                  ) : (
                    <p className="text-center text-sm text-muted-accent py-8">
                      You have no notifications.
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
          <div className="relative" ref={profileMenuRef}>
            <button
              onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
              className="w-10 h-10 flex-shrink-0 rounded-full hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-primary"
            >
              {user.profile_image_url ? (
                <Image
                  src={user.profile_image_url}
                  alt="Profile picture"
                  width={40}
                  height={40}
                  className="rounded-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-accent text-primary rounded-full font-bold text-lg">
                  {user.username.charAt(0).toUpperCase()}
                </div>
              )}
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
    <header className="bg-card-bg/80 backdrop-blur-sm sticky top-0 z-50 border-b border-border w-full">
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

      {isMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-card-bg border-b border-border shadow-lg">
          <div className="container mx-auto px-6 py-4 flex flex-col">
            {isAuthenticated && user && (
              <>
                <Link
                  href="/profile"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-3 mb-4 p-2 rounded-md hover:bg-border"
                >
                  <div className="w-10 h-10 flex-shrink-0">
                    {user.profile_image_url ? (
                      <Image
                        src={user.profile_image_url}
                        alt="Profile picture"
                        width={40}
                        height={40}
                        className="rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-accent text-primary rounded-full font-bold text-lg">
                        {user.username.charAt(0).toUpperCase()}
                      </div>
                    )}
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
            <div className="mt-4">
              {isAuthLoading ? (
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
