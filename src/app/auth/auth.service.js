// src/app/auth/auth.service.js
import bcrypt from 'bcrypt';
import AuthRepository from "./auth.repository.js";
import StoryService from "../story/story.service.js";

export class AuthService {
    repository = new AuthRepository();
    storyService = new StoryService();

    async signup(username, fullName, password) {
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        return await this.repository.addUser(username, fullName, hashedPassword);
    }

    async signin(username, password) {
        const users = await this.repository.getUser(username);
        const user = users ? users[0] : undefined;
        if (user && user.password && await bcrypt.compare(password, user.password)) {
            const { password, ...userWithoutPassword } = user;
            return userWithoutPassword;
        }
        return undefined;
    }

    async getUserData(user) {
        user.stories = await this.storyService.getStoriesByUser(user.id);
        return user;
    }

    async getUserById(id) {
        const user = await this.repository.getUserById(id);
        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
    }
}