"use client";
import { useRouter } from "next/navigation";
import styles from "./LogoutButton.module.scss";

const LogoutButton = () => {
  const router = useRouter();

  const handleLogout = async () => {
    const res = await fetch("api/auth/logout/", {
      method: "POST",
      credentials: "include",
    });
    if (!res.ok) {
      alert("Logout failed, please try again.");
      return;
    }
    router.push("/login");
  };
  return (
    <div>
      <button onClick={handleLogout} className={styles.logoutButton}>
        Logout
      </button>
    </div>
  );
};

export default LogoutButton;
