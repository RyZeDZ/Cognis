// frontend/app/forgot-password/page.tsx
"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";
import { Loader2 } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      await fetch(`${apiUrl}/api/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      // We don't check for response.ok here for security reasons.
      // We always show a success message to prevent attackers from discovering
      // which emails are registered on the platform ("email enumeration").
      setSuccess(
        "If an account with that email exists, a password reset link has been sent."
      );
    } catch (err) {
      // Even on a network or other fetch error, show a generic success message
      // to maintain security and a consistent user experience.
      console.error("Forgot password error:", err);
      setSuccess(
        "If an account with that email exists, a password reset link has been sent."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-primary bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] px-4">
      <div className="w-full max-w-md">
        <form
          onSubmit={handleSubmit}
          className="bg-card-bg border-2 border-border rounded-lg shadow-lg p-8 space-y-6"
        >
          <div className="text-center mb-4">
            <h1 className="text-3xl font-bold text-text">Forgot Password</h1>
            <p className="text-muted-accent mt-2">
              Enter your email and we&apos;ll send you a link to reset your
              password.
            </p>
          </div>

          {/* If the form has been submitted, we only show the success message */}
          {success ? (
            <div className="p-4 bg-green-500/10 border border-green-500/30 text-green-400 rounded-md text-center">
              <p>{success}</p>
            </div>
          ) : (
            <>
              {/* Show error messages if they exist */}
              {error && (
                <div className="p-3 bg-red-500/10 border border-red-500/30 text-red-400 rounded-md text-sm">
                  {error}
                </div>
              )}

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
                  className="w-full bg-primary border-2 border-border rounded-md px-3 py-2 text-text focus:ring-2 focus:ring-accent focus:border-accent outline-none"
                  placeholder="you@example.com"
                />
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-6 px-4 py-3 font-semibold text-primary bg-accent rounded-md hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {isLoading ? (
                  <Loader2 className="animate-spin mx-auto" />
                ) : (
                  "Send Reset Link"
                )}
              </button>
            </>
          )}

          <p className="text-center text-sm text-muted-accent pt-2">
            Remember your password?{" "}
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
