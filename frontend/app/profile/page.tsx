// frontend/app/profile/page.tsx
"use client";

import { useAuthStore } from "@/store/authStore";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import { Loader2, Mail, ShieldCheck } from "lucide-react";

export default function ProfilePage() {
  const { isLoading: isAuthLoading } = useRequireAuth();
  const { user } = useAuthStore();

  if (isAuthLoading || !user) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
        <Loader2 className="h-12 w-12 animate-spin text-accent" />
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-4xl px-4 py-12">
      <div className="flex flex-col md:flex-row items-center gap-8">
        {/* Avatar */}
        <div className="flex-shrink-0 w-32 h-32 flex items-center justify-center bg-accent text-primary rounded-full text-5xl font-bold">
          {user.username.charAt(0).toUpperCase()}
        </div>

        {/* User Info */}
        <div className="text-center md:text-left">
          <h1 className="text-4xl font-bold text-text">{user.username}</h1>
          <div className="mt-2 flex flex-col md:flex-row items-center justify-center md:justify-start gap-x-4 gap-y-1 text-muted-accent">
            <div className="flex items-center gap-2">
              <Mail size={16} />
              <span>{user.email}</span>
            </div>
            {user.is_admin && (
              <div className="flex items-center gap-2 text-accent">
                <ShieldCheck size={16} />
                <span>Administrator</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <hr className="border-border my-12" />

      {/* --- Future Sections --- */}
      <div>
        <h2 className="text-2xl font-bold mb-4">My Contributions</h2>
        <div className="p-8 text-center bg-card-bg border-2 border-dashed border-border rounded-lg">
          <p className="text-muted-accent">
            Your contribution history will appear here soon.
          </p>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Account Settings</h2>
        <div className="p-8 text-center bg-card-bg border-2 border-dashed border-border rounded-lg">
          <p className="text-muted-accent">
            Profile editing features coming soon.
          </p>
        </div>
      </div>
    </div>
  );
}
