import DatabaseService from "./databaseService.js";
import bcrypt from 'bcrypt';

export default class Service {
    static repository = new DatabaseService();

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
            console.log(story.author);
            return story;
        }));
        return stories;
    }

    static async createStory(user_id, title, content) {
        console.log('Creating story', user_id, title, content);
        return await this.repository.createStory(user_id, title, content);
    }
}