// src/app/story/story.service.js
import StoryRepository from './story.repository.js';
import {AuthService} from "../auth/auth.service.js";
import AuthRepository from "../auth/auth.repository.js";

export default class StoryService {
    repository = new StoryRepository();
    authRepository = new AuthRepository();

    async getStories() {
        let stories = await this.repository.getStories();
        stories = await Promise.all(stories.map(async (story) => {
            story.author = await this.authRepository.getUserById(story.author_id);
            return story;
        }));
        return stories;
    }

    async getStoriesByUser(user_id) {
        let stories = await this.repository.getStoriesByUser(user_id);
        stories = await Promise.all(stories.map(async (story) => {
            story.author = await this.authRepository.getUserById(story.author_id);
            return story;
        }));
        return stories;
    }

    async createStory(user_id, title, content) {
        return await this.repository.createStory(user_id, title, content);
    }

    async getStoryById(id) {
        let story = await this.repository.getStoryById(id);
        story.author = await this.authRepository.getUserById(story.author_id);
        return story;
    }

    async rateStory(story_id, user_id, score) {
        const alreadyRated = await this.repository.getRating(story_id, user_id);
        if (alreadyRated) {
            return undefined;
        }
        await this.repository.rateStory(story_id, user_id, score);
        const avg_score = await this.repository.getRatingForStory(story_id);
        await this.repository.updateStoryScore(story_id, avg_score);
        return avg_score;
    }

    async editStory(storyId, title, content) {
        return await this.repository.editStory(storyId, title, content);
    }

    async deleteStory(storyId) {
        return await this.repository.deleteStory(storyId);
    }
}