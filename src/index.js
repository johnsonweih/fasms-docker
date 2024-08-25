const express = require('express');
const app = express();
const authRouter = require('./routes/auth');
const applicantsRouter = require('./routes/applicants');
const schemesRouter = require('./routes/schemes');
const applicationsRouter = require('./routes/applications');

// Middleware to parse JSON bodies
app.use(express.json());

// Route for "Hello World"
app.get('/', (req, res) => {
    res.send('Welcome to Financial Assistance Scheme Management System');
});

// Use routes
app.use('/auth', authRouter);
app.use('/api/applicants', applicantsRouter);  // Applicants routes
app.use('/api/schemes', schemesRouter);  // Schemes routes
app.use('/api/applications', applicationsRouter);  // Applications routes

// Start the server
app.listen(3000, () => {
    console.log('Server is running on port 3000');
});

// 404 error handling
app.use((req, res, next) => {
    res.status(404).json({ message: 'Resource not found' });
});

// Centralized error handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.status || 500).json({
        message: err.message || 'Internal Server Error',
        error: process.env.NODE_ENV === 'development' ? err : {}
    });
});