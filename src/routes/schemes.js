const express = require('express');
const router = express.Router();
const schemeController = require('../controllers/schemeController');
const { authMiddleware, authorizeRole } = require('../middleware/authMiddleware');

// Route to get all schemes
router.get('/', authMiddleware, authorizeRole('Admin'), schemeController.getAllSchemes);

// Route to get eligible schemes for an applicant
router.get('/eligible', authMiddleware, authorizeRole('Admin'), schemeController.getEligibleSchemes);

module.exports = router;
