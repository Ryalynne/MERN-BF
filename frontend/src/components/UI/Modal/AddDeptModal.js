import React, { useState } from "react";
import axios from "axios";

function AddDeptModal({ isActive, onClose, onDepartmentAdded }) {
  const [Job_Title, setJobTitle] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const saveDepartment = async (e) => {
    e.preventDefault();
    
    if (!Job_Title.trim()) {
      setError("Job Title is required");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      await axios.post("http://localhost:5000/job", { Job_Title });
      alert("Job Title added successfully!");
      setJobTitle(""); // Reset form
      onDepartmentAdded(); // Immediate refresh
      onClose(); // Trigger fetchJobs via handleModalClose
    } catch (error) {
      console.error("Error adding department:", error);
      alert("Failed to add Job Title: " + (error.response?.data?.message || error.message));
      onClose(); // Still close and refresh even on error
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    console.log("Handle close called"); // Debug log
    setJobTitle("");
    setError("");
    onClose(); // Always trigger fetchJobs
  };

  return (
    <div className={`modal ${isActive ? "is-active" : ""}`}>
      <div className="modal-background" onClick={handleClose}></div>
      <div className="modal-card">
        <header className="modal-card-head">
          <p className="modal-card-title">Add Job Title</p>
          <button 
            className="delete" 
            aria-label="close" 
            onClick={handleClose}
            disabled={isLoading}
          ></button>
        </header>
        <section className="modal-card-body">
          <form onSubmit={saveDepartment}>
            <div className="field">
              <label className="label">Job Title</label>
              <div className="control">
                <input
                  type="text"
                  className={`input ${error ? "is-danger" : ""}`}
                  value={Job_Title}
                  onChange={(e) => {
                    setJobTitle(e.target.value);
                    setError("");
                  }}
                  placeholder="Enter Job Title"
                  disabled={isLoading}
                  required
                />
              </div>
              {error && <p className="help is-danger">{error}</p>}
            </div>
          </form>
        </section>
        <footer className="modal-card-foot">
          <button 
            type="submit" 
            className={`button is-success ${isLoading ? "is-loading" : ""}`}
            onClick={saveDepartment}
            disabled={isLoading}
          >
            Save
          </button>
          <button 
            className="button" 
            onClick={handleClose}
            disabled={isLoading}
          >
            Cancel
          </button>
        </footer>
      </div>
    </div>
  );
}

export default AddDeptModal;