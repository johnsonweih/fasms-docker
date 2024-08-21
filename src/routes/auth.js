const express = require('express');
const router = express.Router();
const { login } = require('../controllers/authController');

// Route for user login
router.post('/login', login);

module.exports = router;
