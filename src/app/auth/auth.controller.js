import { Router } from 'express';
import { AuthService } from './auth.service.js';

export class AuthController {
    service = new AuthService();
    
    constructor() {
        this.router = Router();
        this.router.get('/login', this.getLogin.bind(this));
        this.router.get('/signup', this.getSignup.bind(this));
        this.router.post('/signup', this.postSignup.bind(this));
        this.router.post('/login', this.postLogin.bind(this));
        this.router.post('/logout', this.postLogout.bind(this));
        this.router.get('/user/:id', this.getUserById.bind(this));
    }

    getLogin(req, res) {
        const darkModeEnabled = (req.cookies['dark-mode'] === 'enabled');
        res.render('login', { theme: darkModeEnabled ? 'dark' : 'light', error: req.query.error || null });
    }

    getSignup(req, res) {
        const darkModeEnabled = req.cookies['dark-mode'] === 'enabled';
        res.render('signup', { theme: darkModeEnabled ? 'dark' : 'light', error: req.query.error || null });
    }

    async getUserById(req, res) {
        try {
            let user = await this.service.getUserById(req.params.id);
            user = await this.service.getUserData(user);
            if (user) {
                res.render('userProfile', { user });
            } else {
                res.status(404).send('User not found');
            }
        } catch (error) {
            res.status(500).send('Error fetching user profile');
        }
    }

    async postSignup(req, res) {
        let { username, fullName, password } = req.body;

        try {
            let signed = await this.service.signup(username, fullName, password);
            if (!signed) {
                return res.redirect('/signup?error=Username already taken');
            }
            res.redirect('/login');
        } catch (e) {
            return res.redirect('/signup?error=Error during signup');
        }
    }

    async postLogin(req, res) {
        let { username, password } = req.body;

        try {
            let user = await this.service.signin(username, password);
            if (!user) {
                return res.redirect('/login?error=Invalid username or password');
            }
            req.session['user'] = user;
            res.redirect('/index');
        } catch (e) {
            console.error(e);
            return res.redirect('/login?error=Error during login');
        }
    }

    postLogout(req, res) {
        req.session.destroy(() => {
            res.redirect('/index');
        });
    }
}