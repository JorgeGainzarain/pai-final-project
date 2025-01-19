// src/routes.js
import express from 'express';
const router = express.Router();
import {AuthController} from "./app/auth/auth.controller.js";
import {StoryController} from "./app/story/story.controller.js";

const authController = new AuthController();
const storyController = new StoryController();

// Redirect route
router.get('/', (req, res) => {
    res.redirect('/index');
});

// Index route
router.get('/index', async (req, res) =>  {
    let user = req.session['user'];

    const darkModeEnabled = req.cookies['dark-mode'] === 'enabled';
    res.render('index', { theme: darkModeEnabled ? 'dark' : 'light' , user: user});
});

router.use(authController.router);
router.use(storyController.router);


export default router;