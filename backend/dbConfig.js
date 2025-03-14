import sql from 'mssql';
import dotenv from 'dotenv';

dotenv.config(); // Load environment variables from .env

const config = {
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    server: process.env.DB_SERVER, // Ensure this is a string
    database: process.env.DB_NAME,
    port: parseInt(process.env.DB_PORT, 10),
    options: {
        trustServerCertificate: true,
        enableArithAbort: true,
        instancename: "SQLEXPRESS", // Only if using SQL Server Express
    },
};

// Initialize and export the poolPromise
const poolPromise = sql.connect(config);

export { poolPromise, sql };
