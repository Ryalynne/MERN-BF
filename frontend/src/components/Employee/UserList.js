import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { pdf } from "@react-pdf/renderer";
import EmployePDF from "../Printing/EmployeePDF";
import ConfirmBox from "../UI/Modal/ConfirmBox";

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteData, setDeleteData] = useState(null);
  const [open, setOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [departments, setDepartments] = useState([]);
  const [positions, setPositions] = useState({});
  const [editRow, setEditRow] = useState(null);
  const [editedData, setEditedData] = useState({});
  const [loadingPositions, setLoadingPositions] = useState({});
  const [isAdding, setIsAdding] = useState(false);
  const [newEmployee, setNewEmployee] = useState({
    full_name: "",
    gender: "",
    email: "",
    job_id: "",
    salary_id: "",
  });
  const [addErrors, setAddErrors] = useState({
    full_name: false,
    gender: false,
    email: false,
    job_id: false,
    salary_id: false,
  });
  const [editErrors, setEditErrors] = useState({
    full_name: false,
    gender: false,
    email: false,
    job_id: false,
    salary_id: false,
  });

  // Pagination States
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Email Validation Function
  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  useEffect(() => {
    getUsers();
    fetchDepartments();
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const fetchDepartments = async () => {
    try {
      const response = await axios.get("http://localhost:5000/job");
      setDepartments(response.data);
    } catch (error) {
      console.error(
        "Error fetching departments:",
        error.response?.data || error.message
      );
    }
  };

  const fetchPositionsForJob = async (jobId) => {
    if (!jobId) return [];
    setLoadingPositions((prev) => ({ ...prev, [jobId]: true }));
    try {
      const response = await axios.get(
        `http://localhost:5000/salary/getPosition/${jobId}`
      );
      setPositions((prev) => ({ ...prev, [jobId]: response.data }));
      return response.data;
    } catch (error) {
      console.error(`Error fetching positions for job ${jobId}:`, error);
      return [];
    } finally {
      setLoadingPositions((prev) => ({ ...prev, [jobId]: false }));
    }
  };

  const getUsers = async () => {
    try {
      const response = await axios.get("http://localhost:5000/users");
      setUsers(response.data);
      const uniqueJobIds = [
        ...new Set(response.data.map((user) => user.job_id).filter(Boolean)),
      ];
      await Promise.all(
        uniqueJobIds.map((jobId) => fetchPositionsForJob(jobId))
      );
    } catch (error) {
      console.error(
        "Error fetching users:",
        error.response?.data || error.message
      );
    }
  };

  const handleEdit = async (user) => {
    if (!user?.id) return;
    setEditRow(user.id);
    setEditErrors({
      full_name: false,
      gender: false,
      email: false,
      job_id: false,
      salary_id: false,
    });

    const matchedJob =
      departments.find((dep) => dep.Job_Title === user.Job_Title) || {};
    const jobId = matchedJob.id ?? user.job_id ?? "";
    let updatedPositions = positions[jobId] || [];
    if (jobId && !updatedPositions.length && !loadingPositions[jobId]) {
      updatedPositions = await fetchPositionsForJob(jobId);
    }

    const matchedPosition =
      updatedPositions.find((pos) => pos?.position === user.position) || {};
    setEditedData({
      full_name: String(user.full_name ?? ""),
      gender: String(user.gender ?? ""),
      email: String(user.email ?? ""),
      job_id: String(jobId),
      job_title: String(user.Job_Title ?? ""),
      salary_id: String(matchedPosition.id ?? ""),
      salary: String(matchedPosition.salary ?? user.salary ?? ""),
    });
  };

  const handleEditChange = (e, field) => {
    const value = e.target.value;
    setEditedData((prev) => {
      const newData = { ...prev, [field]: value };
      if (field === "job_id") {
        fetchPositionsForJob(value).then(() => {
          setEditedData((prevUpdated) => ({
            ...prevUpdated,
            salary_id: "",
            salary: "",
          }));
        });
      }
      if (field === "salary_id") {
        const selectedPosition = positions[prev.job_id]?.find(
          (pos) => pos.id.toString() === value
        );
        newData.salary = selectedPosition
          ? selectedPosition.salary.toString()
          : "";
      }
      return newData;
    });
    setEditErrors((prev) => ({
      ...prev,
      [field]:
        field === "email"
          ? !isValidEmail(value)
          : !value || value.trim() === "",
    }));
  };

  const handleSave = async (id) => {
    const newEditErrors = {
      full_name: !editedData.full_name || editedData.full_name.trim() === "",
      gender: !editedData.gender || editedData.gender.trim() === "",
      email: !editedData.email || !isValidEmail(editedData.email),
      job_id: !editedData.job_id || editedData.job_id.trim() === "",
      salary_id: !editedData.salary_id || editedData.salary_id.trim() === "",
    };

    if (Object.values(newEditErrors).some((error) => error)) {
      setEditErrors(newEditErrors);
      return;
    }

    try {
      const updateData = {
        name: editedData.full_name,
        gender: editedData.gender,
        email: editedData.email,
        position_id: parseInt(editedData.salary_id) || null,
        job_id: parseInt(editedData.job_id) || null,
      };
      await axios.patch(`http://localhost:5000/users/${id}`, updateData);
      setEditRow(null);
      setEditErrors({
        full_name: false,
        gender: false,
        email: false,
        job_id: false,
        salary_id: false,
      });
      await getUsers();
    } catch (error) {
      console.error(
        "Error updating user:",
        error.response?.data || error.message
      );
    }
  };

  const startAdding = () => {
    setIsAdding(true);
    setNewEmployee({
      full_name: "",
      gender: "",
      email: "",
      job_id: "",
      salary_id: "",
    });
    setAddErrors({
      full_name: false,
      gender: false,
      email: false,
      job_id: false,
      salary_id: false,
    });
  };

  const cancelAdding = () => {
    setIsAdding(false);
    setNewEmployee({
      full_name: "",
      gender: "",
      email: "",
      job_id: "",
      salary_id: "",
    });
    setAddErrors({
      full_name: false,
      gender: false,
      email: false,
      job_id: false,
      salary_id: false,
    });
  };

  const handleNewChange = (e, field) => {
    const value = e.target.value;
    setNewEmployee((prev) => {
      const newData = { ...prev, [field]: value };
      if (field === "job_id") {
        fetchPositionsForJob(value);
        newData.salary_id = "";
      }
      return newData;
    });
    setAddErrors((prev) => ({
      ...prev,
      [field]:
        field === "email"
          ? !isValidEmail(value)
          : !value || value.trim() === "",
    }));
  };

  const saveNewEmployee = async () => {
    const newAddErrors = {
      full_name: !newEmployee.full_name || newEmployee.full_name.trim() === "",
      gender: !newEmployee.gender || newEmployee.gender.trim() === "",
      email: !newEmployee.email || !isValidEmail(newEmployee.email),
      job_id: !newEmployee.job_id || newEmployee.job_id.trim() === "",
      salary_id: !newEmployee.salary_id || newEmployee.salary_id.trim() === "",
    };

    if (Object.values(newAddErrors).some((error) => error)) {
      setAddErrors(newAddErrors);
      return;
    }

    try {
      const payload = {
        name: newEmployee.full_name,
        gender: newEmployee.gender,
        email: newEmployee.email,
        position_id: parseInt(newEmployee.salary_id),
        job_id: parseInt(newEmployee.job_id),
      };
      await axios.post("http://localhost:5000/users", payload);
      setIsAdding(false);
      setNewEmployee({
        full_name: "",
        gender: "",
        email: "",
        job_id: "",
        salary_id: "",
      });
      setAddErrors({
        full_name: false,
        gender: false,
        email: false,
        job_id: false,
        salary_id: false,
      });
      await getUsers();
    } catch (error) {
      console.error(
        "Error adding employee:",
        error.response?.data || error.message
      );
    }
  };

  // Filtering and Pagination Logic
  const filteredUsers = users.filter((user) =>
    `${user.full_name} ${user.email} ${user.Job_Title || ""} ${
      user.position || ""
    } ${user.id}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  const totalItems = filteredUsers.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
  const displayedUsers = filteredUsers.slice(startIndex, endIndex);

  // Pagination Handlers
  const goToPage = (page) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  const handleItemsPerPageChange = (e) => {
    const newItemsPerPage = Number(e.target.value);
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
  };

  const openDelete = (user) => {
    setDeleteData(user);
    setOpen(true);
  };

  const deleteUser = async () => {
    if (!deleteData) return;
    try {
      await axios.delete(`http://localhost:5000/users/${deleteData.id}`);
      setDeleteData(null);
      setOpen(false);
      await getUsers();
    } catch (error) {
      console.error(
        "Error deleting user:",
        error.response?.data || error.message
      );
    }
  };

  const handleViewPDF = async () => {
    const blob = await pdf(<EmployePDF users={users} />).toBlob();
    const url = URL.createObjectURL(blob);
    window.open(url);
  };

  return (
    <div style={{ position: "relative" }}>
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
            placeholder="Search by Full Name, Job Title or Position..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
          />
          <div className="mt-2 is-flex is-flex-wrap-wrap">
            {!isMobile && !isAdding && (
              <button
                className="button is-success ml-3 mb-2"
                onClick={startAdding}
              >
                Add Employee
              </button>
            )}
            {isMobile ? (
              <Link
                to="/home/AddEmployee"
                className="button is-success ml-3 mb-2"
              >
                Add Employee
              </Link>
            ) : null}
            <button
              onClick={handleViewPDF}
              className="button is-info ml-3 mb-2"
            >
              View PDF
            </button>
          </div>
        </div>

        {/* Modern Table Design */}
        {!isMobile ? (
          <div
            className="table-container box"
            style={{
              backgroundColor: "#fff",
              borderRadius: "8px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            }}
          >
            <table className="table is-fullwidth is-hoverable">
              <thead>
                <tr style={{ backgroundColor: "#f5f5f5" }}>
                  <th className="has-text-weight-semibold">Employee ID</th>
                  <th className="has-text-weight-semibold">Full Name</th>
                  <th className="has-text-weight-semibold">Gender</th>
                  <th className="has-text-weight-semibold">Email</th>
                  <th className="has-text-weight-semibold">Job Title</th>
                  <th className="has-text-weight-semibold">Position</th>
                  <th className="has-text-weight-semibold">Salary</th>
                  <th className="has-text-weight-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {isAdding && (
                  <tr>
                    <td className="has-text-grey">New</td>
                    <td>
                      <input
                        type="text"
                        className={`input ${
                          addErrors.full_name ? "is-danger" : ""
                        }`}
                        value={newEmployee.full_name}
                        onChange={(e) => handleNewChange(e, "full_name")}
                        placeholder="Full Name"
                      />
                    </td>
                    <td>
                      <div className="select is-fullwidth">
                        <select
                          value={newEmployee.gender}
                          onChange={(e) => handleNewChange(e, "gender")}
                          className={addErrors.gender ? "is-danger" : ""}
                        >
                          <option value="">Select Gender</option>
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                        </select>
                      </div>
                    </td>
                    <td>
                      <input
                        type="email"
                        className={`input ${
                          addErrors.email ? "is-danger" : ""
                        }`}
                        value={newEmployee.email}
                        onChange={(e) => handleNewChange(e, "email")}
                        placeholder="Email"
                      />
                    </td>
                    <td>
                      <div className="select is-fullwidth">
                        <select
                          value={newEmployee.job_id}
                          onChange={(e) => handleNewChange(e, "job_id")}
                          className={addErrors.job_id ? "is-danger" : ""}
                        >
                          <option value="">Select Job Title</option>
                          {departments.map((dep) => (
                            <option key={dep.id} value={dep.id.toString()}>
                              {dep.Job_Title}
                            </option>
                          ))}
                        </select>
                      </div>
                    </td>
                    <td>
                      <div className="select is-fullwidth">
                        <select
                          value={newEmployee.salary_id}
                          onChange={(e) => handleNewChange(e, "salary_id")}
                          disabled={
                            !newEmployee.job_id ||
                            loadingPositions[newEmployee.job_id] ||
                            !positions[newEmployee.job_id]?.length
                          }
                          className={addErrors.salary_id ? "is-danger" : ""}
                        >
                          <option value="">Select Position</option>
                          {loadingPositions[newEmployee.job_id] ? (
                            <option disabled>Loading positions...</option>
                          ) : positions[newEmployee.job_id]?.length ? (
                            positions[newEmployee.job_id].map((pos) => (
                              <option key={pos.id} value={pos.id.toString()}>
                                {pos.position}
                              </option>
                            ))
                          ) : (
                            <option disabled>No positions available</option>
                          )}
                        </select>
                      </div>
                    </td>
                    <td>
                      <input
                        type="text"
                        className="input"
                        value={
                          newEmployee.salary_id && positions[newEmployee.job_id]
                            ? `₱${positions[newEmployee.job_id]
                                .find(
                                  (pos) =>
                                    pos.id.toString() === newEmployee.salary_id
                                )
                                ?.salary.toLocaleString("en-PH", {
                                  minimumFractionDigits: 2,
                                })}`
                            : ""
                        }
                        disabled
                      />
                    </td>
                    <td>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "0.5rem",
                        }}
                      >
                        <button
                          className="button is-small is-success"
                          onClick={saveNewEmployee}
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
                {displayedUsers.length > 0 ? (
                  displayedUsers.map((user) => (
                    <tr key={user.id}>
                      <td>{user.id}</td>
                      <td>
                        {editRow === user.id ? (
                          <input
                            type="text"
                            className={`input ${
                              editErrors.full_name ? "is-danger" : ""
                            }`}
                            value={editedData.full_name || ""}
                            onChange={(e) => handleEditChange(e, "full_name")}
                          />
                        ) : (
                          user.full_name
                        )}
                      </td>
                      <td>
                        {editRow === user.id ? (
                          <div className="select is-fullwidth">
                            <select
                              value={editedData.gender || ""}
                              onChange={(e) => handleEditChange(e, "gender")}
                              className={editErrors.gender ? "is-danger" : ""}
                            >
                              <option value="">Select Gender</option>
                              <option value="Male">Male</option>
                              <option value="Female">Female</option>
                            </select>
                          </div>
                        ) : (
                          user.gender
                        )}
                      </td>
                      <td>
                        {editRow === user.id ? (
                          <input
                            type="email"
                            className={`input ${
                              editErrors.email ? "is-danger" : ""
                            }`}
                            value={editedData.email || ""}
                            onChange={(e) => handleEditChange(e, "email")}
                          />
                        ) : (
                          user.email
                        )}
                      </td>
                      <td>
                        {editRow === user.id ? (
                          <div className="select is-fullwidth">
                            <select
                              value={editedData.job_id || ""}
                              onChange={(e) => handleEditChange(e, "job_id")}
                              className={editErrors.job_id ? "is-danger" : ""}
                            >
                              <option value="">Select Job Title</option>
                              {departments.map((dep) => (
                                <option key={dep.id} value={dep.id.toString()}>
                                  {dep.Job_Title}
                                </option>
                              ))}
                            </select>
                          </div>
                        ) : (
                          user.Job_Title || "-"
                        )}
                      </td>
                      <td>
                        {editRow === user.id ? (
                          <div className="select is-fullwidth">
                            <select
                              value={editedData.salary_id || ""}
                              onChange={(e) => handleEditChange(e, "salary_id")}
                              disabled={
                                !editedData.job_id ||
                                loadingPositions[editedData.job_id] ||
                                !positions[editedData.job_id]?.length
                              }
                              className={
                                editErrors.salary_id ? "is-danger" : ""
                              }
                            >
                              <option value="">Select Position</option>
                              {loadingPositions[editedData.job_id] ? (
                                <option disabled>Loading positions...</option>
                              ) : positions[editedData.job_id]?.length ? (
                                positions[editedData.job_id].map((pos) => (
                                  <option
                                    key={pos.id}
                                    value={pos.id.toString()}
                                  >
                                    {pos.position}
                                  </option>
                                ))
                              ) : (
                                <option disabled>No positions available</option>
                              )}
                            </select>
                          </div>
                        ) : (
                          user.position || "-"
                        )}
                      </td>
                      <td>
                        {editRow === user.id ? (
                          <input
                            type="text"
                            className="input"
                            value={
                              editedData.salary
                                ? `₱${Number(editedData.salary).toLocaleString(
                                    "en-PH",
                                    {
                                      minimumFractionDigits: 2,
                                    }
                                  )}`
                                : ""
                            }
                            disabled
                          />
                        ) : (
                          `₱${user.salary?.toLocaleString("en-PH") || "-"}`
                        )}
                      </td>
                      <td>
                        {editRow === user.id ? (
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "0.5rem",
                            }}
                          >
                            <button
                              className="button is-small is-success"
                              onClick={() => handleSave(user.id)}
                            >
                              Save
                            </button>
                            <button
                              className="button is-small is-danger is-outlined"
                              onClick={() => setEditRow(null)}
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "0.5rem",
                            }}
                          >
                            <button
                              onClick={() => handleEdit(user)}
                              className="button is-small is-info is-outlined"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => openDelete(user)}
                              className="button is-small is-danger is-outlined"
                            >
                              Delete
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="has-text-centered">
                      No users found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="columns is-multiline m-1">
            {displayedUsers.map((user) => (
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
                    <p className="card-header-title">
                      {user.full_name} - {user.gender}
                    </p>
                  </header>
                  <div className="card-content">
                    <p>
                      <strong>Employee ID:</strong> {user.id}
                    </p>
                    <p>
                      <strong>Email:</strong> {user.email}
                    </p>
                    <p>
                      <strong>Job Title:</strong> {user.Job_Title || "-"}
                    </p>
                    <p>
                      <strong>Position:</strong> {user.position || "-"}
                    </p>
                    <p>
                      <strong>Salary:</strong> ₱
                      {user.salary?.toLocaleString("en-PH") || "-"}
                    </p>
                  </div>
                  <footer className="card-footer">
                    <Link
                      to={`/home/edit/${user.id}`}
                      className="card-footer-item button is-small is-info is-outlined"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => openDelete(user)}
                      className="card-footer-item button is-small is-danger is-outlined"
                    >
                      Delete
                    </button>
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

        <ConfirmBox
          open={open}
          closeDialog={() => setOpen(false)}
          title={deleteData?.full_name}
          empID={deleteData?.id}
          deleteFunction={deleteUser}
        />
      </div>
    </div>
  );
};

export default UserList;
// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { Link } from "react-router-dom";
// import { PDFDownloadLink } from "@react-pdf/renderer";
// import EmployePDF from "../Printing/EmployeePDF"; // ✅ Import the PDF component

// const UserList = () => {
//   const [users, setUser] = useState([]);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [entriesToShow, setEntriesToShow] = useState(10);

//   useEffect(() => {
//     getUsers();
//   }, []);

//   const getUsers = async () => {
//     try {
//       const response = await axios.get("http://localhost:5000/users");
//       setUser(response.data);
//     } catch (error) {
//       console.error("Error fetching users:", error);
//     }
//   };

//   const deleteUser = async (id) => {
//     try {
//       await axios.delete(`http://localhost:5000/users/${id}`);
//       getUsers();
//     } catch (error) {
//       console.error("Error deleting user:", error);
//     }
//   };

//   // Filter users based on search term
//   const filteredUsers = users.filter((user) =>
//     `${user.full_name} ${user.email} ${user.Job_Title} ${user.position} ${user.id}`
//       .toLowerCase()
//       .includes(searchTerm.toLowerCase())
//   );

//   // Limit displayed entries based on selection
//   const displayedUsers = filteredUsers.slice(0, entriesToShow);

//   return (
//     <div className="container mt-5">
//       {/* Search Bar and Action Buttons */}
//       <div className="is-flex is-justify-content-space-between mb-3">
//         <input
//           type="text"
//           className="input"
//           style={{ maxWidth: "300px" }}
//           placeholder="Search by Employee ID, Name, Email, Job Title, or Position..."
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//         />
//         <div>
//           <Link to="AddEmployee" className="button is-success mr-2">
//             Add Employee
//           </Link>

//           <PDFDownloadLink
//             document={<EmployePDF users={users} />}
//             fileName="Employee_Report.pdf"
//             className="button is-info mr-3"
//           >
//             {({ loading }) => (loading ? "Generating PDF..." : "Export PDF")}
//           </PDFDownloadLink>
//         </div>
//       </div>

//       {/* Employee Table */}
//       <table className="table is-striped is-fullwidth">
//         <thead>
//           <tr>
//             <th>Employee ID</th>
//             <th>Full Name</th>
//             <th>Email</th>
//             <th>Gender</th>
//             <th>Job Title</th>
//             <th>Position / Level</th>
//             <th>Salary</th>
//             <th>Annual Salary</th>
//             <th>Actions</th>
//           </tr>
//         </thead>
//         <tbody>
//           {displayedUsers.length > 0 ? (
//             displayedUsers.map((user) => (
//               <tr key={user.id}>
//                 <td>{user.id}</td>
//                 <td>{user.full_name}</td>
//                 <td>{user.email}</td>
//                 <td>{user.gender}</td>
//                 <td>{user.Job_Title}</td>
//                 <td>{user.position}</td>
//                 <td>
//                   {user.salary
//                     ? `₱${parseFloat(user.salary).toLocaleString("en-PH", {
//                         minimumFractionDigits: 2,
//                       })}`
//                     : ""}
//                 </td>
//                 <td>
//                   {user.anual_salary
//                     ? `₱${parseFloat(user.anual_salary).toLocaleString(
//                         "en-PH",
//                         {
//                           minimumFractionDigits: 2,
//                         }
//                       )}`
//                     : ""}
//                 </td>
//                 <td>
//                   <Link
//                     to={`edit/${user.id}`}
//                     className="button is-small is-info mr-2"
//                   >
//                     Edit
//                   </Link>
//                   <button
//                     onClick={() => deleteUser(user.id)}
//                     className="button is-small is-danger"
//                   >
//                     Delete
//                   </button>
//                 </td>
//               </tr>
//             ))
//           ) : (
//             <tr>
//               <td colSpan="9" className="has-text-centered">
//                 No users found.
//               </td>
//             </tr>
//           )}
//         </tbody>
//       </table>

//       {/* Footer with Entry Filter */}
//       <div className="is-flex is-align-items-center is-justify-content-space-between mt-3">
//         <div>
//           <label className="mr-2">Show entries:</label>
//           <div className="select">
//             <select
//               value={entriesToShow}
//               onChange={(e) => setEntriesToShow(Number(e.target.value))}
//             >
//               <option value="5">5</option>
//               <option value="10">10</option>
//               <option value="20">20</option>
//               <option value={filteredUsers.length}>All</option>
//             </select>
//           </div>
//         </div>
//         <p>
//           Showing {displayedUsers.length} of {filteredUsers.length} entries
//         </p>
//       </div>
//     </div>
//   );
// };

// export default UserList;
