import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { pdf } from "@react-pdf/renderer";
import SalaryPDF from "../Printing/SalaryPDF";

function SalaryList() {
  // State Hooks
  const [salaries, setSalaries] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [editingId, setEditingId] = useState(null);
  const [editedSalary, setEditedSalary] = useState({});
  const [jobs, setJobs] = useState([]);
  const [isAdding, setIsAdding] = useState(false);
  const [newSalary, setNewSalary] = useState({
    dep_id: "",
    Position: "",
    Salary: "",
  });
  const [addErrors, setAddErrors] = useState({
    dep_id: false,
    Position: false,
    Salary: false,
  });
  const [editErrors, setEditErrors] = useState({
    dep_id: false,
    Position: false,
    Salary: false,
  });

  // Pagination States
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Fetch Data on Mount
  useEffect(() => {
    getUsers();
    getJobs();
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const getUsers = async () => {
    try {
      const response = await axios.get("http://localhost:5000/salary");
      setSalaries(response.data || []);
    } catch (error) {
      console.error("Error fetching salaries:", error);
      setSalaries([]);
    }
  };

  const getJobs = async () => {
    try {
      const response = await axios.get("http://localhost:5000/job");
      setJobs(response.data || []);
    } catch (error) {
      console.error("Error fetching jobs:", error);
      setJobs([]);
    }
  };

  // Filtering and Pagination Logic
  const filteredSalaries = salaries.filter((user) =>
    `${user.Job_Title} ${user.position}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  const totalItems = filteredSalaries.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
  const displayedSalaries = filteredSalaries.slice(startIndex, endIndex);

  // Pagination Handlers
  const goToPage = (page) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  const handleItemsPerPageChange = (e) => {
    const newItemsPerPage = Number(e.target.value);
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
  };

  // PDF Generation
  const handleViewPDF = async () => {
    const blob = await pdf(<SalaryPDF salaries={salaries} />).toBlob();
    const url = URL.createObjectURL(blob);
    window.open(url);
  };

  // Editing Functions
  const startEditing = (salary) => {
    const job = jobs.find((job) => job.Job_Title === salary.Job_Title);
    if (!job) {
      console.warn(`No job found for Job Title: ${salary.Job_Title}`);
      return;
    }
    const newEditedSalary = {
      dep_id: job.id.toString(),
      Position: salary.position || "",
      Salary: salary.salary || "",
    };
    setEditingId(salary.id);
    setEditedSalary(newEditedSalary);
    setEditErrors({ dep_id: false, Position: false, Salary: false });
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditedSalary({});
    setEditErrors({ dep_id: false, Position: false, Salary: false });
  };

  const handleEditChange = (e, field) => {
    const value = e.target.value;
    setEditedSalary((prev) => ({ ...prev, [field]: value }));
    setEditErrors((prev) => ({ ...prev, [field]: value.trim() === "" }));
  };

  const saveSalary = async (id) => {
    const dep_id = editedSalary.dep_id ? Number(editedSalary.dep_id) : null;
    const Position = editedSalary.Position?.trim() || "";
    const Salary = editedSalary.Salary ? parseFloat(editedSalary.Salary) : null;

    if (!dep_id || !Position || Salary === null) {
      setEditErrors({
        dep_id: !dep_id,
        Position: !Position,
        Salary: Salary === null,
      });
      return;
    }

    try {
      const payload = { dep_id, Position, Salary };
      await axios.patch(`http://localhost:5000/salary/${id}`, payload);
      await getUsers();
      setEditingId(null);
      setEditedSalary({});
      setEditErrors({ dep_id: false, Position: false, Salary: false });
    } catch (error) {
      console.error("Error updating salary:", error);
      alert("Failed to update salary: " + (error.response?.data?.message || error.message));
    }
  };

  // Add Functionality
  const startAdding = () => setIsAdding(true);

  const cancelAdding = () => {
    setIsAdding(false);
    setNewSalary({ dep_id: "", Position: "", Salary: "" });
    setAddErrors({ dep_id: false, Position: false, Salary: false });
  };

  const handleNewChange = (e, field) => {
    const value = e.target.value;
    setNewSalary((prev) => ({ ...prev, [field]: value }));
    setAddErrors((prev) => ({ ...prev, [field]: value.trim() === "" }));
  };

  const saveNewSalary = async () => {
    const newAddErrors = {
      dep_id: !newSalary.dep_id || newSalary.dep_id.trim() === "",
      Position: !newSalary.Position || newSalary.Position.trim() === "",
      Salary: !newSalary.Salary || newSalary.Salary.trim() === "",
    };

    if (newAddErrors.dep_id || newAddErrors.Position || newAddErrors.Salary) {
      setAddErrors(newAddErrors);
      return;
    }

    try {
      const payload = {
        dep_id: newSalary.dep_id,
        Position: newSalary.Position,
        Salary: newSalary.Salary,
      };
      await axios.post("http://localhost:5000/salary", payload);
      await getUsers();
      setNewSalary({ dep_id: "", Position: "", Salary: "" });
      setAddErrors({ dep_id: false, Position: false, Salary: false });
    } catch (error) {
      console.error("Error adding salary:", error);
      alert("Failed to add salary: " + (error.response?.data?.message || error.message));
    }
  };

  // Render
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
        <div className="is-flex is-justify-content-space-between mb-4 is-flex-wrap-wrap">
          <input
            type="text"
            className="input mt-2"
            style={{ maxWidth: isMobile ? "50%" : "300px", width: "100%" }}
            placeholder="Search by Job Title or Position..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
          />
          <div className="mt-2 is-flex is-flex-wrap-wrap">
            {!isMobile && !isAdding && (
              <button className="button is-success ml-3 mb-2" onClick={startAdding}>
                Add Position
              </button>
            )}
            {isMobile ? (
              <Link to="/home/AddSalary" className="button is-success ml-3 mb-2">
                Add Position
              </Link>
            ) : null}
            <button onClick={handleViewPDF} className="button is-info ml-3 mb-2">
              View PDF
            </button>
          </div>
        </div>

        {/* Modern Table Design */}
        {!isMobile ? (
          <div className="table-container box" style={{ backgroundColor: "#fff", borderRadius: "8px", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
            <table className="table is-fullwidth is-hoverable">
              <thead>
                <tr style={{ backgroundColor: "#f5f5f5" }}>
                  <th className="has-text-weight-semibold">Salary ID</th>
                  <th className="has-text-weight-semibold">Job Title</th>
                  <th className="has-text-weight-semibold">Position / Level</th>
                  <th className="has-text-weight-semibold">Salary</th>
                  <th className="has-text-weight-semibold">Action</th>
                </tr>
              </thead>
              <tbody>
                {isAdding && (
                  <tr>
                    <td className="has-text-grey">New</td>
                    <td>
                      <div className="select is-fullwidth">
                        <select
                          value={newSalary.dep_id}
                          onChange={(e) => handleNewChange(e, "dep_id")}
                          className={addErrors.dep_id ? "is-danger" : ""}
                        >
                          <option value="">Select a Job</option>
                          {jobs.map((dep) => (
                            <option key={dep.id} value={dep.id}>
                              {dep.Job_Title}
                            </option>
                          ))}
                        </select>
                      </div>
                    </td>
                    <td>
                      <input
                        type="text"
                        className={`input ${addErrors.Position ? "is-danger" : ""}`}
                        value={newSalary.Position}
                        onChange={(e) => handleNewChange(e, "Position")}
                        placeholder="Position / Level"
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        className={`input ${addErrors.Salary ? "is-danger" : ""}`}
                        value={newSalary.Salary}
                        onChange={(e) => handleNewChange(e, "Salary")}
                        placeholder="Salary"
                      />
                    </td>
                    <td>
                      <div className="buttons">
                        <button
                          className="button is-small is-success"
                          onClick={saveNewSalary}
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
                {displayedSalaries.map((user) => (
                  <tr key={user.id}>
                    <td>{user.id}</td>
                    <td>
                      {editingId === user.id ? (
                        <div className="select is-fullwidth">
                          <select
                            value={editedSalary.dep_id || ""}
                            onChange={(e) => handleEditChange(e, "dep_id")}
                            className={editErrors.dep_id ? "is-danger" : ""}
                          >
                            <option value="">Select a Job</option>
                            {jobs.map((dep) => (
                              <option key={dep.id} value={dep.id}>
                                {dep.Job_Title}
                              </option>
                            ))}
                          </select>
                        </div>
                      ) : (
                        user.Job_Title
                      )}
                    </td>
                    <td>
                      {editingId === user.id ? (
                        <input
                          type="text"
                          className={`input ${editErrors.Position ? "is-danger" : ""}`}
                          value={editedSalary.Position || ""}
                          onChange={(e) => handleEditChange(e, "Position")}
                        />
                      ) : (
                        user.position
                      )}
                    </td>
                    <td>
                      {editingId === user.id ? (
                        <input
                          type="number"
                          className={`input ${editErrors.Salary ? "is-danger" : ""}`}
                          value={editedSalary.Salary || ""}
                          onChange={(e) => handleEditChange(e, "Salary")}
                        />
                      ) : (
                        `₱${parseFloat(user.salary).toLocaleString("en-PH", {
                          minimumFractionDigits: 2,
                        })}`
                      )}
                    </td>
                    <td>
                      {editingId === user.id ? (
                        <div className="buttons">
                          <button
                            className="button is-small is-success"
                            onClick={() => saveSalary(user.id)}
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
                          onClick={() => startEditing(user)}
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
            {displayedSalaries.map((user) => (
              <div key={user.id} className="column is-12">
                <div className="card" style={{ borderRadius: "8px", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
                  <header className="card-header" style={{ backgroundColor: "#f5f5f5" }}>
                    <p className="card-header-title">{user.Job_Title}</p>
                  </header>
                  <div className="card-content">
                    <p><strong>Salary ID:</strong> {user.id}</p>
                    <p><strong>Position:</strong> {user.position}</p>
                    <p>
                      <strong>Salary:</strong>{" "}
                      {user.salary
                        ? `₱${parseFloat(user.salary).toLocaleString("en-PH", {
                            minimumFractionDigits: 2,
                          })}`
                        : "N/A"}
                    </p>
                  </div>
                  <footer className="card-footer">
                    <Link
                      to={`/home/editSalary/${user.id}`}
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

        {/* Responsive Pagination Controls */}
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

export default SalaryList;