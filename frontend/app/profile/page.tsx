// frontend/app/profile/page.tsx

"use client";

import { useState, useEffect, FormEvent } from "react";
import { useAuthStore } from "@/store/authStore";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import {
  Loader2,
  Mail,
  ShieldCheck,
  Pencil,
  Link as LinkIcon,
  Unlink,
  KeyRound,
} from "lucide-react";
import type { UserContribution } from "@/types";
import Cookies from "js-cookie";
import Link from "next/link";
import Image from "next/image";
import ProfileImageUploader from "./components/ProfileImageUploader";
import { GoogleLogin, type CredentialResponse } from "@react-oauth/google";

const GoogleIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 48 48">
    <path
      fill="#FFC107"
      d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12s5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
    ></path>
    <path
      fill="#FF3D00"
      d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
    ></path>
    <path
      fill="#4CAF50"
      d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.222,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
    ></path>
    <path
      fill="#1976D2"
      d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.574l6.19,5.238C42.022,35.244,44,30.038,44,24C44,22.659,43.862,21.35,43.611,20.083z"
    ></path>
  </svg>
);

const StatusBadge = ({ status }: { status: string }) => {
  const lowerStatus = status.toLowerCase();
  let statusClasses = "";
  if (lowerStatus.includes("pending")) {
    statusClasses = "bg-yellow-500/10 text-yellow-400 border-yellow-500/30";
  } else if (
    lowerStatus.includes("approved") ||
    lowerStatus.includes("published")
  ) {
    statusClasses = "bg-green-500/10 text-green-400 border-green-500/30";
  } else if (lowerStatus.includes("rejected")) {
    statusClasses = "bg-red-500/10 text-red-400 border-red-500/30";
  }

  return (
    <span
      className={`px-2 py-1 text-xs font-medium rounded-full border ${statusClasses}`}
    >
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

export default function ProfilePage() {
  const { isLoading: isAuthLoading } = useRequireAuth();
  const { user, setUser } = useAuthStore();
  const [contributions, setContributions] = useState<UserContribution[]>([]);
  const [isLoadingContributions, setIsLoadingContributions] = useState(true);
  const [username, setUsername] = useState("");
  const [isEditingUsername, setIsEditingUsername] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploaderOpen, setIsUploaderOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSavingPassword, setIsSavingPassword] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (user) setUsername(user.username);
  }, [user]);

  useEffect(() => {
    const fetchContributions = async () => {
      if (!user) return;
      setIsLoadingContributions(true);
      try {
        const token = Cookies.get("access_token");
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;
        // Call the new unified endpoint
        const res = await fetch(`${apiUrl}/api/users/me/all-contributions`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to fetch contributions.");
        const data = await res.json();
        setContributions(data.contributions); // The data is nested in a 'contributions' key
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoadingContributions(false);
      }
    };
    if (user) {
      fetchContributions();
    }
  }, [user]);

  const hasChanges = user
    ? username.trim() !== user.username && username.trim().length >= 3
    : false;

  const handleProfileUpdate = async (updateData: {
    username?: string;
    profile_image_url?: string;
  }) => {
    setIsSaving(true);
    setError(null);
    try {
      const token = Cookies.get("access_token");
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      const response = await fetch(`${apiUrl}/api/users/me`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updateData),
      });
      const data = await response.json();
      if (!response.ok)
        throw new Error(data.detail || "Failed to update profile.");
      setUser(data);
      setIsEditingUsername(false);
      setIsUploaderOpen(false);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unknown error occurred."
      );
      if (user) setUsername(user.username);
    } finally {
      setIsSaving(false);
    }
  };

  const handleUsernameSave = () =>
    handleProfileUpdate({ username: username.trim() });
  const handleImageUploadComplete = (newImageUrl: string) =>
    handleProfileUpdate({ profile_image_url: newImageUrl });
  const handleReset = () => {
    if (user) {
      setUsername(user.username);
      setIsEditingUsername(false);
    }
  };

  const handleLinkGoogleSuccess = async (
    credentialResponse: CredentialResponse
  ) => {
    setError(null);
    setIsSaving(true);
    try {
      const idToken = credentialResponse.credential;
      if (!idToken)
        throw new Error("Google flow failed: No ID token received.");
      const token = Cookies.get("access_token");
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      const response = await fetch(`${apiUrl}/api/auth/google/link`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ token: idToken }),
      });
      const data = await response.json();
      if (!response.ok)
        throw new Error(data.detail || "Failed to link Google account.");
      setUser(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unknown error occurred."
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleUnlinkGoogle = async () => {
    if (
      !window.confirm(
        "Are you sure? If you don't have a password set, you may lose access to your account."
      )
    )
      return;
    setError(null);
    setIsSaving(true);
    try {
      const token = Cookies.get("access_token");
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      const response = await fetch(`${apiUrl}/api/auth/google/unlink`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (!response.ok)
        throw new Error(data.detail || "Failed to unlink Google account.");
      setUser(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unknown error occurred."
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleChangePassword = async (e: FormEvent) => {
    e.preventDefault();
    setPasswordError(null);
    setPasswordSuccess(null);

    if (newPassword !== confirmPassword) {
      setPasswordError("New passwords do not match.");
      return;
    }
    if (newPassword.length < 8) {
      setPasswordError("New password must be at least 8 characters long.");
      return;
    }

    setIsSavingPassword(true);
    try {
      const token = Cookies.get("access_token");
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      const response = await fetch(`${apiUrl}/api/users/me/change-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          current_password: currentPassword,
          new_password: newPassword,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.detail || "Failed to change password.");
      }

      setPasswordSuccess("Password changed successfully!");
      // Clear the password fields
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      setPasswordError(
        err instanceof Error ? err.message : "An unknown error occurred."
      );
    } finally {
      setIsSavingPassword(false);
    }
  };

  if (isAuthLoading || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-accent" />
      </div>
    );
  }

  return (
    <>
      <ProfileImageUploader
        isOpen={isUploaderOpen}
        onClose={() => setIsUploaderOpen(false)}
        onUploadComplete={handleImageUploadComplete}
      />
      <div className="container mx-auto max-w-4xl px-4 py-12">
        <div className="bg-card-bg border border-border rounded-lg p-8">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="relative group flex-shrink-0">
              {user.profile_image_url ? (
                <Image
                  src={user.profile_image_url}
                  alt={`${user.username}'s profile picture`}
                  width={128}
                  height={128}
                  className="w-32 h-32 rounded-full object-cover border-2 border-border"
                />
              ) : (
                <div className="w-32 h-32 flex items-center justify-center bg-accent text-primary rounded-full text-5xl font-bold">
                  {user.username.charAt(0).toUpperCase()}
                </div>
              )}
              <button
                onClick={() => setIsUploaderOpen(true)}
                className="absolute inset-0 w-full h-full bg-black/60 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity"
                aria-label="Change profile picture"
              >
                <Pencil size={32} />
              </button>
            </div>
            <div className="text-center md:text-left flex-grow">
              {isEditingUsername ? (
                <div>
                  <label
                    htmlFor="username-edit"
                    className="text-xs font-bold uppercase text-muted-accent"
                  >
                    Username
                  </label>
                  <input
                    id="username-edit"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full text-2xl font-semibold bg-primary border-2 border-border rounded-md px-2 py-1 mt-1 text-text"
                    autoFocus
                  />
                </div>
              ) : (
                <div className="flex items-center gap-4 justify-center md:justify-start">
                  <h1 className="text-4xl font-bold text-text">
                    {user.username}
                  </h1>
                  <button
                    onClick={() => setIsEditingUsername(true)}
                    className="p-2 text-muted-accent hover:text-accent"
                  >
                    <Pencil size={18} />
                  </button>
                </div>
              )}
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
        </div>

        <hr className="border-border my-12" />

        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-4">Connected Accounts</h2>
          {error && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 text-red-400 rounded-md text-sm">
              {error}
            </div>
          )}
          <div className="bg-card-bg border border-border rounded-lg p-6">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <GoogleIcon />
                <div>
                  <p className="font-semibold text-text">Google</p>
                  {user.google_id ? (
                    <p className="text-xs text-green-400">
                      Account is connected.
                    </p>
                  ) : (
                    <p className="text-xs text-muted-accent">Not connected.</p>
                  )}
                </div>
              </div>
              {user.google_id ? (
                <button
                  onClick={handleUnlinkGoogle}
                  disabled={isSaving}
                  className="px-4 py-2 flex items-center gap-2 text-sm font-semibold rounded-md bg-red-500/10 text-red-400 hover:bg-red-500/20 disabled:opacity-50"
                >
                  {isSaving ? (
                    <Loader2 className="animate-spin" />
                  ) : (
                    <Unlink size={16} />
                  )}
                  <span className="ml-1">Unlink</span>
                </button>
              ) : (
                <div className="relative">
                  <button
                    type="button"
                    disabled={isSaving}
                    className="px-4 py-2 flex items-center text-sm font-semibold rounded-md bg-accent text-primary hover:opacity-90 disabled:opacity-50"
                  >
                    {isSaving ? (
                      <Loader2 className="animate-spin" />
                    ) : (
                      <LinkIcon size={16} className="mr-2" />
                    )}
                    Link Account
                  </button>
                  <div className="absolute top-0 left-0 w-full h-full opacity-0 overflow-hidden cursor-pointer">
                    <GoogleLogin
                      onSuccess={handleLinkGoogleSuccess}
                      onError={() => setError("Google linking failed.")}
                      size="medium"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <hr className="border-border my-12" />

        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-4">My Contributions</h2>
          <div className="bg-card-bg border border-border rounded-lg">
            {isLoadingContributions ? (
              <div className="p-8 text-center text-muted-accent">
                <Loader2 className="h-6 w-6 animate-spin mx-auto" />
              </div>
            ) : contributions.length > 0 ? (
              <table className="w-full text-sm">
                <thead className="border-b border-border">
                  <tr>
                    <th className="text-left font-semibold p-4 text-muted-accent">
                      Title
                    </th>
                    <th className="text-left font-semibold p-4 text-muted-accent">
                      Type
                    </th>
                    <th className="text-left font-semibold p-4 text-muted-accent">
                      Status
                    </th>
                    <th className="text-left font-semibold p-4 text-muted-accent">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {contributions.map((item, index) => {
                    // --- THIS IS THE NEW DYNAMIC LINK LOGIC ---
                    let viewLink = "";
                    if (item.content_type === "edit") {
                      if (
                        item.status.toLowerCase() === "approved" ||
                        item.status.toLowerCase() === "rejected"
                      )
                        // For edits, we link to the user-facing preview we already built
                        viewLink = `/subjects/${item.subject_id}/chapters/${item.chapter_id}`;
                      else
                        viewLink = `/profile/contribution/chapter/${item.item_id}`;
                    } else if (item.content_type === "chapter") {
                      if (item.status.toLowerCase() === "approved")
                        viewLink = `/subjects/${item.subject_id}/chapters/${item.chapter_id}`;
                      else if (item.status.toLowerCase() === "rejected")
                        viewLink = `#`;
                      else
                        viewLink = `/profile/contribution/chapter/${item.item_id}`;
                    } else if (item.content_type === "exam") {
                      if (item.status.toLowerCase() === "approved")
                        viewLink = `/subjects/${item.subject_id}`;
                      else if (item.status.toLowerCase() === "rejected")
                        viewLink = `#`;
                      else
                        viewLink = `/profile/contribution/exam/${item.item_id}`;
                    } else if (item.content_type === "resource") {
                      if (item.status.toLowerCase() === "approved")
                        viewLink = `/subjects/${item.subject_id}`;
                      else if (item.status.toLowerCase() === "rejected")
                        viewLink = `#`;
                      else
                        viewLink = `/profile/contribution/resource/${item.item_id}`;
                    } else {
                      // If it's a new submission that is PENDING or REJECTED, link to a preview page
                      // We will build these preview pages next
                      viewLink = `#`;
                    }

                    return (
                      <tr
                        key={`${item.type}-${item.item_id}-${index}`}
                        className="border-b border-border last:border-b-0"
                      >
                        <td className="p-4 text-text font-medium">
                          {item.title}
                        </td>
                        <td className="p-4 text-muted-accent">{item.type}</td>
                        <td className="p-4">
                          <StatusBadge status={item.status} />
                        </td>
                        <td className="p-4">
                          {viewLink === "#" ? (
                            <span className="text-muted-accent cursor-not-allowed">
                              View
                            </span>
                          ) : (
                            <Link
                              href={viewLink}
                              className="text-accent hover:underline"
                            >
                              View
                            </Link>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            ) : (
              <div className="p-8 text-center text-muted-accent">
                <p>You haven&apos;t made any contributions yet.</p>
              </div>
            )}
          </div>
        </div>

        <hr className="border-border my-12" />

        {!user.google_id && (
          <form onSubmit={handleChangePassword} className="mt-12">
            <h2 className="text-2xl font-bold mb-4">Change Password</h2>
            {passwordSuccess && (
              <div className="mb-4 p-3 bg-green-500/10 text-green-400 rounded-md text-sm">
                {passwordSuccess}
              </div>
            )}
            {passwordError && (
              <div className="mb-4 p-3 bg-red-500/10 text-red-400 rounded-md text-sm">
                {passwordError}
              </div>
            )}
            <div className="bg-card-bg border border-border rounded-lg p-6 space-y-4">
              <div>
                <label
                  htmlFor="currentPassword"
                  className="block text-sm font-medium text-muted-accent mb-2"
                >
                  Current Password
                </label>
                <input
                  id="currentPassword"
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
                  className="w-full bg-primary border-2 border-border rounded-md px-3 py-2 text-text"
                />
              </div>
              <div>
                <label
                  htmlFor="newPassword"
                  className="block text-sm font-medium text-muted-accent mb-2"
                >
                  New Password
                </label>
                <input
                  id="newPassword"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  className="w-full bg-primary border-2 border-border rounded-md px-3 py-2 text-text"
                />
              </div>
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-muted-accent mb-2"
                >
                  Confirm New Password
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="w-full bg-primary border-2 border-border rounded-md px-3 py-2 text-text"
                />
              </div>
            </div>
            <div className="mt-6 flex justify-end">
              <button
                type="submit"
                disabled={isSavingPassword}
                className="px-6 py-2 flex items-center font-semibold text-primary bg-accent rounded-md disabled:opacity-50"
              >
                {isSavingPassword ? (
                  <Loader2 className="animate-spin mr-2" size={16} />
                ) : (
                  <KeyRound size={16} className="mr-2" />
                )}
                Update Password
              </button>
            </div>
          </form>
        )}
      </div>

      <div
        className={`fixed bottom-6 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] max-w-xl transition-all duration-300 ease-in-out z-50 ${
          hasChanges
            ? "translate-y-0 opacity-100"
            : "translate-y-24 opacity-0 pointer-events-none"
        }`}
      >
        <div className="bg-slate-800 rounded-lg shadow-2xl p-3 flex justify-between items-center">
          <p className="text-sm font-semibold text-text">
            Careful — you have unsaved changes!
          </p>
          <div className="flex gap-2">
            <button
              onClick={handleReset}
              className="px-4 py-2 text-sm font-medium rounded-md hover:bg-border text-text"
            >
              Reset
            </button>
            <button
              onClick={handleUsernameSave}
              disabled={isSaving}
              className="px-4 py-2 flex items-center text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-md disabled:opacity-50"
            >
              {isSaving ? (
                <Loader2 className="animate-spin" size={16} />
              ) : (
                "Save Changes"
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
