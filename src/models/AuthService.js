import UserRepository from "./UserRepository.js";

export default class AuthService {
    static users = new UserRepository();

    static async signin(username, password) {
        const user = await this.users.get(username);
        return user !== undefined && user.password === password;
    }

    static async signup(username, fullName, password) {
        return await this.users.add(username, fullName, password);
    }
}