import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
const AddUser = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [gender, setGender] = useState("");
  const navigate = useNavigate();

  // Department & Position State
  const [departments, setDepartments] = useState([]);
  const [dep_id, setDepId] = useState("");
  const [positions, setPositions] = useState([]);
  const [position_id, setPositionId] = useState("");
  const [salary, setSalary] = useState("");

  useEffect(() => {
    const selectedPosition = positions.find(
      (pos) => String(pos.id) === String(position_id)
    );
    setSalary(selectedPosition ? selectedPosition.salary : "");
  }, [position_id, positions]);

  // Fetch Departments on Mount
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await axios.get("http://localhost:5000/job");
        setDepartments(response.data);
      } catch (error) {
        console.error("Error fetching departments:", error);
      }
    };
    fetchDepartments();
  }, []);

  // Fetch Positions when Department Changes
  useEffect(() => {
    if (!dep_id) {
      setPositions([]);
      setPositionId("");
      setSalary("");
      return;
    }

    const fetchPositions = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/salary/getPosition/${dep_id}`
        );
        setPositions(response.data);
      } catch (error) {
        console.error("Error fetching positions:", error);
      }
    };

    fetchPositions();
  }, [dep_id]);

  // Save User
  const saveUser = async (e) => {
    e.preventDefault();

    try {
      await axios.post("http://localhost:5000/users", {
        name,
        email,
        gender,
        position_id,
      });
      navigate("/home/EmployeeList");
    } catch (error) {
      console.error("Error saving user:", error);
    }
  };

  return (
    <div>
            <div
        className="column p-5"
        style={{ marginTop: "100px", position: "relative", zIndex: 1 }}
      >
        <form onSubmit={saveUser}>
          {/* Full Name */}
          <div className="field">
            <label className="label">Full Name</label>
            <div className="control">
              <input
                type="text"
                className="input"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Full Name"
                required
              />
            </div>
          </div>

          {/* Email */}
          <div className="field">
            <label className="label">Email</label>
            <div className="control">
              <input
                type="email"
                className="input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                required
              />
            </div>
          </div>
          {/* Gender */}
          <div className="field">
            <label className="label">Gender</label>
            <div className="control">
              <div className="select is-fullwidth">
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  required
                >
                  <option value="">Select a Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>
            </div>
          </div>

          {/* Department */}
          <div className="field">
            <label className="label">Job Title</label>
            <div className="control">
              <div className="select is-fullwidth">
                <select
                  value={dep_id}
                  onChange={(e) => setDepId(e.target.value)}
                  required
                >
                  <option value="">Select a job title</option>
                  {departments.map((dep) => (
                    <option key={dep.id} value={dep.id}>
                      {dep.Job_Title}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Position */}
          <div className="field">
            <label className="label">Position / Level</label>
            <div className="control">
              <div className="select is-fullwidth">
                <select
                  value={position_id}
                  onChange={(e) => setPositionId(e.target.value)}
                  required
                >
                  <option value="">Select a position / level</option>
                  {positions.map((pos) => (
                    <option key={pos.id} value={pos.id}>
                      {pos.position}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Salary */}
          <div className="field">
            <label className="label">Salary</label>
            <div className="control">
              <input
                type="text"
                className="input"
                value={
                  salary
                    ? `₱${parseFloat(salary).toLocaleString("en-PH", {
                        minimumFractionDigits: 2,
                      })}`
                    : ""
                }
                disabled
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="field">
            <button type="submit" className="button is-success">
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddUser;
