// frontend/app/reset-password/[token]/page.tsx

"use client";

import { useState, FormEvent, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2 } from "lucide-react";

type PageProps = { params: Promise<{ token: string }> };

export default function ResetPasswordPage({ params }: PageProps) {
  // Use React.use() to get the token from the URL parameters
  const { token } = use(params);
  const router = useRouter();

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    // Client-side validation
    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setIsLoading(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      const response = await fetch(`${apiUrl}/api/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, new_password: newPassword }),
      });

      if (!response.ok) {
        // Try to parse error detail from the backend
        const data = await response
          .json()
          .catch(() => ({ detail: "An unknown error occurred." }));
        throw new Error(
          data.detail ||
            "Failed to reset password. The link may be invalid or expired."
        );
      }

      setSuccess(
        "Password has been reset successfully! Redirecting you to log in..."
      );
      // Redirect to the login page after a short delay
      setTimeout(() => router.push("/login"), 3000);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unknown error occurred."
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
            <h1 className="text-3xl font-bold text-text">
              Reset Your Password
            </h1>
            <p className="text-muted-accent mt-2">
              Enter a new password for your account.
            </p>
          </div>

          {success && (
            <div className="p-4 bg-green-500/10 border border-green-500/30 text-green-400 rounded-md text-center">
              {success}
            </div>
          )}
          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/30 text-red-400 rounded-md text-sm">
              {error}
            </div>
          )}

          {/* Only show the form if the process is not yet successful */}
          {!success && (
            <>
              <div className="space-y-4">
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
                    className="w-full bg-primary border-2 border-border rounded-md px-3 py-2 text-text focus:ring-2 focus:ring-accent"
                    placeholder="8+ characters required"
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
                    className="w-full bg-primary border-2 border-border rounded-md px-3 py-2 text-text focus:ring-2 focus:ring-accent"
                    placeholder="Re-enter your new password"
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-6 px-4 py-3 font-semibold text-primary bg-accent rounded-md hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {isLoading ? (
                  <Loader2 className="animate-spin mx-auto" />
                ) : (
                  "Reset Password"
                )}
              </button>
            </>
          )}

          {/* Show a "Back to Login" link after success */}
          {success && (
            <Link
              href="/login"
              className="block w-full text-center mt-6 px-4 py-3 font-semibold text-primary bg-accent rounded-md hover:opacity-90 transition-opacity"
            >
              Back to Login
            </Link>
          )}
        </form>
      </div>
    </div>
  );
}
