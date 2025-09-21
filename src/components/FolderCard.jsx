import { useRef, useState } from "react";
import "../styles/FolderCard.css";
import TaskItem from "./TaskItem";

export default function FolderCard({
  folder,
  onAddTask,
  onRemoveTask,
  onToggleTask,
  onRemoveFolder,
  onRenameFolder,
  onChangeStatus,
}) {
  const [taskText, setTaskText] = useState("");
  const inputRef = useRef(null);

  const [editing, setEditing] = useState(false);
  const [nameDraft, setNameDraft] = useState(folder.name);

  const startEdit = () => {
    setNameDraft(folder.name);
    setEditing(true);
  };
  const cancelEdit = () => {
    setEditing(false);
    setNameDraft(folder.name);
  };
  const saveEdit = () => {
    const next = nameDraft.trim();
    if (next && next !== folder.name) onRenameFolder?.(folder.id, next);
    setEditing(false);
  };

  const submit = (e) => {
    e?.preventDefault?.();
    const value = taskText.trim();
    if (!value) return;
    onAddTask?.(value);
    setTaskText("");
    inputRef.current?.focus();
  };

  const handleChangeStatus = (taskId, newS) => {
    if (typeof onChangeStatus === "function") {
      onChangeStatus(taskId, newS);
    }
  };

  return (
    <section className="folder-card">
      <header className="folder-header">
        {editing ? (
          <div className="edit-folder">
            <input
              className="edit-input"
              value={nameDraft}
              onChange={(e) => setNameDraft(e.target.value)}
              autoFocus
              onKeyDown={(e) => {
                if (e.key === "Enter") saveEdit();
                if (e.key === "Escape") cancelEdit();
              }}
            />
            <button className="btn" onClick={saveEdit} aria-label="Enregistrer">
              ✔
            </button>
            <button className="btn" onClick={cancelEdit} aria-label="Annuler">
              ✖
            </button>
          </div>
        ) : (
          <>
            <h2 onDoubleClick={startEdit} title="Double-clique pour renommer">
              {folder.name}
            </h2>
            <button
              className="folder-rename"
              onClick={startEdit}
              aria-label="Renommer"
              title="Renommer"
            >
              ✎
            </button>
          </>
        )}
        <button
          className="folder-delete"
          onClick={onRemoveFolder}
          title="Supprimer le dossier"
          aria-label="Supprimer le dossier"
        >
          🗑️
        </button>
      </header>

      <form onSubmit={submit} className="task-add">
        <input
          ref={inputRef}
          value={taskText}
          onChange={(e) => setTaskText(e.target.value)}
          placeholder="Nouvelle tâche…"
        />
        <button type="submit" disabled={!taskText.trim()}>
          Ajouter
        </button>
      </form>

      <div className="task-list">
        {folder.tasks.map((t) => (
          <TaskItem
            key={t.id}
            text={t.text}
            status={t.status || "en_cours"}
            onChangeStatus={(newS) => handleChangeStatus(t.id, newS)}
            onRemove={() => onRemoveTask(t.id)}
          />
        ))}
      </div>
    </section>
  );
}
