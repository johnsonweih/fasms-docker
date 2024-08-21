const express = require('express');
const app = express();
const authRouter = require('./routes/auth');

// Middleware to parse JSON bodies
app.use(express.json());

// Route for "Hello World"
app.get('/', (req, res) => {
    res.send('Hello World');
});

// Use routes
app.use('/auth', authRouter);

// Start the server
app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
