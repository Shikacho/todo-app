import { useState } from "react";
import "../styles/TodoApp.css";
import FolderCard from "./FolderCard";

const uid = () => (crypto?.randomUUID ? crypto.randomUUID() : String(Date.now() + Math.random()));

export default function TodoApp() {
  const [folderName, setFolderName] = useState("");
  const [folders, setFolders] = useState([]); 
  
  const addFolder = () => {
    const name = folderName.trim();
    if (!name) return;
    setFolders((fs) => [...fs, { id: uid(), name, tasks: [] }]);
    setFolderName("");
  };


  const addTaskToFolder = (folderId, text) => {
    const value = text.trim();
    if (!value) return;
    setFolders((fs) =>
      fs.map((f) =>
        f.id === folderId
          ? { ...f, tasks: [...f.tasks, { id: uid(), text: value, completed: false }] }
          : f
      )
    );
  };

  const removeTaskFromFolder = (folderId, taskId) => {
    setFolders((fs) =>
      fs.map((f) =>
        f.id === folderId ? { ...f, tasks: f.tasks.filter((t) => t.id !== taskId) } : f
      )
    );
  };

  const toggleTaskInFolder = (folderId, taskId) => {
    setFolders((fs) =>
      fs.map((f) =>
        f.id === folderId
          ? {
              ...f,
              tasks: f.tasks.map((t) =>
                t.id === taskId ? { ...t, completed: !t.completed } : t
              ),
            }
          : f
      )
    );
  };

  const removeFolder = (folderId) => {
    setFolders((fs) => fs.filter((f) => f.id !== folderId));
  };

  return (
    <div className="todo-container">
      <h1>To-do list</h1>
      

      <div className="add-folder">
        <input
          type="text"
          value={folderName}
          onChange={(e) => setFolderName(e.target.value)}
          placeholder="Nom du dossier…"
        />
        <button onClick={addFolder}>Ajouter</button>
      </div>

      <div className="folder-grid">
        {folders.map((folder) => (
          <FolderCard
            key={folder.id}
            folder={folder}
            onAddTask={(text) => addTaskToFolder(folder.id, text)}
            onRemoveTask={(taskId) => removeTaskFromFolder(folder.id, taskId)}
            onToggleTask={(taskId) => toggleTaskInFolder(folder.id, taskId)}
            onRemoveFolder={() => removeFolder(folder.id)}
          />
        ))}
      </div>
    </div>
  );
}
