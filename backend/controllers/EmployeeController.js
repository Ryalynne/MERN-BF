import sql from "mssql";

export const getUsers = async (req, res) => {
  try {
    const result = await sql.query(
      "select Employee.id , Employee.full_name ,  Employee.gender , Employee.email , Job_Title.Job_Title, Employee_Salary.position , Employee_Salary.salary , Employee_Salary.salary * 12 as anual_salary from Employee inner join Employee_Salary on Employee.salary_id = Employee_Salary.id inner join Job_Title on Employee_Salary.job_id = Job_Title.id order by Employee.id desc"
    );
    res.status(200).json(result.recordset);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getUserById = async (req, res) => {
  try {
    const result =
      await sql.query`select * from Employee inner join Employee_Salary on Employee.salary_id = Employee_Salary.id inner join Job_Title on Employee_Salary.job_id = Job_Title.id WHERE Employee.id = ${req.params.id}`;
    if (result.recordset.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json(result.recordset[0]);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const createUser = async (req, res) => {
  try {
    const { name, email, gender, position_id } = req.body;
    await sql.query`INSERT INTO Employee (full_name, email , gender , salary_id) VALUES (${name}, ${email} , ${gender}  , ${position_id})`;
    res.status(201).json({ msg: "User Created" });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { name, email, gender, position_id } = req.body;
    await sql.query`UPDATE Employee SET full_name = ${name}, email = ${email}, gender = ${gender} , salary_id = ${position_id} WHERE id = ${req.params.id}`;
    res.status(200).json({ msg: "User Updated" });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const deleteUser = async (req, res) => {
  try {
    await sql.query`DELETE FROM Employee WHERE id = ${req.params.id}`;
    res.status(200).json({ msg: "User Deleted" });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
