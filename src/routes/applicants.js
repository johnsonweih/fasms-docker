// src/routes/applicants.js
const express = require('express');
const { body, param, validationResult } = require('express-validator');
const router = express.Router();
const applicantsController = require('../controllers/applicantsController');
const { authMiddleware, authorizeRole } = require('../middleware/authMiddleware');

// Middleware to validate request body
const validateApplicant = [
    body('applicant.name').isString().withMessage('Name must be a string'),
    body('applicant.date_of_birth').optional().isISO8601().withMessage('Date of birth must be a valid date'),
    body('applicant.nric'.toString()).matches(/^[STFG]\d{7}[A-Z]$/).withMessage('Invalid NRIC format'),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

// Middleware to ensure no request body or query parameters
const validateNoBodyOrQuery = (req, res, next) => {
    if (Object.keys(req.query).length > 0) {
        return res.status(400).json({ errors: [{ msg: 'No query parameters allowed' }] });
    }
    if (Object.keys(req.body).length > 0) {
        return res.status(400).json({ errors: [{ msg: 'No request body allowed' }] });
    }
    next();
};

// Route to get all applicants
router.get('/', authMiddleware, authorizeRole('Admin'), validateNoBodyOrQuery, applicantsController.getAllApplicants);

// Route to get one applicant
router.get('/:id', authMiddleware, authorizeRole('Admin'), 
    param('id').isInt().withMessage('ID must be an integer'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    },
    applicantsController.getApplicantById
);

// Route to create a new applicant
router.post('/', authMiddleware, authorizeRole('Admin'), validateApplicant, applicantsController.createApplicant);

module.exports = router;
