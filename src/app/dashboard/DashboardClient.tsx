"use client";
import { useEffect, useMemo, useState } from "react";
import styles from "@/app/dashboard/Dashboard.module.scss";
import TasksList from "./TasksList";
import TaskForm from "./TaskForm";
import FilterBar from "./FilterBar";
import EditTaskModal from "@/app/dashboard/EditTaskModal";

type UserLite = { role: "user" | "admin"; name?: string; email?: string };

type Task = {
  _id: string;
  title: string;
  description?: string;
  status: "completed" | "in-progress" | "pending";
  createdAt?: string;
  dueDate?: string;
};

export default function DashboardClient({ user }: { user: UserLite }) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filter, setFilter] = useState<
    "all" | "pending" | "in-progress" | "completed" | "overdue"
  >("all");
  const [loading, setLoading] = useState(true);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [scopeAll, setScopeAll] = useState(false); // for admin only

  const fetchTasks = async () => {
    setLoading(true);
    const qs = user.role === "admin" && scopeAll ? "?scope=all" : "";
    const res = await fetch(`/api/tasks${qs}`, { credentials: "include" });
    if (res.ok) {
      const data = await res.json();
      setTasks(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchTasks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scopeAll]);

  const filteredTasks = useMemo(() => {
    const now = new Date();
    return tasks.filter((t) => {
      if (filter === "all") return true;
      if (filter === "overdue") {
        const due = t.dueDate ? new Date(t.dueDate) : null;
        return due && due < now && t.status !== "completed";
      }
      return t.status === filter;
    });
  }, [tasks, filter]);

  return (
    <>
      <h2>Filter Bar</h2>
      <div className={styles.topBar}>
        <FilterBar filter={filter} setFilter={setFilter} />
        {user.role === "admin" && (
          <label className={styles.toggleAll}>
            <input
              type="checkbox"
              checked={scopeAll}
              onChange={(e) => setScopeAll(e.target.checked)}
            />
            View all user&apos;s tasks
          </label>
        )}
      </div>

      {/* Task Form  */}
      <TaskForm onTaskAdded={fetchTasks} />

      {loading ? (
        <p className={styles.muted}>Loading tasks…</p>
      ) : (
        <TasksList
          tasks={filteredTasks}
          onEdit={(task) => setEditingTask(task)}
          onDeleted={fetchTasks}
        />
      )}

      {editingTask && (
        <EditTaskModal
          task={editingTask}
          onClose={() => setEditingTask(null)}
          onSaved={() => {
            setEditingTask(null);
            fetchTasks();
          }}
        />
      )}
    </>
  );
}
