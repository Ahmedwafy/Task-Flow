"use client";

import { useState } from "react";
import styles from "@/app/dashboard/Dashboard.module.scss";

type Task = {
  _id: string;
  title: string;
  description?: string;
  status: "completed" | "in-progress" | "pending";
  createdAt?: string;
  dueDate?: string;
};

export default function TasksList({
  tasks,
  onEdit,
  onDeleted,
}: {
  tasks: Task[];
  onEdit: (t: Task) => void;
  onDeleted: () => void;
}) {
  const [search, setSearch] = useState("");

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this task?")) return;
    const res = await fetch(`/api/tasks/${id}`, {
      method: "DELETE",
      credentials: "include",
    });
    if (res.ok) onDeleted();
    else alert("Delete failed");
  };

  const fmt = (d?: string) => (d ? new Date(d).toLocaleDateString() : "—");

  const badge = (status: string) => (
    <span className={`${styles.badge} ${styles[status.replace("-", "")]}`}>
      {status === "completed"
        ? "✅ Completed"
        : status === "in-progress"
        ? "⏳ In progress"
        : "🕒 Pending"}
    </span>
  );

  // filter tasks by search
  const filteredTasks = tasks.filter(
    (t) =>
      t.title.toLowerCase().includes(search.toLowerCase()) ||
      (t.description &&
        t.description.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className={styles.tableWrap}>
      {/* Search input */}
      <div className={styles.searchBar}>
        <input
          type="text"
          placeholder="Search by title or description..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <table className={styles.tasksTable}>
        <thead>
          <tr>
            <th style={{ width: "18%" }}>Title</th>
            <th>Description</th>
            <th style={{ width: "18%" }}>Status</th>
            <th style={{ width: "12%" }}>Created</th>
            <th style={{ width: "12%" }}>Due</th>
            <th style={{ width: "14%" }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredTasks.length === 0 ? (
            <tr>
              <td colSpan={6} className={styles.muted}>
                No tasks found.
              </td>
            </tr>
          ) : (
            filteredTasks.map((t) => (
              <tr key={t._id}>
                <td>
                  <strong>{t.title}</strong>
                </td>
                <td className={styles.descCell}>{t.description || "—"}</td>
                <td>{badge(t.status)}</td>
                <td>{fmt(t.createdAt)}</td>
                <td>{fmt(t.dueDate)}</td>
                <td className={styles.actions}>
                  <button onClick={() => onEdit(t)}>✏️ Edit</button>
                  <button onClick={() => handleDelete(t._id)}>🗑️ Delete</button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
