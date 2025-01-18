import { execQuery } from '../database.js';

export default class DatabaseService {

    async getUserById(id) {
        try {
            const sql = 'SELECT * FROM users WHERE id = ?';
            const params = [id];
            const result = await execQuery(sql, params);
            if (result.length === 0) {
                return null;
            }
            return result[0];
        } catch (error) {
            console.error('Error fetching user:', error);
            throw error;
        }
    }
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

    async createStory(user_id, title, content) {
        try {
            const sql = 'INSERT INTO stories (title, content, author_id) VALUES (?, ?, ?)';
            const params = [title, content, user_id];
            await execQuery(sql, params);
        } catch (error) {
            console.error('Error creating story:', error);
            throw error;
        }
    }

    async getStoriesByUser(user_id) {
        try {
            const sql = 'SELECT * FROM stories WHERE author_id = ?';
            const params = [user_id];
            return await execQuery(sql, params);
        } catch (error) {
            console.error('Error fetching stories:', error);
            throw error;
        }
    }
}