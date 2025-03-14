import bcrypt from 'bcryptjs';
import { poolPromise, sql } from '../dbConfig.js';
import jwt from 'jsonwebtoken';

// Register user (sign-up logic)
const registerUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Hash the password before storing it
    const hashedPassword = await bcrypt.hash(password, 10);

    // Save the user to the database with hashed password
    const pool = await poolPromise;
    await pool.request()
      .input("email", sql.VarChar, email)
      .input("password", sql.VarChar, hashedPassword)
      .query("INSERT INTO Users (email, password) VALUES (@email, @password)");

    res.status(201).json({ message: 'User created successfully' });
  } catch (err) {
    console.error('Error registering user:', err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Login user (login logic)
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .input("email", sql.VarChar, email)
      .query("SELECT * FROM Users WHERE email = @email");

    if (!result.recordset.length) {
      return res.status(400).json({ message: "User not found" });
    }

    const user = result.recordset[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate JWT Token
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({ token });

  } catch (err) {
    console.error('Error during login:', err); 
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export { registerUser, loginUser };
