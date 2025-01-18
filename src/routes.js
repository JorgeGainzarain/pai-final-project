import express from 'express';
import AuthService from './models/AuthService.js';

const router = express.Router();

router.get('/', (req, res) => {
    res.redirect('/index');
});

router.get('/login', (req, res) => {
    const darkModeEnabled = (req.cookies['dark-mode'] === 'enabled');
    res.render('login', { theme: darkModeEnabled ? 'dark' : 'light' , error: req.query.error || null});
});

router.get('/signup', (req, res) => {
    const darkModeEnabled = req.cookies['dark-mode'] === 'enabled';
    res.render('signup', { theme: darkModeEnabled ? 'dark' : 'light' , error: req.query.error || null});
});

router.get('/index', (req, res) => {
    let user = req.session['user'];

    if (!user) {
        return res.redirect('/login');
    }

    const darkModeEnabled = req.cookies['dark-mode'] === 'enabled';
    res.render('index', { theme: darkModeEnabled ? 'dark' : 'light' , user: user});
});

router.post('/signup', async (req, res) => {
    let username = req.body.username;
    let fullName = req.body.fullName;
    let password = req.body.password;

    try {
        let signed = await AuthService.signup(username, fullName, password);
        if (!signed) {
            return res.redirect('/signup?error=Username already taken');
        }
        res.redirect('/login');
    } catch (e) {
        return res.redirect('/signup?error=Error during signup');
    }
});

router.post('/login', async (req, res) => {
    let username = req.body.username;
    let password = req.body.password;

    try {
        let logged = await AuthService.signin(username, password);
        if (!logged) {
            return res.redirect('/login?error=Invalid username or password');
        }
        req.session['user'] = await AuthService.users.get(username);
        res.redirect('/index');
    } catch (e) {
        return res.redirect('/login?error=Error during login');
    }
});

router.post('/logout', (req, res) => {
    req.session.destroy(() => {
        res.redirect('/login');
    });
});

export default router;