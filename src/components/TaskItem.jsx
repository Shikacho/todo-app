import "../styles/TaskItem.css";

export default function TaskItem({ text, completed, onToggle, onRemove }) {
  return (
    <div className={`task-item ${completed ? "is-done" : ""}`}>
      <span className="task-text">{text}</span>

      <div className="task-actions">
        <button className="task-toggle" onClick={onToggle}>
          {completed ? "✅ Terminée" : "⏳ À faire"}
        </button>
        <button className="task-remove" onClick={onRemove} title="Supprimer">❌</button>
      </div>
    </div>
  );
}
