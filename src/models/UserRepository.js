import { execQuery } from '../database.js';

export default class UserRepository {
    async get(username) {
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

    async add(username, fullName, password) {
        try {
            const user = await this.get(username);
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
}