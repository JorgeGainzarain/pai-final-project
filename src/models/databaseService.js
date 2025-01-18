import { execQuery } from '../database.js';

export default class DatabaseService {
    async getUser(username) {
        try {
            const sql = 'SELECT * FROM users WHERE username = ?';
            const params = [username];
            const result = await execQuery(sql, params);
            if (result.length === 0) {
                return null;
            }
            return result;
        } catch (error) {
            console.error('Error fetching user:', error);
            throw error;
        }
    }

    async addUser(username, fullName, password) {
        try {
            const user = await this.getUser(username);
            if (!user) {
                const sql = 'INSERT INTO users (username, fullName, password) VALUES (?, ?, ?)';
                const params = [username, fullName, password];
                await execQuery(sql, params);
                return true;
            } else {
                return false;
            }
        } catch (error) {
            console.error('Error adding user:', error);
            throw error;
        }
    }

    async getStories() {
        try {
            const sql = 'SELECT * FROM stories';
            return await execQuery(sql);
        } catch (error) {
            console.error('Error fetching stories:', error);
            throw error;
        }
    }

    async createStory(title, content) {
        try {
            const sql = 'INSERT INTO stories (title, content) VALUES (?, ?)';
            const params = [title, content];
            await execQuery(sql, params);
        } catch (error) {
            console.error('Error creating story:', error);
            throw error;
        }
    }
}