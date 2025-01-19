// src/app/story/story.controller.js
import { Router } from 'express';
import StoryService from './story.service.js';

export class StoryController {
    storyService = new StoryService();
    constructor() {
        this.router = Router();
        this.router.get('/createStory', this.createStory.bind(this));
        this.router.post('/story/', this.postCreateStory.bind(this));
        this.router.get('/story/:id', this.getStoryById.bind(this));
        this.router.delete('/story/:id', this.deleteStory.bind(this));
        this.router.get('/showStories', this.showStories.bind(this));
        this.router.get('/myStories', this.myStories.bind(this));
        this.router.post('/rateStory/:id', this.rateStory.bind(this));
        this.router.get('/editStory/:id', this.editStory.bind(this));
        this.router.post('/editStory/:id', this.postEditStory.bind(this));
    }

    createStory(req, res) {
        const user = req.session['user'];
        if (!user || !user.id) {
            return res.redirect('/login');
        }
        res.render('createStory');
    }

    async postCreateStory(req, res) {
        const user = req.session['user'];
        if (!user || !user.id) {
            return res.redirect('/login');
        }
        const { title, content } = req.body;
        try {
            await this.storyService.createStory(user.id, title, content);
            res.redirect('/index');
        } catch (error) {
            res.status(500).send('Error creating story');
        }
    }

    async getStoryById(req, res) {
        try {
            const story = await this.storyService.getStoryById(req.params.id);
            const user = req.session['user'];
            if (story) {
                res.render('storyDetails', { story: story, user: user ?? undefined });
            } else {
                res.status(404).send('Story not found');
            }
        } catch (error) {
            res.status(500).send('Error fetching story');
        }
    }

    async deleteStory(req, res) {
        const user = req.session['user'];
        if (!user || !user.id) {
            return res.status(403).send('Forbidden');
        }
        const storyId = req.params.id;
        const story = await this.storyService.getStoryById(storyId);
        if (user.id !== story.author.id) {
            return res.status(403).send('Forbidden');
        }
        try {
            await this.storyService.deleteStory(storyId);
            res.status(200).send('Story deleted');
        } catch (error) {
            res.status(500).send('Error deleting story');
        }
    }

    async showStories(req, res) {
        const stories = await this.storyService.getStories();
        const user = req.session['user'];
        res.render('showStories', { stories: stories, user: user ?? undefined });
    }

    async myStories(req, res) {
        const user = req.session['user'];
        if (!user || !user.id) {
            return res.redirect('/login');
        }
        const stories = await this.storyService.getStoriesByUser(user.id);
        res.render('showStories', { stories: stories, user: user ?? undefined });
    }

    async rateStory(req, res) {
        const user = req.session['user'];
        if (!user || !user.id) {
            return res.redirect('/login');
        }
        try {
            const result = await this.storyService.rateStory(req.params.id, user.id, req.body.score);
            if (!result) {
                res.status(400).send('User already rated this story');
            } else {
                res.status(200).json('Story rated').send();
            }
        } catch (error) {
            console.error(error);
            res.status(500).send('Error rating story');
        }
    }

    async editStory(req, res) {
        const user = req.session['user'];
        if (!user || !user.id) {
            return res.redirect('/login');
        }
        const storyId = req.params.id;
        const story = await this.storyService.getStoryById(storyId);
        if (user.id !== story.author.id) {
            return res.status(403).send('Forbidden');
        }
        res.render('createStory', { story });
    }

    async postEditStory(req, res) {
        const user = req.session['user'];
        if (!user || !user.id) {
            return res.redirect('/login');
        }
        const storyId = req.params.id;
        const { title, content } = req.body;
        try {
            await this.storyService.editStory(storyId, title, content);
            res.redirect('/index');
        } catch (error) {
            res.status(500).send('Error editing story');
        }
    }
}