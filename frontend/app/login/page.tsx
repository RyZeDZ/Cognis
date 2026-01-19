// frontend/app/login/page.tsx

"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import Cookies from "js-cookie";
import { useAuthStore } from "@/store/authStore";
import { useRedirectIfAuthenticated } from "@/hooks/useRedirectIfAuthenticated";
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
  const [rememberMe, setRememberMe] = useState(false);

  useEffect(() => {
    if (searchParams.get("status") === "success") {
      setSuccessMessage("Registration successful! Please sign in.");
    }
  }, [searchParams]);

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
      if (!response.ok)
        throw new Error(data.detail || "Google Sign-In failed.");
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
          : "An error occurred during Google Sign-In."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);
    setIsLoading(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      const response = await fetch(`${apiUrl}/api/auth/token`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, remember_me: rememberMe }),
      });
      const data = await response.json();
      if (!response.ok)
        throw new Error(data.detail || "An unknown error occurred.");
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
              <div className="flex items-center justify-between mt-4">
                {/* Remember Me */}
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="sr-only"
                  />
                  <div
                    className={`w-11 h-6 flex items-center rounded-full p-1 duration-300 ease-in-out ${
                      rememberMe ? "bg-accent" : "bg-gray-300"
                    }`}
                  >
                    <div
                      className={`bg-white w-4 h-4 rounded-full shadow-md transform duration-300 ease-in-out ${
                        rememberMe ? "translate-x-5" : "translate-x-0"
                      }`}
                    ></div>
                  </div>
                  <span className="ml-3 text-sm text-muted-accent">
                    Remember me
                  </span>
                </label>

                {/* Forgot Password */}
                <Link
                  href="/forgot-password"
                  className="text-sm font-medium text-accent hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
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

          <div className="relative w-full">
            <div className="w-full flex items-center justify-center gap-2 px-4 py-2 font-semibold text-text bg-card-bg rounded-md border-2 border-border">
              <GoogleIcon /> Continue with Google
            </div>
            <div className="absolute top-0 left-0 w-full h-full opacity-0 overflow-hidden cursor-pointer">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() =>
                  setError("Google login failed. Please try again.")
                }
                theme="outline"
                size="large"
                shape="rectangular"
              />
            </div>
          </div>

          <p className="text-center text-sm text-muted-accent pt-2">
            Don&apos;t have an account?{" "}
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
