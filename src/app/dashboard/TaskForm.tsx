// src/app/dashboard/TaskForm.tsx
"use client";

import { useState } from "react";
import styles from "@/app/dashboard/Dashboard.module.scss";

export default function TaskForm({ onTaskAdded }: { onTaskAdded: () => void }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [status, setStatus] = useState<"pending" | "in-progress" | "completed">(
    "pending"
  );
  const [busy, setBusy] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setBusy(true);
    const res = await fetch(`/api/tasks`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ title, description, status, dueDate }),
    });
    setBusy(false);

    if (res.ok) {
      setTitle("");
      setDescription("");
      setDueDate("");
      setStatus("pending");
      onTaskAdded();
    } else {
      alert("Failed to add task");
    }
  };

  return (
    <form className={styles.taskForm} onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Task title *"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <textarea
        placeholder="Task description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <div className={styles.row}>
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
        />
        <select
          value={status}
          onChange={(e) =>
            setStatus(e.target.value as "pending" | "in-progress" | "completed")
          }
        >
          <option value="pending">Pending</option>
          <option value="in-progress">In progress</option>
          <option value="completed">Completed</option>
        </select>
        <button type="submit" disabled={busy}>
          {busy ? "Adding…" : "Add Task"}
        </button>
      </div>
    </form>
  );
}
