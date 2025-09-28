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
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width="18"
                height="18"
                fill="currentColor"
              >
                <path d="M3 17.25V21h3.75l11.06-11.06-3.75-3.75L3 17.25zM20.71 7.04a1.003 1.003 0 0 0 0-1.42l-2.34-2.34a1.003 1.003 0 0 0-1.42 0l-1.83 1.83 3.75 3.75 1.84-1.82z" />
              </svg>
            </button>
          </>
        )}
        <button
          className="folder-delete"
          onClick={onRemoveFolder}
          title="Supprimer le dossier"
          aria-label="Supprimer le dossier"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width="20"
            height="20"
            fill="currentColor"
          >
            <path d="M3 6h18v2H3V6zm3 3h12v12H6V9zm3-5V2h6v2h5v2H4V4h5z" />
          </svg>
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
