import sql from "mssql";

export const getSalaryList = async (req, res) => {
  try {
    const result = await sql.query(
      "select Employee_Salary.id, Employee_Salary.position,  Employee_Salary.salary,  Job_Title.Job_Title from Employee_Salary inner join Job_Title on Employee_Salary.job_id = Job_Title.id order by Employee_Salary.id desc"
    );
    res.status(200).json(result.recordset);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const createSalary = async (req, res) => {
  try {
    const { dep_id, Position, Salary } = req.body;
    await sql.query`INSERT INTO Employee_Salary (job_id , position,salary) VALUES (${dep_id}, ${Position} , ${Salary})`;
    res.status(201).json({ msg: "Salary Created" });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getPositions = async (req, res) => {
  try {
    const jobId = req.params.id;
    if (!jobId) {
      return res.status(400).json({ error: "Job ID is required" });
    }

    console.log(`Fetching positions for job_id: ${jobId}`);
    const result =
      await sql.query`SELECT * FROM Employee_Salary WHERE job_id = ${jobId}`;

    if (!result.recordset.length) {
      console.log(`No positions found for job_id: ${jobId}`);
      return res
        .status(404)
        .json({ message: "No positions found for this job" });
    }

    console.log("Positions retrieved:", result.recordset);
    res.status(200).json(result.recordset);
  } catch (error) {
    console.error("Error fetching positions:", {
      message: error.message,
      stack: error.stack,
    });
    res.status(500).json({
      error: "Internal Server Error",
      details: error.message,
    });
  }
};

// export const getPositions = async (req, res) => {
//   try {
//     const result =
//       await sql.query`select * from Employee_Salary where job_id = ${req.params.id}`;
//     res.status(200).json(result.recordset);
//   } catch (error) {
//     console.error(error.message);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// };

export const getSalary = async (req, res) => {
  try {
    const result =
      await sql.query`select * from Employee_Salary where id = ${req.params.id}`;
    res.status(200).json(result.recordset[0]);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

//

export const updateSalary = async (req, res) => {
  try {
    const { dep_id, Position, Salary } = req.body;
    await sql.query`UPDATE Employee_Salary SET job_id = ${dep_id}, position = ${Position}, salary = ${Salary} WHERE id = ${req.params.id}`;
    res.status(200).json({ msg: "User Updated" });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
