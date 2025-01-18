import DatabaseService from "./databaseService.js";

export default class Service {
    static repository = new DatabaseService();

    static async signin(username, password) {
        const user = (await this.repository.getUser(username))[0];
        return user !== undefined && user.password === password;
    }

    static async signup(username, fullName, password) {
        return await this.repository.addUser(username, fullName, password);
    }

    static async getStories() {
        return await this.repository.getStories();
    }

    static async createStory(title, content) {
        return await this.repository.createStory(title, content);
    }
}