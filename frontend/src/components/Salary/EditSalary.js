import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const EditSalary = () => {
  const [Salary, setSalary] = useState("");
  const [Position, setPosition] = useState("");
  const [dep_id, setDepId] = useState("");
  const [departments, setDepartments] = useState([]);
  const navigate = useNavigate();
  const { id } = useParams();
  // dep_id, Position, Salary 
  useEffect(() => {
    const fetchSalary = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/salary/getSalary/${id}`
        );
        console.log(response.data);
        setDepId(response.data.job_id);
        setPosition(response.data.position);
        setSalary(response.data.salary);
      } catch (error) {
        console.error("Error fetching salary:", error);
      }
    };

    fetchSalary();
  }, [id]); 

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

  const saveSalary = async (e) => {
    e.preventDefault();
    try {
      await axios.patch(`http://localhost:5000/salary/${id}`, {
        dep_id,
        Position,
        Salary,
      });
      navigate("/home/SalaryList");
    } catch (error) {
      console.error("Error updating salary:", error);
    }
  };

  return (
    <div>
      <div className="column is-half container mt-5">
        <form onSubmit={saveSalary}>
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
                  <option value="">Select a department</option>
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
            <label className="label">Position</label>
            <div className="control">
              <input
                type="text"
                className="input"
                value={Position}
                onChange={(e) => setPosition(e.target.value)}
                placeholder="Position"
                required
              />
            </div>
          </div>

          {/* Salary */}
          <div className="field">
            <label className="label">Salary</label>
            <div className="control">
              <input
                type="number"
                className="input"
                value={Salary}
                onChange={(e) => setSalary(e.target.value)}
                placeholder="Salary"
                required
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

export default EditSalary;
