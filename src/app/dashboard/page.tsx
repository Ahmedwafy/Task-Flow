// src/app/dashboard/page.tsx
"use client";
import { Task } from "@/types/task";
import { useEffect, useState } from "react";
import styles from "./Dashboard.module.scss";
import LogoutButton from "@/app/components/LogOutBtn/LogoutButton";
import TasksList from "./TasksList";
import TaskForm from "./TaskForm";
import FilterBar from "./FilterBar";

export default function DashboardPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  // جلب المهام من الـ API
  const fetchTasks = async () => {
    setLoading(true);
    const res = await fetch(`/api/tasks`, {
      method: "GET",
    });
    if (res.ok) {
      const data = await res.json();
      setTasks(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const filteredTasks = tasks.filter((task) => {
    if (filter === "all") return true;
    return task.status === filter;
  });
  console.log("Tasks:", tasks);

  return (
    <div className={styles.dashboard}>
      <header className={styles.header}>
        <h1>📋 TaskFlow Dashboard</h1>
        <LogoutButton />
      </header>

      <FilterBar filter={filter} setFilter={setFilter} />

      <TaskForm onTaskAdded={fetchTasks} />

      {loading ? (
        <p>Loading tasks...</p>
      ) : (
        <TasksList tasks={filteredTasks} onTasksChange={fetchTasks} />
      )}
    </div>
  );
}
