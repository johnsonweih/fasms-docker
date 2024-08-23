const express = require('express');
const router = express.Router();
const applicationsController = require('../controllers/applicationsController');
const { authMiddleware, authorizeRole } = require('../middleware/authMiddleware');


// Route to get all applications
router.get('/', authMiddleware, authorizeRole('Admin'), applicationsController.getAllApplications);

// Route to create a new application
router.post('/', authMiddleware, authorizeRole('Admin'), applicationsController.createApplication);

// Route to update an application status
router.put('/update', authMiddleware, authorizeRole('Admin'), applicationsController.updateApplicationStatus);

module.exports = router;