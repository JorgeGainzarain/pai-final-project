// src/app/story/story.repository.js
import { execQuery } from '../../database.js';

export default class StoryRepository {

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

    async getStoryById(id) {
        try {
            const sql = 'SELECT * FROM stories WHERE id = ?';
            const params = [id];
            const result = await execQuery(sql, params);
            if (result.length === 0) {
                return null;
            }
            return result[0];
        } catch (error) {
            console.error('Error fetching story:', error);
            throw error;
        }
    }

    async rateStory(id, id2, score) {
        try {
            const sql = 'INSERT INTO ratings (story_id, user_id, score) VALUES (?, ?, ?)';
            const params = [id, id2, score];
            await execQuery(sql, params);
        } catch (error) {
            console.error('Error rating story:', error);
            throw error;
        }
    }

    async getRatingForStory(id) {
        try {
            const sql = 'SELECT AVG(score) as avg FROM ratings WHERE story_id = ?';
            const params = [id];
            const result = await execQuery(sql, params);
            return result[0].avg;
        } catch (error) {
            console.error('Error fetching rating:', error);
            throw error;
        }
    }

    async updateStoryScore(id, avg_score) {
        try {
            const sql = 'UPDATE stories SET score = ? WHERE id = ?';
            const params = [avg_score, id];
            await execQuery(sql, params);
        } catch (error) {
            console.error('Error updating score:', error);
            throw error;
        }
    }

    async getRating(story_id, user_id) {
        try {
            const sql = 'SELECT * FROM ratings WHERE story_id = ? AND user_id = ?';
            const params = [story_id, user_id];
            const result = await execQuery(sql, params);
            if (result.length === 0) {
                return null;
            }
            return result[0];
        } catch (error) {
            console.error('Error fetching rating:', error);
            throw error;
        }
    }

    async editStory(storyId, title, content) {
        try {
            const sql = 'UPDATE stories SET title = ?, content = ? WHERE id = ?';
            const params = [title, content, storyId];
            await execQuery(sql, params);
        } catch (error) {
            console.error('Error editing story:', error);
            throw error;
        }
    }

    async deleteStory(storyId) {
        try {
            const sql = 'DELETE FROM stories WHERE id = ?';
            const params = [storyId];
            await execQuery(sql, params);
        } catch (error) {
            console.error('Error deleting story:', error);
            throw error;
        }
    }
}