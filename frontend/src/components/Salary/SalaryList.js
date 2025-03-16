import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { pdf } from "@react-pdf/renderer";
import SalaryPDF from "../Printing/SalaryPDF";

function SalaryList() {
  // Existing State Hooks
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
  const [addJobSearch, setAddJobSearch] = useState("");
  const [editJobSearch, setEditJobSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Sorting State
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "ascending",
  });

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

  // Sorting Logic
  const requestSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const getSortedSalaries = (salaries) => {
    if (!sortConfig.key) return salaries;

    const sorted = [...salaries].sort((a, b) => {
      let aValue = a[sortConfig.key];
      let bValue = b[sortConfig.key];

      if (sortConfig.key === "Job_Title") {
        aValue = a.Job_Title || "";
        bValue = b.Job_Title || "";
      } else if (sortConfig.key === "position") {
        aValue = a.position || "";
        bValue = b.position || "";
      } else if (sortConfig.key === "salary") {
        aValue = parseFloat(a.salary) || 0;
        bValue = parseFloat(b.salary) || 0;
      } else if (sortConfig.key === "id") {
        aValue = a.id || 0;
        bValue = b.id || 0;
      }

      if (typeof aValue === "string") {
        return sortConfig.direction === "ascending"
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }
      return sortConfig.direction === "ascending"
        ? aValue - bValue
        : bValue - aValue;
    });
    return sorted;
  };

  // Filtering Jobs for Dropdown
  const getFilteredJobs = (searchTerm) => {
    return jobs.filter((job) =>
      job.Job_Title.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  // Filtering and Pagination Logic
  const filteredSalaries = salaries.filter((user) =>
    `${user.Job_Title} ${user.position}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  const sortedSalaries = getSortedSalaries(filteredSalaries);

  const totalItems = sortedSalaries.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
  const displayedSalaries = sortedSalaries.slice(startIndex, endIndex);

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

  // Editing Functions (unchanged)
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
    setEditJobSearch("");
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditedSalary({});
    setEditErrors({ dep_id: false, Position: false, Salary: false });
    setEditJobSearch("");
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
      setEditJobSearch("");
    } catch (error) {
      console.error("Error updating salary:", error);
      alert(
        "Failed to update salary: " +
          (error.response?.data?.message || error.message)
      );
    }
  };

  // Add Functionality (unchanged)
  const startAdding = () => {
    setIsAdding(true);
    setNewSalary({ dep_id: "", Position: "", Salary: "" });
    setAddErrors({ dep_id: false, Position: false, Salary: false });
    setAddJobSearch("");
  };

  const cancelAdding = () => {
    setIsAdding(false);
    setNewSalary({ dep_id: "", Position: "", Salary: "" });
    setAddErrors({ dep_id: false, Position: false, Salary: false });
    setAddJobSearch("");
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
      setAddJobSearch("");
    } catch (error) {
      console.error("Error adding salary:", error);
      alert(
        "Failed to add salary: " +
          (error.response?.data?.message || error.message)
      );
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
        className="column p-5"
        style={{ marginTop: "100px", position: "relative", zIndex: 1 }}
      >
        {!isMobile ? (
          <div
            className="table-container box"
            style={{
              backgroundColor: "#fff",
              borderRadius: "8px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            }}
          >
            {/* add border -> is-bordered */}
            <table className="table is-fullwidth is-hoverable">
              <thead>
                <tr style={{ backgroundColor: "#f5f5f5" }}>
                  <th
                    className="has-text-weight-semibold"
                    onClick={() => requestSort("id")}
                    style={{ cursor: "pointer", width: "15%" }}
                  >
                    Salary ID
                    <span className="ml-1">
                      {sortConfig.key === "id" ? (
                        sortConfig.direction === "ascending" ? (
                          "▲"
                        ) : (
                          "▼"
                        )
                      ) : (
                        <span style={{ opacity: 0.3 }}>▲</span>
                      )}
                    </span>
                  </th>
                  <th
                    className="has-text-weight-semibold"
                    onClick={() => requestSort("Job_Title")}
                    style={{ cursor: "pointer", width: "25%" }}
                  >
                    Job Title
                    <span className="ml-1">
                      {sortConfig.key === "Job_Title" ? (
                        sortConfig.direction === "ascending" ? (
                          "▲"
                        ) : (
                          "▼"
                        )
                      ) : (
                        <span style={{ opacity: 0.3 }}>▲</span>
                      )}
                    </span>
                  </th>
                  <th
                    className="has-text-weight-semibold"
                    onClick={() => requestSort("position")}
                    style={{ cursor: "pointer", width: "20%" }}
                  >
                    Position / Level
                    <span className="ml-1">
                      {sortConfig.key === "position" ? (
                        sortConfig.direction === "ascending" ? (
                          "▲"
                        ) : (
                          "▼"
                        )
                      ) : (
                        <span style={{ opacity: 0.3 }}>▲</span>
                      )}
                    </span>
                  </th>
                  <th
                    className="has-text-weight-semibold"
                    onClick={() => requestSort("salary")}
                    style={{ cursor: "pointer", width: "20%" }}
                  >
                    Salary
                    <span className="ml-1">
                      {sortConfig.key === "salary" ? (
                        sortConfig.direction === "ascending" ? (
                          "▲"
                        ) : (
                          "▼"
                        )
                      ) : (
                        <span style={{ opacity: 0.3 }}>▲</span>
                      )}
                    </span>
                  </th>
                  <th
                    className="has-text-weight-semibold"
                    style={{ width: "20%" }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        justifyContent: "flex-end",
                      }}
                    >
                      <input
                        type="text"
                        className="input"
                        style={{
                          width: "200px",
                          borderRadius: "20px",
                          padding: "5px 15px",
                          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                          border: "1px solid #dbdbdb",
                          transition: "all 0.3s ease",
                          fontSize: "14px",
                        }}
                        placeholder="Search by Job/Position..."
                        value={searchTerm}
                        onChange={(e) => {
                          setSearchTerm(e.target.value);
                          setCurrentPage(1);
                        }}
                        onFocus={(e) =>
                          (e.target.style.boxShadow =
                            "0 4px 8px rgba(0,0,0,0.2)")
                        }
                        onBlur={(e) =>
                          (e.target.style.boxShadow =
                            "0 2px 4px rgba(0,0,0,0.1)")
                        }
                      />
                      {!isAdding && (
                        <button
                          className="button"
                          style={{
                            backgroundColor: "#28a745",
                            color: "white",
                            borderRadius: "15px",
                            padding: "5px 15px",
                            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                            transition: "all 0.3s ease",
                            border: "none",
                            fontSize: "14px",
                          }}
                          onClick={startAdding}
                          onMouseOver={(e) =>
                            (e.target.style.backgroundColor = "#218838")
                          }
                          onMouseOut={(e) =>
                            (e.target.style.backgroundColor = "#28a745")
                          }
                        >
                          Add Position
                        </button>
                      )}
                      <button
                        className="button"
                        style={{
                          backgroundColor: "#17a2b8",
                          color: "white",
                          borderRadius: "15px",
                          padding: "5px 15px",
                          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                          transition: "all 0.3s ease",
                          border: "none",
                          fontSize: "14px",
                        }}
                        onClick={handleViewPDF}
                        onMouseOver={(e) =>
                          (e.target.style.backgroundColor = "#138496")
                        }
                        onMouseOut={(e) =>
                          (e.target.style.backgroundColor = "#17a2b8")
                        }
                      >
                        View PDF
                      </button>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {isAdding && (
                  <tr>
                    <td className="has-text-grey">New</td>
                    <td>
                      <div className="control">
                        <input
                          type="text"
                          className="input mb-2"
                          placeholder="Search Job Title..."
                          value={addJobSearch}
                          onChange={(e) => setAddJobSearch(e.target.value)}
                        />
                        <div
                          className={`select is-fullwidth ${
                            addErrors.dep_id ? "is-danger" : ""
                          }`}
                        >
                          <select
                            value={newSalary.dep_id}
                            onChange={(e) => handleNewChange(e, "dep_id")}
                            style={{ height: "100px" }}
                          >
                            <option value="">Select a Job</option>
                            {getFilteredJobs(addJobSearch).map((dep) => (
                              <option key={dep.id} value={dep.id}>
                                {dep.Job_Title}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </td>
                    <td>
                      <input
                        type="text"
                        className={`input ${
                          addErrors.Position ? "is-danger" : ""
                        }`}
                        value={newSalary.Position}
                        onChange={(e) => handleNewChange(e, "Position")}
                        placeholder="Position / Level"
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        className={`input ${
                          addErrors.Salary ? "is-danger" : ""
                        }`}
                        value={newSalary.Salary}
                        onChange={(e) => handleNewChange(e, "Salary")}
                        placeholder="Salary"
                      />
                    </td>
                    <td>
                      <div className="buttons" style={{ gap: "10px" }}>
                        <button
                          className="button is-small"
                          style={{
                            backgroundColor: "#28a745",
                            color: "white",
                            borderRadius: "15px",
                            padding: "5px 15px",
                            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                            transition: "all 0.3s ease",
                            border: "none",
                          }}
                          onClick={saveNewSalary}
                          onMouseOver={(e) =>
                            (e.target.style.backgroundColor = "#218838")
                          }
                          onMouseOut={(e) =>
                            (e.target.style.backgroundColor = "#28a745")
                          }
                        >
                          Save
                        </button>
                        <button
                          className="button is-small"
                          style={{
                            backgroundColor: "#dc3545",
                            color: "white",
                            borderRadius: "15px",
                            padding: "5px 15px",
                            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                            transition: "all 0.3s ease",
                            border: "none",
                          }}
                          onClick={cancelAdding}
                          onMouseOver={(e) =>
                            (e.target.style.backgroundColor = "#c82333")
                          }
                          onMouseOut={(e) =>
                            (e.target.style.backgroundColor = "#dc3545")
                          }
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
                        <div className="control">
                          <input
                            type="text"
                            className="input mb-2"
                            placeholder="Search Job Title..."
                            value={editJobSearch}
                            onChange={(e) => setEditJobSearch(e.target.value)}
                          />
                          <div
                            className={`select is-fullwidth ${
                              editErrors.dep_id ? "is-danger" : ""
                            }`}
                          >
                            <select
                              value={editedSalary.dep_id || ""}
                              onChange={(e) => handleEditChange(e, "dep_id")}
                              style={{ height: "100px" }}
                            >
                              <option value="">Select a Job</option>
                              {getFilteredJobs(editJobSearch).map((dep) => (
                                <option key={dep.id} value={dep.id}>
                                  {dep.Job_Title}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                      ) : (
                        user.Job_Title
                      )}
                    </td>
                    <td>
                      {editingId === user.id ? (
                        <input
                          type="text"
                          className={`input ${
                            editErrors.Position ? "is-danger" : ""
                          }`}
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
                          className={`input ${
                            editErrors.Salary ? "is-danger" : ""
                          }`}
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
                        <div className="buttons" style={{ gap: "10px" }}>
                          <button
                            className="button is-small"
                            style={{
                              backgroundColor: "#28a745",
                              color: "white",
                              borderRadius: "15px",
                              padding: "5px 15px",
                              boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                              transition: "all 0.3s ease",
                              border: "none",
                            }}
                            onClick={() => saveSalary(user.id)}
                            onMouseOver={(e) =>
                              (e.target.style.backgroundColor = "#218838")
                            }
                            onMouseOut={(e) =>
                              (e.target.style.backgroundColor = "#28a745")
                            }
                          >
                            Save
                          </button>
                          <button
                            className="button is-small"
                            style={{
                              backgroundColor: "#dc3545",
                              color: "white",
                              borderRadius: "15px",
                              padding: "5px 15px",
                              boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                              transition: "all 0.3s ease",
                              border: "none",
                            }}
                            onClick={cancelEditing}
                            onMouseOver={(e) =>
                              (e.target.style.backgroundColor = "#c82333")
                            }
                            onMouseOut={(e) =>
                              (e.target.style.backgroundColor = "#dc3545")
                            }
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          className="button is-small"
                          style={{
                            backgroundColor: "#17a2b8",
                            color: "white",
                            borderRadius: "15px",
                            padding: "5px 15px",
                            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                            transition: "all 0.3s ease",
                            border: "none",
                          }}
                          onClick={() => startEditing(user)}
                          onMouseOver={(e) =>
                            (e.target.style.backgroundColor = "#138496")
                          }
                          onMouseOut={(e) =>
                            (e.target.style.backgroundColor = "#17a2b8")
                          }
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
          <>
            {/* Mobile Header Section */}
            <div
              className="is-flex is-justify-content-space-between mb-4 is-flex-wrap-wrap"
              style={{ padding: "0 10px" }}
            >
              <input
                type="text"
                className="input mt-2"
                style={{
                  maxWidth: "50%",
                  width: "100%",
                  borderRadius: "20px",
                  padding: "5px 15px",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                  border: "1px solid #dbdbdb",
                  transition: "all 0.3s ease",
                  fontSize: "14px",
                }}
                placeholder="Search by Job/Position..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                onFocus={(e) =>
                  (e.target.style.boxShadow = "0 4px 8px rgba(0,0,0,0.2)")
                }
                onBlur={(e) =>
                  (e.target.style.boxShadow = "0 2px 4px rgba(0,0,0,0.1)")
                }
              />
              <div
                className="mt-2 is-flex is-flex-wrap-wrap"
                style={{ gap: "10px" }}
              >
                <Link
                  to="/home/AddSalary"
                  className="button"
                  style={{
                    backgroundColor: "#28a745",
                    color: "white",
                    borderRadius: "15px",
                    padding: "5px 15px",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                    transition: "all 0.3s ease",
                    border: "none",
                    textDecoration: "none",
                    fontSize: "14px",
                  }}
                  onMouseOver={(e) =>
                    (e.target.style.backgroundColor = "#218838")
                  }
                  onMouseOut={(e) =>
                    (e.target.style.backgroundColor = "#28a745")
                  }
                >
                  Add Position
                </Link>
                <button
                  className="button"
                  style={{
                    backgroundColor: "#17a2b8",
                    color: "white",
                    borderRadius: "15px",
                    padding: "5px 15px",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                    transition: "all 0.3s ease",
                    border: "none",
                    fontSize: "14px",
                  }}
                  onClick={handleViewPDF}
                  onMouseOver={(e) =>
                    (e.target.style.backgroundColor = "#138496")
                  }
                  onMouseOut={(e) =>
                    (e.target.style.backgroundColor = "#17a2b8")
                  }
                >
                  View PDF
                </button>
              </div>
            </div>

            {/* Mobile Card Layout */}
            <div className="columns is-multiline" style={{ padding: "0 10px" }}>
              {displayedSalaries.map((user) => (
                <div key={user.id} className="column is-12">
                  <div
                    className="card"
                    style={{
                      borderRadius: "8px",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                    }}
                  >
                    <header
                      className="card-header"
                      style={{ backgroundColor: "#f5f5f5" }}
                    >
                      <p className="card-header-title">{user.Job_Title}</p>
                    </header>
                    <div className="card-content">
                      <p>
                        <strong>Salary ID:</strong> {user.id}
                      </p>
                      <p>
                        <strong>Position:</strong> {user.position}
                      </p>
                      <p>
                        <strong>Salary:</strong>{" "}
                        {user.salary
                          ? `₱${parseFloat(user.salary).toLocaleString(
                              "en-PH",
                              {
                                minimumFractionDigits: 2,
                              }
                            )}`
                          : "N/A"}
                      </p>
                    </div>
                    <footer className="card-footer">
                      <Link
                        to={`/home/editSalary/${user.id}`}
                        className="card-footer-item button is-small"
                        style={{
                          backgroundColor: "#17a2b8",
                          color: "white",
                          borderRadius: "15px",
                          padding: "5px 15px",
                          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                          transition: "all 0.3s ease",
                          border: "none",
                          textDecoration: "none",
                          textAlign: "center",
                        }}
                        onMouseOver={(e) =>
                          (e.target.style.backgroundColor = "#138496")
                        }
                        onMouseOut={(e) =>
                          (e.target.style.backgroundColor = "#17a2b8")
                        }
                      >
                        Edit
                      </Link>
                    </footer>
                  </div>
                </div>
              ))}
            </div>
          </>
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
