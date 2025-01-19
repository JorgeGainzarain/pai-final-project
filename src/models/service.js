import Repository from "./repository.js";
import bcrypt from 'bcrypt';

export default class Service {
    static repository = new Repository();

    static async signin(username, password) {
        const users = (await this.repository.getUser(username));
        const user = users ? users[0] : undefined;
        if(user !== undefined && user.password !== undefined && await bcrypt.compare(password, user.password)) {
            const { password, ...userWithoutPassword } = user;
            return userWithoutPassword;
        }
        else {
            return undefined;
        }
    }

    static async signup(username, fullName, password) {
        // Cipher the password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        return await this.repository.addUser(username, fullName, hashedPassword);
    }

    static async getStories() {
        let stories = await this.repository.getStories();
        stories = await Promise.all(stories.map(async (story) => {
            story.author = await this.repository.getUserById(story.author_id);
            return story;
        }));
        return stories;
    }

    static async getStoriesByUser(user_id) {
        let stories = await this.repository.getStoriesByUser(user_id);
        stories = await Promise.all(stories.map(async (story) => {
            story.author = await this.repository.getUserById(story.author_id);
            return story;
        }));
        return stories;
    }

    static async createStory(user_id, title, content) {
        return await this.repository.createStory(user_id, title, content);
    }

    static async getStoryById(id) {
        let story = await this.repository.getStoryById(id);
        story.author = await this.repository.getUserById(story.author_id);
        return story;
    }

    static async getUserById(id) {
        const user =  await this.repository.getUserById(id);
        // Return without password
        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
    }

    static async getUserData(user) {
        user.stories = await this.getStoriesByUser(user.id);
        return user;
    }

    static async rateStory(story_id, user_id, score) {
        const alreadyRated = await this.repository.getRating(story_id, user_id);
        if (alreadyRated) {
            return undefined;
        }
        await this.repository.rateStory(story_id, user_id, score);
        const avg_score = await this.repository.getRatingForStory(story_id);
        await this.repository.updateStoryScore(story_id, avg_score);
        return avg_score;
    }

    static async editStory(storyId, title, content) {
        return await this.repository.editStory(storyId, title, content);
    }
}