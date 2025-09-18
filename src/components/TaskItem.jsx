import { useEffect, useState } from "react";
import "../styles/TaskItem.css";

export default function TaskItem({
  text,
  status = "en_cours", // "en_cours" | "en_pause" | "fini"
  onChangeStatus, // (newStatus) => void
  onRemove, // () => void
}) {
  const [draft, setDraft] = useState(status);
  useEffect(() => setDraft(status), [status]);

  const validate = () => {
    if (draft && draft !== status) onChangeStatus?.(draft);
  };

  return (
    <div className={`task-card status-${status}`}>
      {/* accent optionnel (désactivé dans le CSS si tu veux) */}
      <div className="task-accent" aria-hidden />
      <div className="task-body">
        <p className="task-text">{text}</p>
      </div>

      <div className="task-footer">
        <div className="state-group" role="group" aria-label="État de la tâche">
          <label
            className={`state-chip ${draft === "en_cours" ? "is-active" : ""}`}
          >
            <input
              type="radio"
              name={`etat-${status}-${text}`} // nom unique par item
              value="en_cours"
              checked={draft === "en_cours"}
              onChange={() => setDraft("en_cours")}
            />
            En cours
          </label>

          <label
            className={`state-chip ${draft === "en_pause" ? "is-active" : ""}`}
          >
            <input
              type="radio"
              name={`etat-${status}-${text}`}
              value="en_pause"
              checked={draft === "en_pause"}
              onChange={() => setDraft("en_pause")}
            />
            En pause
          </label>

          <label
            className={`state-chip ${draft === "fini" ? "is-active" : ""}`}
          >
            <input
              type="radio"
              name={`etat-${status}-${text}`}
              value="fini"
              checked={draft === "fini"}
              onChange={() => setDraft("fini")}
            />
            Fini
          </label>
        </div>

        <div className="footer-actions">
          <button
            className="btn validate"
            onClick={validate}
            disabled={draft === status}
          >
            Valider
          </button>
          <button className="btn danger" onClick={onRemove} title="Supprimer">
            🗑️
          </button>
        </div>
      </div>
    </div>
  );
}
