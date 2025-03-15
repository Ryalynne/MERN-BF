import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const EditUser = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [gender, setGender] = useState("");
  const [positions, setPositions] = useState([]);
  const [position_id, setPositionId] = useState("");
  const [salary, setSalary] = useState("");
  const [departments, setDepartments] = useState([]);
  const [dep_id, setDepId] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { id } = useParams();

  // Add validation errors state
  const [errors, setErrors] = useState({
    name: false,
    email: false,
    gender: false,
    dep_id: false,
    position_id: false,
  });

  // Update salary when position_id changes
  useEffect(() => {
    const selectedPosition = positions.find(
      (pos) => String(pos.id) === String(position_id)
    );
    setSalary(selectedPosition ? selectedPosition.salary : "");
  }, [position_id, positions]);

  // Fetch all initial data (user, departments, positions)
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoading(true);

        // Fetch departments
        const deptResponse = await axios.get("http://localhost:5000/job");
        setDepartments(deptResponse.data);

        // Fetch user data
        const userResponse = await axios.get(`http://localhost:5000/users/${id}`);
        console.log("User API Response:", userResponse.data);
        setName(userResponse.data.full_name || "");
        setEmail(userResponse.data.email || "");
        setGender(userResponse.data.gender || "");
        const jobId = userResponse.data.job_id ? String(userResponse.data.job_id) : "";
        setDepId(jobId);
        const posId = userResponse.data.salary_id ? String(userResponse.data.salary_id) : "";
        setPositionId(posId);

        // Fetch positions if job_id exists
        if (jobId) {
          const posResponse = await axios.get(
            `http://localhost:5000/salary/getPosition/${jobId}`
          );
          console.log("Positions for job", jobId, ":", posResponse.data);
          setPositions(posResponse.data);

          // Validate position_id against fetched positions
          const isValidPosition = posResponse.data.some(
            (pos) => String(pos.id) === String(posId)
          );
          if (!isValidPosition) {
            setPositionId("");
          }
        }

        // Set initial errors based on fetched data
        setErrors({
          name: !userResponse.data.full_name,
          email: !userResponse.data.email,
          gender: !userResponse.data.gender,
          dep_id: !jobId,
          position_id: !posId,
        });
      } catch (error) {
        console.error("Error fetching initial data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, [id]);

  // Fetch positions when dep_id changes (after initial load)
  useEffect(() => {
    if (!dep_id || loading) {
      return;
    }

    const fetchPositions = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/salary/getPosition/${dep_id}`
        );
        const fetchedPositions = response.data;
        console.log("Positions updated for job", dep_id, ":", fetchedPositions);
        setPositions(fetchedPositions);

        // Reset position_id if it's not valid for the new job
        const isCurrentPositionValid = fetchedPositions.some(
          (pos) => String(pos.id) === String(position_id)
        );
        if (!isCurrentPositionValid) {
          setPositionId("");
          setSalary("");
          setErrors((prev) => ({ ...prev, position_id: true }));
        }
      } catch (error) {
        console.error("Error fetching positions:", error);
        setPositions([]);
        setPositionId("");
        setSalary("");
        setErrors((prev) => ({ ...prev, position_id: true }));
      }
    };

    fetchPositions();
  }, [dep_id, loading]);

  // Real-time validation handler
  const handleInputChange = (field, value) => {
    switch (field) {
      case "name":
        setName(value);
        break;
      case "email":
        setEmail(value);
        break;
      case "gender":
        setGender(value);
        break;
      case "dep_id":
        setDepId(value);
        break;
      case "position_id":
        setPositionId(value);
        break;
      default:
        break;
    }
    setErrors((prev) => ({ ...prev, [field]: !value || value.trim() === "" }));
  };

  const updateUser = async (e) => {
    e.preventDefault();

    // Programmatic validation for all required fields
    const newErrors = {
      name: !name || name.trim() === "",
      email: !email || email.trim() === "",
      gender: !gender || gender.trim() === "",
      dep_id: !dep_id || dep_id.trim() === "",
      position_id: !position_id || position_id.trim() === "",
    };

    if (Object.values(newErrors).some((error) => error)) {
      setErrors(newErrors);
      console.log("Validation failed:", newErrors);
      return;
    }

    try {
      await axios.patch(`http://localhost:5000/users/${id}`, {
        name,
        email,
        gender,
        position_id: position_id ? parseInt(position_id) : null,
        job_id: dep_id ? parseInt(dep_id) : null,
      });
      navigate("/home/EmployeeList");
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  return (
    <div>
            <div
        className="column p-5"
        style={{ marginTop: "100px", position: "relative", zIndex: 1 }}
      >
        {loading ? (
          <p>Loading...</p>
        ) : (
          <form onSubmit={updateUser}>
            <div className="field">
              <label className="label">Name</label>
              <div className="control">
                <input
                  type="text"
                  className="input"
                  value={name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="Name"
                  style={{ borderColor: errors.name ? "red" : "" }}
                  required
                />
              </div>
            </div>
            <div className="field">
              <label className="label">Email</label>
              <div className="control">
                <input
                  type="email"
                  className="input"
                  value={email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  placeholder="Email"
                  style={{ borderColor: errors.email ? "red" : "" }}
                  required
                />
              </div>
            </div>
            <div className="field">
              <label className="label">Gender</label>
              <div className="control">
                <div className="select is-fullwidth">
                  <select
                    value={gender}
                    onChange={(e) => handleInputChange("gender", e.target.value)}
                    style={{ borderColor: errors.gender ? "red" : "" }}
                    required
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="field">
              <label className="label">Job Title</label>
              <div className="control">
                <div className="select is-fullwidth">
                  <select
                    value={dep_id}
                    onChange={(e) => handleInputChange("dep_id", e.target.value)}
                    style={{ borderColor: errors.dep_id ? "red" : "" }}
                    required
                  >
                    <option value="">Select Job Title</option>
                    {departments.map((dep) => (
                      <option key={dep.id} value={dep.id}>
                        {dep.Job_Title}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            <div className="field">
              <label className="label">Position</label>
              <div className="control">
                <div className="select is-fullwidth">
                  <select
                    value={position_id}
                    onChange={(e) => handleInputChange("position_id", e.target.value)}
                    disabled={!dep_id || positions.length === 0}
                    style={{ borderColor: errors.position_id ? "red" : "" }}
                    required
                  >
                    <option value="">Select a position</option>
                    {positions.map((pos) => (
                      <option key={pos.id} value={pos.id}>
                        {pos.position}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
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
            <div className="field">
              <button type="submit" className="button is-success">
                Update
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default EditUser;
