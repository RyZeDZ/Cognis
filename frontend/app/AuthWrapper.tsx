import { cookies } from "next/headers";
import StoreInitializer from "@/store/StoreInitializer";
import type { User } from "@/types";

async function getUserData(token: string | undefined): Promise<User | null> {
  if (!token) {
    return null;
  }

  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    const response = await fetch(`${apiUrl}/api/users/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "force-cache",
      next: { tags: ["user"] },
    });

    if (response.ok) {
      return await response.json();
    }
    return null;
  } catch (error) {
    console.error("Failed to fetch user in wrapper:", error);
    return null;
  }
}

export default async function AuthWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;

  const user = await getUserData(token);

  return (
    <>
      <StoreInitializer user={user} />
      {children}
    </>
  );
}
