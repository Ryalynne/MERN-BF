import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function AddDept() {
  const [Department_Name, setDept] = useState("");
  const navigate = useNavigate();

  const saveDepartment = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/job", {
        Department_Name,
      });
      navigate("/home/JobTitleList");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <div className="column is-half container mt-5">
        <form onSubmit={saveDepartment}>
          <div className="field">
            <label className="label">Job Title</label>
            <div className="control">
              <input
                type="text"
                className="input"
                value={Department_Name}
                onChange={(e) => setDept(e.target.value)}
                placeholder="Job Title"
                required
              />
            </div>
          </div>
          <div className="field">
            <button type="submit" className="button is-success">
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddDept;
