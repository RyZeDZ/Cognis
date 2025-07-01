"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import Cookies from "js-cookie";
import { useAuthStore } from "@/store/authStore";
import { useRedirectIfAuthenticated } from "@/hooks/useRedirectIfAuthenticated";
import { GoogleLogin, type CredentialResponse } from "@react-oauth/google";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isLoading: isAuthLoading, isAuthenticated } =
    useRedirectIfAuthenticated();
  const setUser = useAuthStore((state) => state.setUser);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleGoogleSuccess = async (
    credentialResponse: CredentialResponse
  ) => {
    setIsLoading(true);
    setError(null);

    const idToken = credentialResponse.credential;
    if (!idToken) {
      setError("Google login failed: No ID token received.");
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
      if (!response.ok) {
        throw new Error(data.detail || "Google Sign-In failed.");
      }

      Cookies.set("access_token", data.access_token, {
        expires: 7,
        secure: false,
        sameSite: "strict",
      });
      setUser(data.user);
      router.push("/");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "An error occurred during Google Sign-In."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleError = () => {
    setError("Google login failed. Please try again.");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);
    setIsLoading(true);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      const response = await fetch(`${apiUrl}/api/users/token`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.detail || "An unknown error occurred.");
      }
      Cookies.set("access_token", data.access_token, {
        secure: process.env.NODE_ENV === "production",
        expires: 7,
        sameSite: "strict",
      });

      setUser(data.user);

      router.push("/");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Login failed. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (searchParams.get("status") === "success") {
      setSuccessMessage("Registration successful! Please sign in.");
    }
  }, [searchParams]);

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
            <h1 className="text-3xl font-bold text-text">Welcome Back</h1>
            <p className="text-muted-accent mt-2">
              Sign in to unlock your potential.
            </p>
          </div>

          {/* MESSAGE BOX */}
          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/30 text-red-400 rounded-md text-sm">
              {error}
            </div>
          )}
          {successMessage && (
            <div className="p-3 bg-green-500/10 border border-green-500/30 text-green-400 rounded-md text-sm">
              {successMessage}
            </div>
          )}

          <div className="space-y-4">
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
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-6 px-4 py-3 font-semibold text-primary bg-accent rounded-md hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {isLoading ? "Signing in..." : "Sign In"}
          </button>

          <div className="relative flex py-2 items-center">
            <div className="flex-grow border-t border-border"></div>
            <span className="flex-shrink mx-4 text-muted-accent text-xs">
              OR
            </span>
            <div className="flex-grow border-t border-border"></div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
              theme="outline"
              size="large"
              shape="rectangular"
              width="100%"
              logo_alignment="left"
            />
          </div>

          <p className="text-center text-sm text-muted-accent pt-2">
            Dont have an account?{" "}
            <Link
              href="/register"
              className="font-semibold text-accent hover:underline"
            >
              Sign Up
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
