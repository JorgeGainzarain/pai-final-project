// src/routes.js
import express from 'express';
import Service from './models/service.js';
import path from 'path';
import { fileURLToPath } from 'url';

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

router.get('/index', async (req, res) =>  {
    let user = req.session['user'];

    const darkModeEnabled = req.cookies['dark-mode'] === 'enabled';
    res.render('index', { theme: darkModeEnabled ? 'dark' : 'light' , user: user});
});

router.get('/createStory', (req, res) => {
    res.sendFile(path.join(__dirname, '../views/createStory.ejs'));
});

router.get('/showStories', async (req, res) => {
    const stories = await Service.getStories();
    stories.forEach(story => {
        console.log(story);
    });
    res.render('showStories', { stories });
});

router.get('/myStories', async (req, res) => {
    const user = req.session['user'];
    if (!user || !user.id) {
        return res.redirect('/login');
    }
    const stories = await Service.getStoriesByUser(user.id);
    res.render('showStories', { stories });
});

router.post('/createStory', async (req, res) => {
    const user = req.session['user'];
    if (!user || !user.id) {
        return res.redirect('/login');
    }
    const { title, content } = req.body;
    try {
        await Service.createStory(user.id, title, content);
        res.redirect('/index');
    } catch (error) {
        res.status(500).send('Error creating story');
    }
});


router.post('/signup', async (req, res) => {
    let username = req.body.username;
    let fullName = req.body.fullName;
    let password = req.body.password;

    try {
        let signed = await Service.signup(username, fullName, password);
        if (!signed) {
            return res.redirect('/signup?error=Username already taken');
        }
        res.redirect('/login');
    } catch (e) {
        return res.redirect('/signup?error=Error during signup');
    }
});

router.post('/login', async (req, res) => {
    let username = String(req.body.username);
    let password = String(req.body.password);

    try {
        let user = await Service.signin(username, password);
        if (!user) {
            return res.redirect('/login?error=Invalid username or password');
        }
        req.session['user'] = user;
        res.redirect('/index');
    } catch (e) {
        console.error(e);
        return res.redirect('/login?error=Error during login');
    }
});

router.post('/logout', (req, res) => {
    req.session.destroy(() => {
        res.redirect('/index');
    });
});

export default router;