import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function DepartList() {
  const [jobs, setJobs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [editingJobId, setEditingJobId] = useState(null);
  const [editedJobTitle, setEditedJobTitle] = useState("");
  const [newJobTitle, setNewJobTitle] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [addError, setAddError] = useState(false);
  const [editError, setEditError] = useState(false);
  
  // Pagination States
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  useEffect(() => {
    fetchJobs();
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const fetchJobs = async () => {
    try {
      const response = await axios.get("http://localhost:5000/job");
      const data = Array.isArray(response.data) ? response.data : [];
      const sanitizedJobs = data
        .filter((job) => job !== null && typeof job === "object")
        .map((job) => {
          const title =
            job.Job_Title ||
            job.job_title ||
            job.Department_Name ||
            job.department_name ||
            "";
          const id = job.id || job.ID || Date.now() + Math.random();
          return { id, Job_Title: title };
        });
      setJobs(sanitizedJobs);
    } catch (error) {
      console.error("Error fetching job titles:", error);
      setJobs([]);
    }
  };

  const startAdding = () => {
    setIsAdding(true);
    setNewJobTitle("");
    setAddError(false);
  };

  const cancelAdding = () => {
    setIsAdding(false);
    setNewJobTitle("");
    setAddError(false);
  };

  const saveNewJob = async () => {
    if (!newJobTitle.trim()) {
      setAddError(true);
      return;
    }
    try {
      const payload = { Department_Name: newJobTitle };
      await axios.post("http://localhost:5000/job", payload);
      setNewJobTitle("");
      setAddError(false);
      fetchJobs();
    } catch (error) {
      console.error("Error adding job title:", error);
      alert("Failed to add Job Title: " + (error.response?.data?.message || error.message));
    }
  };

  const startEditing = (job) => {
    setEditingJobId(job.id);
    setEditedJobTitle(job.Job_Title || "");
    setEditError(false);
  };

  const cancelEditing = () => {
    setEditingJobId(null);
    setEditedJobTitle("");
    setEditError(false);
  };

  const saveJobTitle = async (id) => {
    if (!editedJobTitle.trim()) {
      setEditError(true);
      return;
    }
    try {
      const payload = { job_title: editedJobTitle };
      await axios.patch(`http://localhost:5000/job/${id}`, payload);
      setJobs(
        jobs.map((job) =>
          job.id === id ? { ...job, Job_Title: editedJobTitle } : job
        )
      );
      setEditingJobId(null);
      setEditError(false);
    } catch (error) {
      console.error("Error updating job title:", error);
      alert("Failed to update job title: " + (error.response?.data?.message || error.message));
    }
  };

  const handleNewJobChange = (e) => {
    setNewJobTitle(e.target.value);
    if (e.target.value.trim()) setAddError(false);
  };

  const handleEditJobChange = (e) => {
    setEditedJobTitle(e.target.value);
    if (e.target.value.trim()) setEditError(false);
  };

  // Filtering and Pagination Logic
  const filteredJobs = jobs
    .filter((job) => job && typeof job === "object")
    .filter((job) =>
      (job.Job_Title || "").toLowerCase().includes(searchTerm.toLowerCase())
    );

  const totalItems = filteredJobs.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
  const displayedJobs = filteredJobs.slice(startIndex, endIndex);

  // Pagination Handlers
  const goToPage = (page) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  const handleItemsPerPageChange = (e) => {
    const newItemsPerPage = Number(e.target.value);
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
  };

  return (
    <div style={{ position: "relative" }}>
      {/* Background Image and Overlay */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          backgroundImage: "url('/loginBanner.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundAttachment: "fixed",
          zIndex: -2,
        }}
      />
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          background: "rgba(0, 0, 0, 0.5)",
          zIndex: -1,
        }}
      />

      <div
        className="column container mt-5"
        style={{ position: "relative", zIndex: 1 }}
      >
        {/* Header Section */}
        <div className="is-flex is-justify-content-space-between mb-4 is-flex-wrap-wrap">
          <input
            type="text"
            className="input mt-2"
            style={{ maxWidth: isMobile ? "50%" : "300px", width: "100%" }}
            placeholder="Search Job Title..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
          />
          <div className="mt-2">
            {!isMobile && !isAdding && (
              <button className="button is-success" onClick={startAdding}>
                Add Job Title
              </button>
            )}
            {isMobile && (
              <Link to="/home/AddJob" className="button is-success">
                Add Job Title
              </Link>
            )}
          </div>
        </div>

        {/* Modern Table Design */}
        {!isMobile ? (
          <div className="table-container box" style={{ backgroundColor: "#fff", borderRadius: "8px", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
            <table className="table is-fullwidth is-hoverable">
              <thead>
                <tr style={{ backgroundColor: "#f5f5f5" }}>
                  <th className="has-text-weight-semibold">Job ID</th>
                  <th className="has-text-weight-semibold">Job Title</th>
                  <th className="has-text-weight-semibold">Action</th>
                </tr>
              </thead>
              <tbody>
                {isAdding && (
                  <tr>
                    <td className="has-text-grey">New</td>
                    <td>
                      <input
                        type="text"
                        className={`input ${addError ? "is-danger" : ""}`}
                        value={newJobTitle}
                        onChange={handleNewJobChange}
                        placeholder="Enter new job title"
                      />
                    </td>
                    <td>
                      <div className="buttons">
                        <button
                          className="button is-small is-success"
                          onClick={saveNewJob}
                        >
                          Save
                        </button>
                        <button
                          className="button is-small is-danger is-outlined"
                          onClick={cancelAdding}
                        >
                          Cancel
                        </button>
                      </div>
                    </td>
                  </tr>
                )}
                {displayedJobs.map((job) => (
                  <tr key={job.id || Math.random()}>
                    <td>{job.id || "N/A"}</td>
                    <td>
                      {editingJobId === job.id ? (
                        <input
                          type="text"
                          className={`input ${editError ? "is-danger" : ""}`}
                          value={editedJobTitle}
                          onChange={handleEditJobChange}
                        />
                      ) : (
                        job.Job_Title || "Untitled"
                      )}
                    </td>
                    <td>
                      {editingJobId === job.id ? (
                        <div className="buttons">
                          <button
                            className="button is-small is-success"
                            onClick={() => saveJobTitle(job.id)}
                          >
                            Save
                          </button>
                          <button
                            className="button is-small is-danger is-outlined"
                            onClick={cancelEditing}
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          className="button is-small is-info is-outlined"
                          onClick={() => startEditing(job)}
                        >
                          Edit
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="columns is-multiline">
            {displayedJobs.map((job) => (
              <div key={job.id || Math.random()} className="column is-12">
                <div className="card" style={{ borderRadius: "8px", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
                  <header className="card-header" style={{ backgroundColor: "#f5f5f5" }}>
                    <p className="card-header-title">
                      {job.Job_Title || "Untitled"}
                    </p>
                  </header>
                  <div className="card-content">
                    <p className="subtitle is-6">
                      <strong>Job ID:</strong> {job.id || "N/A"}
                    </p>
                  </div>
                  <footer className="card-footer">
                    <Link
                      to={`/home/editJobTitle/${job.id}`}
                      className="card-footer-item button is-small is-info is-outlined"
                    >
                      Edit
                    </Link>
                  </footer>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination Controls */}
        <nav
          className="pagination is-centered mt-4"
          role="navigation"
          aria-label="pagination"
        >
          <div className="is-flex is-align-items-center is-flex-wrap-wrap is-justify-content-center">
            <div className="is-flex is-align-items-center mb-2 mr-4">
              <label className="has-text-white mr-2">Items per page:</label>
              <div className="select">
                <select
                  value={itemsPerPage}
                  onChange={handleItemsPerPageChange}
                >
                  <option value="5">5</option>
                  <option value="10">10</option>
                  <option value="20">20</option>
                  <option value="50">50</option>
                </select>
              </div>
            </div>
            <div className="is-flex is-align-items-center">
              <button
                className="button is-small is-light mr-2"
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Previous
              </button>
              <span className="has-text-white mx-2">
                Page {currentPage} of {totalPages}
              </span>
              <button
                className="button is-small is-light ml-2"
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </div>
          </div>
          <p className="has-text-white mt-2">
            Showing {startIndex + 1} to {endIndex} of {totalItems} entries
          </p>
        </nav>
      </div>
    </div>
  );
}

export default DepartList;