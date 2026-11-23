const mysql = require("mysql2");

// A pool opens connections as needed and replaces dead ones automatically.
// Environment variables come from .env locally and from Render's Environment tab in production.
const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    waitForConnections: true,
    connectionLimit: 5,
    enableKeepAlive: true,
    keepAliveInitialDelay: 10000,
});

// Verify the database connection when the app starts.
db.getConnection((err, connection) => {
    if (err) {
        console.error("Database connection failure:", err);
        return;
    }
    console.log("Connected to MySQL");
    connection.release();
});

module.exports = db;