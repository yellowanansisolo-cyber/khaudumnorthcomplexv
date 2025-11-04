// --- 1. IMPORT CORE MODULES & CONFIG ---
require('dotenv').config(); // Loads environment variables from .env file
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/database'); // Imports our database connection logic

// --- 2. INITIALIZE DATABASE CONNECTION ---
// Establishes the connection to MongoDB as soon as the application starts
connectDB();

// --- 3. INITIALIZE EXPRESS APP ---
const app = express();
const PORT = process.env.PORT || 3000;

// --- 4. CORE MIDDLEWARE SETUP ---

// A. Body Parsers: To handle incoming request data
app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 

// B. Cookie Parser: To handle cookies for authentication
app.use(cookieParser());

// C. Static File Server: This is the crucial part for your CSS, JS, and Images
// It tells Express to serve files from the 'public' directory.
app.use(express.static(path.join(__dirname, 'public')));

// --- 5. VIEW ENGINE (EJS) SETUP ---
// Sets EJS as the templating engine for rendering dynamic HTML
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// --- 6. GLOBAL TEMPLATE VARIABLES ---
// Middleware to make certain variables available in all EJS templates
app.use((req, res, next) => {
    // This makes the `user` object (if logged in) available in templates
    res.locals.user = req.user; 
    next();
});

// --- 7. ROUTE DEFINITIONS ---
// Directs requests to the appropriate route handlers
app.use('/', require('./routes/index.routes'));
app.use('/projects', require('./routes/projects.routes'));
app.use('/admin', require('./routes/admin.routes'));

// --- 8. 404 NOT FOUND HANDLER ---
// This middleware catches any request that didn't match a route above
app.use((req, res, next) => {
    const error = new Error('Not Found');
    error.status = 404;
    next(error); // Pass the error to the global error handler
});

// --- 9. GLOBAL ERROR HANDLER ---
// This will catch any error that occurs in your routes and middleware
app.use((err, req, res, next) => {
    // Log the error stack trace to the console
    console.error(err.stack);

    // Set a default status code if one isn't already set
    err.status = err.status || 500;
    
    // Render a user-friendly error page
    res.status(err.status).render('404', { 
        title: err.status === 404 ? 'Page Not Found' : 'Server Error' 
    });
});


// --- 10. START THE SERVER ---
// Listens for incoming connections on the specified port
app.listen(PORT, () => console.log(`Server is running successfully on http://localhost:${PORT}`));