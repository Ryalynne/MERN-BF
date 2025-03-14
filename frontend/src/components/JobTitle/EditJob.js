import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const EditSalary = () => {
  const [job_title, setJob] = useState("");
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/job/getJobTitle/${id}`
        );
        setJob(response.data.Job_Title);
      } catch (error) {
        console.error("Error fetching Job Title:", error);
      }
    };

    fetchJob();
  }, [id]);

  //save/update
  const saveJob = async (e) => {
    e.preventDefault();
    try {
      await axios.patch(`http://localhost:5000/job/${id}`, {
        job_title,
      });
      navigate("/home/JobTitleList");
    } catch (error) {
      console.error("Error updating salary:", error);
    }
  };

  return (
    <div>
      <div className="column is-half container mt-5">
        <form onSubmit={saveJob}>
          {/* Job Title */}
          <div className="field">
            <label className="label">Job Title</label>
            <div className="control">
              <input
                type="text"
                className="input"
                value={job_title}
                onChange={(e) => setJob(e.target.value)}
                placeholder="Job Title"
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
