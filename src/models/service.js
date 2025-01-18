import DatabaseService from "./databaseService.js";

export default class Service {
    static repository = new DatabaseService();

    static async signin(username, password) {
        const users = (await this.repository.getUser(username));
        const user = users ? users[0] : undefined;
        if(user !== undefined && user.password === password) {
            const { password, ...userWithoutPassword } = user;
            return userWithoutPassword;
        }
        else {
            return undefined;
        }
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