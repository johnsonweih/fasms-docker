const express = require('express');
const { body, query, validationResult } = require('express-validator');
const router = express.Router();
const applicationsController = require('../controllers/applicationsController');
const { authMiddleware, authorizeRole } = require('../middleware/authMiddleware');

// Middleware to validate request body and query parameters
const validateNoBodyOrQuery = (req, res, next) => {
    if (Object.keys(req.query).length > 0) {
        return res.status(400).json({ errors: [{ msg: 'No query parameters allowed' }] });
    }
    if (Object.keys(req.body).length > 0) {
        return res.status(400).json({ errors: [{ msg: 'No request body allowed' }] });
    }
    next();
};

// Middleware to validate update request body
const validateUpdateApplicationStatus = [
    query('application').isInt().withMessage('Application ID must be an integer'),
    body('status').isString().withMessage('Status must be a string'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

// Route to get all applications
router.get('/', authMiddleware, authorizeRole('Admin'), validateNoBodyOrQuery, applicationsController.getAllApplications);

// Route to create a new application
router.post('/', authMiddleware, authorizeRole('Admin'),
    [
        body('applicant_id').isInt().withMessage('Applicant ID must be an integer'),
        body('scheme_id').isInt().withMessage('Scheme ID must be an integer'),
        (req, res, next) => {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            next();
        }
    ],
    applicationsController.createApplication
);

// Route to update an application status
router.put('/update', authMiddleware, authorizeRole('Admin'), validateUpdateApplicationStatus, applicationsController.updateApplicationStatus);

module.exports = router;
