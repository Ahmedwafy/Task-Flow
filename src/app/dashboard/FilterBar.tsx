// // src/app/dashboard/FilterBar.tsx
"use client";

import styles from "@/app/dashboard/Dashboard.module.scss";

export default function FilterBar({
  filter,
  setFilter,
}: {
  filter: "all" | "pending" | "in-progress" | "completed" | "overdue";
  setFilter: (
    f: "all" | "pending" | "in-progress" | "completed" | "overdue"
  ) => void;
}) {
  const items = [
    { key: "all", label: "All" },
    { key: "pending", label: "Pending" },
    { key: "in-progress", label: "In progress" },
    { key: "completed", label: "Completed" },
    { key: "overdue", label: "Overdue" }, // محسوبة من dueDate
  ];

  return (
    <div className={styles.filterBar}>
      {items.map((i) => (
        <button
          key={i.key}
          className={
            filter ===
            (i.key as
              | "all"
              | "pending"
              | "in-progress"
              | "completed"
              | "overdue")
              ? styles.activeFilter
              : ""
          }
          onClick={() =>
            setFilter(
              i.key as
                | "all"
                | "pending"
                | "in-progress"
                | "completed"
                | "overdue"
            )
          }
        >
          {i.label}
        </button>
      ))}
    </div>
  );
}
