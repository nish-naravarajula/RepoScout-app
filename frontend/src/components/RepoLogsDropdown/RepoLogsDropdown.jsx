import "./RepoLogsDropdown.css";
import { useState } from "react";

function RepoLogsDropdown({ log, onUpdateLog, onDeleteLog }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const [editedLog, setEditedLog] = useState({
    focusArea: log.focusArea || "",
    filesModified: log.filesModified || "",
    bugsFixed: log.bugsFixed || "",
    learned: log.learned || "",
  });

  function handleToggle() {
    setIsOpen((prev) => {
      return !prev;
    });
  }

  function handleChange(event) {
    const { name, value } = event.target;

    setEditedLog((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  }

  function handleEditClick() {
    setEditedLog({
      focusArea: log.focusArea || "",
      filesModified: log.filesModified || "",
      bugsFixed: log.bugsFixed || "",
      learned: log.learned || "",
    });

    setIsEditing(true);
  }

  function handleCancelEdit() {
    setEditedLog({
      focusArea: log.focusArea || "",
      filesModified: log.filesModified || "",
      bugsFixed: log.bugsFixed || "",
      learned: log.learned || "",
    });

    setIsEditing(false);
  }

  async function handleSave() {
    try {
      const response = await fetch(`/api/repo-logs/${log._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editedLog),
      });

      if (!response.ok) {
        throw new Error("Failed to update log");
      }

      const updatedLog = await response.json();
      onUpdateLog(updatedLog);
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating log:", error);
    }
  }

  async function handleDelete() {
    try {
      const response = await fetch(`/api/repo-logs/${log._id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete log");
      }

      onDeleteLog(log._id);
    } catch (error) {
      console.error("Error deleting log:", error);
    }
  }

  return (
    <div className="repo-logs-dropdown">
      <button
        type="button"
        className="repo-log-toggle-button"
        onClick={handleToggle}
      >
        <div className="log-dropdown-header-left">
          <p className="log-dropdown-title">Worked on: {log.focusArea}</p>
        </div>

        <span className="log-accordion-icon">{isOpen ? "-" : "+"}</span>
      </button>

      {isOpen && (
        <div className="log-dropdown-content">
          {isEditing ? (
            <>
              <div className="log-detail-block">
                <h4 className="log-detail-title">Focus area:</h4>
                <input
                  type="text"
                  name="focusArea"
                  value={editedLog.focusArea}
                  onChange={handleChange}
                  className="log-input"
                />
              </div>

              <div className="log-detail-block">
                <h4 className="log-detail-title">Files created or modified:</h4>
                <textarea
                  name="filesModified"
                  value={editedLog.filesModified}
                  onChange={handleChange}
                  className="log-textarea"
                />
              </div>

              <div className="log-detail-block">
                <h4 className="log-detail-title">Bugs fixed:</h4>
                <textarea
                  name="bugsFixed"
                  value={editedLog.bugsFixed}
                  onChange={handleChange}
                  className="log-textarea"
                />
              </div>

              <div className="log-detail-block">
                <h4 className="log-detail-title">What I learned:</h4>
                <textarea
                  name="learned"
                  value={editedLog.learned}
                  onChange={handleChange}
                  className="log-textarea"
                />
              </div>

              <div className="log-action-buttons">
                <button
                  type="button"
                  className="log-save-button"
                  onClick={handleSave}
                >
                  Save
                </button>

                <button
                  type="button"
                  className="log-cancel-button"
                  onClick={handleCancelEdit}
                >
                  Cancel
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="log-detail-block">
                <h4 className="log-detail-title">Focus area:</h4>
                <p className="log-detail-text">{log.focusArea}</p>
              </div>

              <div className="log-detail-block">
                <h4 className="log-detail-title">Files created or modified:</h4>
                <p className="log-detail-text">{log.filesModified}</p>
              </div>

              <div className="log-detail-block">
                <h4 className="log-detail-title">Bugs fixed:</h4>
                <p className="log-detail-text">{log.bugsFixed}</p>
              </div>

              <div className="log-detail-block">
                <h4 className="log-detail-title">What I learned:</h4>
                <p className="log-detail-text">{log.learned}</p>
              </div>

              <div className="log-action-buttons">
                <button
                  type="button"
                  className="log-edit-button"
                  onClick={handleEditClick}
                >
                  Edit
                </button>

                <button
                  type="button"
                  className="log-delete-button"
                  onClick={handleDelete}
                >
                  Delete
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default RepoLogsDropdown;
