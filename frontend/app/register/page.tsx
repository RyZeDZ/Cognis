// frontend/app/register/page.tsx

"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { useRedirectIfAuthenticated } from "@/hooks/useRedirectIfAuthenticated";
import Cookies from "js-cookie";
import { GoogleLogin, type CredentialResponse } from "@react-oauth/google";
import { type FastAPIValidationError } from "@/types";

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

export default function RegisterPage() {
  const { isLoading: isAuthLoading, isAuthenticated } =
    useRedirectIfAuthenticated();
  const router = useRouter();
  const setUser = useAuthStore((state) => state.setUser);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGoogleSuccess = async (
    credentialResponse: CredentialResponse
  ) => {
    setIsLoading(true);
    setError(null);
    const idToken = credentialResponse.credential;
    if (!idToken) {
      setError("Google signup failed: No ID token received.");
      setIsLoading(false);
      return;
    }
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      const response = await fetch(`${apiUrl}/api/auth/google/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: idToken }),
      });
      const data = await response.json();
      if (!response.ok)
        throw new Error(data.detail || "Google Sign-Up failed.");
      Cookies.set("access_token", data.access_token, {
        expires: 7,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
      });
      setUser(data.user);
      router.push("/");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "An error occurred during Google Sign-Up."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      setIsLoading(false);
      return;
    }
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      const response = await fetch(`${apiUrl}/api/users/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });
      const data = await response.json();
      if (!response.ok) {
        if (data.detail && Array.isArray(data.detail)) {
          const errorMessages = data.detail
            .map((err: FastAPIValidationError) => `${err.loc[1]}: ${err.msg}`)
            .join(", ");
          throw new Error(errorMessages);
        } else {
          throw new Error(data.detail || "Failed to create account.");
        }
      }
      router.push("/login?status=success");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unknown error occurred."
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (isAuthLoading || isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-primary">
        <Loader2 className="h-12 w-12 animate-spin text-accent" />
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-primary bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] px-4">
      <div className="w-full max-w-md">
        <form
          onSubmit={handleSubmit}
          className="bg-card-bg border-2 border-border rounded-lg shadow-lg p-8 space-y-6"
        >
          <div className="text-center mb-4">
            <h1 className="text-3xl font-bold text-text">Create an Account</h1>
            <p className="text-muted-accent mt-2">
              Join Cognis and start learning.
            </p>
          </div>

          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/30 text-red-400 rounded-md text-sm">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-muted-accent mb-2"
              >
                Username
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full bg-primary border-2 border-border rounded-md px-3 py-2 text-text focus:ring-2 focus:ring-accent"
                placeholder="Your unique username"
              />
            </div>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-muted-accent mb-2"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-primary border-2 border-border rounded-md px-3 py-2 text-text focus:ring-2 focus:ring-accent"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-muted-accent mb-2"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-primary border-2 border-border rounded-md px-3 py-2 text-text focus:ring-2 focus:ring-accent"
                placeholder="8+ characters required"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-6 px-4 py-3 font-semibold text-primary bg-accent rounded-md hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {isLoading ? "Creating Account..." : "Sign Up"}
          </button>
          <div className="relative flex py-2 items-center">
            <div className="flex-grow border-t border-border"></div>
            <span className="flex-shrink mx-4 text-muted-accent text-xs">
              OR
            </span>
            <div className="flex-grow border-t border-border"></div>
          </div>

          <div className="relative w-full">
            <div className="w-full flex items-center justify-center gap-2 px-4 py-2 font-semibold text-text bg-card-bg rounded-md border-2 border-border">
              <GoogleIcon /> Continue with Google
            </div>
            <div className="absolute top-0 left-0 w-full h-full opacity-0 overflow-hidden cursor-pointer">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() =>
                  setError("Google signup failed. Please try again.")
                }
                theme="outline"
                size="large"
                shape="rectangular"
              />
            </div>
          </div>

          <p className="text-center text-sm text-muted-accent pt-2">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-semibold text-accent hover:underline"
            >
              Sign In
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
