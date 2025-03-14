import sql from "mssql";

export const getTitle = async (req, res) => {
  try {
    const result = await sql.query("select * from Job_Title order by id desc");
    res.status(200).json(result.recordset);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getTitleByID = async (req, res) => {
  try {
    const result =
      await sql.query`select * from Job_Title WHERE id = ${req.params.id}`;
    res.status(200).json(result.recordset[0]);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const createDept = async (req, res) => {
  try {
    const { Department_Name } = req.body;
    await sql.query`INSERT INTO Job_Title (Job_Title) VALUES ( ${Department_Name})`;
    res.status(201).json({ msg: "User Created" });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};


export const updateJobTitle = async (req, res) => {
  try {
    const { job_title } = req.body;
    await sql.query`UPDATE Job_title SET Job_title = ${job_title} WHERE id = ${req.params.id}`;
    res.status(200).json({ msg: "User Updated" });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
