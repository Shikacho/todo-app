import { useState } from "react";
import "../styles/TodoApp.css";
import FolderCarousel from "./FolderCarousel";

const uid = () =>
  crypto?.randomUUID ? crypto.randomUUID() : String(Date.now() + Math.random());

export default function TodoApp() {
  const [folderName, setFolderName] = useState("");
  const [folders, setFolders] = useState([]);

  const addFolder = () => {
    const name = folderName.trim();
    if (!name) return;
    setFolders((fs) => [...fs, { id: uid(), name, tasks: [] }]);
    setFolderName("");
  };

  const removeFolder = (folderId) => {
    setFolders((fs) => fs.filter((f) => f.id !== folderId));
  };

  const renameFolder = (folderId, newName) => {
    const name = newName.trim();
    if (!name) return;
    setFolders((fs) => fs.map((f) => (f.id === folderId ? { ...f, name } : f)));
  };

  const addTaskToFolder = (folderId, text) => {
    const value = text.trim();
    if (!value) return;
    setFolders((fs) =>
      fs.map((f) =>
        f.id === folderId
          ? {
              ...f,
              tasks: [
                ...f.tasks,
                {
                  id: uid(),
                  text: value,
                  completed: false,
                  status: "en_cours",
                },
              ],
            }
          : f
      )
    );
  };

  const removeTaskFromFolder = (folderId, taskId) => {
    setFolders((fs) =>
      fs.map((f) =>
        f.id === folderId
          ? { ...f, tasks: f.tasks.filter((t) => t.id !== taskId) }
          : f
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

  const changeTaskStatus = (folderId, taskId, status) => {
    setFolders((fs) =>
      fs.map((f) =>
        f.id === folderId
          ? {
              ...f,
              tasks: f.tasks.map((t) =>
                t.id === taskId ? { ...t, status } : t
              ),
            }
          : f
      )
    );
  };

  return (
    <div className="todo-container">
      <h1>To-do list</h1>

      <form
        className="add-folder"
        onSubmit={(e) => {
          e.preventDefault();
          addFolder();
        }}
      >
        <input
          type="text"
          value={folderName}
          onChange={(e) => setFolderName(e.target.value)}
          placeholder="Nom du dossier…"
        />
        <button type="submit">Ajouter</button>
      </form>

      {folders.length > 0 && (
        <FolderCarousel
          folders={folders}
          onAddTask={addTaskToFolder}
          onRemoveTask={removeTaskFromFolder}
          onToggleTask={toggleTaskInFolder}
          onRemoveFolder={removeFolder}
          onRenameFolder={renameFolder}
          onChangeStatus={changeTaskStatus}
        />
      )}
    </div>
  );
}
