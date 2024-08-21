// src/routes/applicants.js
const express = require('express');
const router = express.Router();
const applicantsController = require('../controllers/applicantsController');
const { authMiddleware, authorizeRole } = require('../middleware/authMiddleware');

// Route to get all applicants
router.get('/', authMiddleware, authorizeRole('admin'), applicantsController.getAllApplicants);

// Route to create a new applicant
router.post('/', authMiddleware, authorizeRole('admin'), applicantsController.createApplicant);

// Route to get a specific applicant by ID
router.get('/:id', authMiddleware, authorizeRole('admin'), applicantsController.getApplicantById);

// Route to update a specific applicant by ID
router.put('/:id', authMiddleware, authorizeRole('admin'), applicantsController.updateApplicantById);

// Route to delete a specific applicant by ID
router.delete('/:id', authMiddleware, authorizeRole('admin'), applicantsController.deleteApplicantById);

module.exports = router;
