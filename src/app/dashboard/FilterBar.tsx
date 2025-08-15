// src/app/dashboard/FilterBar.tsx
"use client";
import styles from "./Dashboard.module.scss";

type FilterBarProps = {
  filter: string;
  setFilter: (filter: string) => void;
};

export default function FilterBar({ filter, setFilter }: FilterBarProps) {
  return (
    <div className={styles.filterBar}>
      {["all", "pending", "in-progress", "completed"].map((e) => (
        <button
          key={e}
          className={`${styles.btn} ${filter === e ? styles.activeFilter : ""}`}
          onClick={() => setFilter(e)}
        >
          {e}
        </button>
      ))}
    </div>
  );
}
