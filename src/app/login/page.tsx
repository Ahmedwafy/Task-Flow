"use client";

import styles from "./login.module.scss";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  // Handle Submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
      credentials: "include",
    });

    if (res.ok) {
      router.push("/dashboard");
    } else {
      const data = await res.json();
      alert(data.error || "Login failed");
    }
  };

  return (
    <div className="container">
      <h1 className={styles.logo}>
        <Link href="/" className={styles.link}>
          Task Flow
        </Link>
      </h1>
      <h2 className={styles.title}>Login</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
          }}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
          }}
          required
        />
        <button type="submit">Login</button>
        <p>
          Don&apos;t have an account? <Link href="/signup">Sign up</Link>
        </p>
      </form>
    </div>
  );
}
