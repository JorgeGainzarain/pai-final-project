import { config } from 'dotenv';
import mysql from 'mysql2/promise';

config(); // Load environment variables

export default async function initializeDatabase() {
    let databaseInitialized = false;

    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
        });

        console.log('Connected to MySQL server.');

        // Check if the database exists
        const [databases] = await connection.query('SHOW DATABASES');
        const dbExists = databases.some(db => db.Database === process.env.DB_NAME);

        if (!dbExists) {
            // Create the database if it doesn't exist
            await connection.query(`CREATE DATABASE ${process.env.DB_NAME}`);
            console.log(`Database ${process.env.DB_NAME} created.`);
            databaseInitialized = true;
        }

        // Use the database
        await connection.query(`USE ${process.env.DB_NAME}`);

        // Check if the users table exists
        const [tables] = await connection.query('SHOW TABLES');
        const tableExists = tables.some(table => table[`Tables_in_${process.env.DB_NAME}`] === 'users');

        if (!tableExists) {
            // Create the users table if it doesn't exist
            const createTableQuery = `
                CREATE TABLE IF NOT EXISTS users (
                                                     username VARCHAR(100) NOT NULL PRIMARY KEY,
                                                     password VARCHAR(100) NOT NULL,
                                                     fullName VARCHAR(300) NOT NULL
                );
            `;
            await connection.query(createTableQuery);
            console.log('Table "users" created.');
            databaseInitialized = true;
        }

        // Check if the default user already exists
        const [rows] = await connection.query('SELECT COUNT(*) AS count FROM users WHERE username = "user"');
        if (rows[0].count === 0) {
            // Insert the default user if it doesn't exist
            const insertUserQuery = `
                INSERT INTO users (username, password, fullName)
                VALUES ('user', 'password', 'Test user')
                ON DUPLICATE KEY UPDATE
                    password = VALUES(password), fullName = VALUES(fullName);
            `;
            await connection.query(insertUserQuery);
            console.log('Default user inserted.');
            databaseInitialized = true;
        }

        // Close the connection
        await connection.end();

        // Log initialization status only if the database was initialized
        if (databaseInitialized) {
            console.log('Database initialized');
        }
    } catch (err) {
        console.error('Error setting up the database:', err);
    }
}
