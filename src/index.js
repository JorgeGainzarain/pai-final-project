import express from 'express';
import authRoutes from './routes.js';
import session from 'express-session';
import dotenv from 'dotenv';
import initializeDatabase from './database.js';
import cookieParser from 'cookie-parser';

dotenv.config();
const app = express();
const port = 3000;

app.use(cookieParser());


// Initialize the database
initializeDatabase().then(() => {
    console.log('Database initialized');
}).catch(err => {
    console.error('Error initializing database:', err);
});

// Setup Session
app.use(session({
    secret: process.env.SESSION_SECRET || 'fallback_secret_for_development',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }
}));

app.use(express.urlencoded({ extended: true }));

// Serve static files from the 'public' directory
app.use(express.static('public'));

// Set EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', './views');

// Use the auth routes
app.use('/', authRoutes);

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});