"use client";
import { useState } from "react";
import styles from "./Dashboard.module.scss";
import { Task } from "@/types/task";
import { Pencil, Trash } from "lucide-react";

interface TasksListProps {
  tasks: Task[];
  onTasksChange: () => void;
}

export default function TasksList({ tasks, onTasksChange }: TasksListProps) {
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Task>>({});

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this task?")) return;
    const res = await fetch(`/api/tasks/${id}`, { method: "DELETE" });
    if (res.ok) onTasksChange();
  };

  const startEditing = (task: Task) => {
    setEditingTaskId(task._id);
    setEditForm(task);
  };

  const cancelEditing = () => {
    setEditingTaskId(null);
    setEditForm({});
  };

  const saveEdit = async () => {
    const res = await fetch(`/api/tasks/${editingTaskId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editForm),
    });
    if (res.ok) {
      onTasksChange();
      setEditingTaskId(null);
    }
  };

  return (
    <table className={styles.tasksTable}>
      <thead>
        <tr>
          <th>Title</th>
          <th>Description</th>
          <th>Status</th>
          <th>Created At</th>
          <th>Due Date</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {tasks.map((task) => (
          <tr key={task._id}>
            {editingTaskId === task._id ? (
              <>
                <td>
                  <input
                    value={editForm.title || ""}
                    onChange={(e) =>
                      setEditForm({ ...editForm, title: e.target.value })
                    }
                  />
                </td>
                <td>
                  <input
                    value={editForm.description || ""}
                    onChange={(e) =>
                      setEditForm({ ...editForm, description: e.target.value })
                    }
                  />
                </td>
                <td>
                  <select
                    value={editForm.status || ""}
                    onChange={(e) =>
                      setEditForm({ ...editForm, status: e.target.value })
                    }
                  >
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                  </select>
                </td>
                <td>{new Date(task.createdAt).toLocaleDateString()}</td>
                <td>
                  <input
                    type="date"
                    value={
                      editForm.dueDate
                        ? new Date(editForm.dueDate).toISOString().split("T")[0]
                        : ""
                    }
                    onChange={(e) =>
                      setEditForm({ ...editForm, dueDate: e.target.value })
                    }
                  />
                </td>
                <td>
                  <button onClick={saveEdit}>💾 Save</button>
                  <button onClick={cancelEditing}>❌ Cancel</button>
                </td>
              </>
            ) : (
              <>
                <td>{task.title}</td>
                <td>{task.description}</td>
                <td>{task.status}</td>
                <td>{new Date(task.createdAt).toLocaleDateString()}</td>
                <td>
                  {task.dueDate
                    ? new Date(task.dueDate).toLocaleDateString()
                    : "-"}
                </td>
                <td className={styles.actions}>
                  <button
                    className={styles.btn}
                    onClick={() => startEditing(task)}
                  >
                    <Pencil />
                  </button>
                  <button
                    className={styles.btn}
                    onClick={() => handleDelete(task._id)}
                  >
                    <Trash />
                  </button>
                </td>
              </>
            )}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
