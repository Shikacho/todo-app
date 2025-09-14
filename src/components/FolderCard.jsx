import { useState } from "react";
import "../styles/FolderCard.css";
import TaskItem from "./TaskItem";

export default function FolderCard({ folder, onAddTask, onRemoveTask, onToggleTask, onRemoveFolder }) {
  const [taskText, setTaskText] = useState("");

  const submit = (e) => {
    e?.preventDefault?.();
    onAddTask(taskText);
    setTaskText("");
  };

  return (
    <section className="folder-card">
      <header className="folder-header">
        <h2>{folder.name}</h2>
        <button className="folder-delete" onClick={onRemoveFolder} title="Supprimer le dossier">🗑️</button>
      </header>

      <form onSubmit={submit} className="task-add">
        <input
          value={taskText}
          onChange={(e) => setTaskText(e.target.value)}
          placeholder="Nouvelle tâche…"
        />
        <button type="submit">Ajouter</button>
      </form>

      <div className="task-list">
        {folder.tasks.map((t) => (
          <TaskItem
            key={t.id}
            text={t.text}
            completed={t.completed}
            onToggle={() => onToggleTask(t.id)}
            onRemove={() => onRemoveTask(t.id)}
          />
        ))}
      </div>
    </section>
  );
}
