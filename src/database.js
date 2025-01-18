import {config} from 'dotenv';
import sqlite3 from 'sqlite3';
import {open} from 'sqlite';
import Service from "./models/service.js";

config(); // Load environment variables

let db;

export async function initializeDatabase() {
    let databaseInitialized = false;

    try {
        db = await open({
            filename: process.env.DB_FILE,
            driver: sqlite3.Database
        });

// Check if the users table exists and create it if it doesn't
        await db.exec(`
            CREATE TABLE IF NOT EXISTS users (
                                                 id INTEGER PRIMARY KEY AUTOINCREMENT,
                                                 username TEXT UNIQUE,
                                                 password TEXT NOT NULL,
                                                 fullName TEXT NOT NULL
            );
        `);

        await db.exec(`
            CREATE TABLE IF NOT EXISTS stories (
                                                   id INTEGER PRIMARY KEY AUTOINCREMENT,
                                                   title TEXT NOT NULL,
                                                   content TEXT,
                                                   author_id INTEGER,
                                                   FOREIGN KEY (author_id) REFERENCES users(id)
            );
        `);

        await db.exec(`
            CREATE TABLE IF NOT EXISTS branches (
                                                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                                                    story_id INTEGER,
                                                    content TEXT,
                                                    next_branch_id INTEGER,
                                                    FOREIGN KEY (story_id) REFERENCES stories(id),
                                                    FOREIGN KEY (next_branch_id) REFERENCES branches(id)
            );
        `);



        // Check if the default user already exists
        Service.signup('admin', 'Admin', 'admin').then(() => {
            console.log('Default user created');
        }).catch(err => {
            console.error('Error creating default user:', err);
        });

    } catch (err) {
        console.error('Error setting up the database:', err);
    }
}

export async function execQuery(sql, params = []) {
    try {
        if (sql.trim().toUpperCase().startsWith('SELECT')) {
            return await db.all(sql, params);
        } else {
            return await db.run(sql, params);
        }
    } catch (err) {
        console.error('Error executing query:', err);
        throw err;
    }
}