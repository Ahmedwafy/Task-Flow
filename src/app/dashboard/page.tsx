import LogoutButton from "@/app/components/LogOutBtn/LogoutButton";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { redirect } from "next/navigation";
import styles from "./Dashboard.module.scss";
import DashboardClient from "./DashboardClient";

const JWT_SECRET = process.env.JWT_SECRET as string;

type Payload = {
  id: string;
  email?: string;
  name?: string;
  role?: "user" | "admin";
};

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  if (!token) redirect("/login");

  let user: Payload | null = null;
  try {
    user = jwt.verify(token, JWT_SECRET) as Payload;
  } catch {
    redirect("/login");
  }

  return (
    <div className={styles.dashboard}>
      <header className={styles.header}>
        <h1>TaskFlow Dashboard</h1>
        <LogoutButton />
      </header>

      {/* send user data to client */}
      <DashboardClient
        user={{
          role: user?.role || "user",
          name: user?.name || "",
          email: user?.email || "",
        }}
      />
    </div>
  );
}
