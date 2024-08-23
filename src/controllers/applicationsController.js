const Application = require('../models/application');
const utils = require('../utils/utils');

// Controller to get all applications
async function getAllApplications(req, res) {
    try {
        const applications = await Application.getAllApplications();
        const sanitizedApplications = applications.map(application => {
            
            // Date transformation and data sanitization
            const transformedApplication = {
                ...utils.sanitizeObject(application),
                created_at: utils.transformDateFormat(application.created_at),
                status_last_modified_at: utils.transformDateFormat(application.status_last_modified_at),
            };
            return transformedApplication;
        });

        res.status(200).json(sanitizedApplications);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching applications', error: error.message });
    }
}

// Controller to create a new application
async function createApplication(req, res) {
    try {
        const sanitizedData = utils.sanitizeObject(req.body);
        const { applicant_id, scheme_id } = sanitizedData;

        if (!applicant_id || !scheme_id) {
            return res.status(400).json({ message: 'Applicant ID, Scheme ID, and Status are required' });
        }

        const newApplicationId = await Application.createApplication({ applicant_id, scheme_id });
        res.status(201).json({ message: 'Application created successfully', applicationId: newApplicationId });
    } catch (error) {
        res.status(500).json({ message: 'Error creating application', error: error.message });
    }
}

// Controller to update an application status
async function updateApplicationStatus(req, res) {
    try {
        const sanitizedQuery = utils.sanitizeObject(req.query);
        const sanitizedData = utils.sanitizeObject(req.body);

        const applicationId = sanitizedQuery.application;
        const { status } = sanitizedData;

        if (!applicationId || !status) {
            return res.status(400).json({ message: 'Application ID and new status are required' });
        }

        const rowsUpdated = await Application.updateApplicationStatus(applicationId, status);

        if (rowsUpdated === 0) {
            return res.status(404).json({ message: 'Application not found or status unchanged' });
        }

        res.status(200).json({ message: 'Application status updated successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error updating application status', error: error.message });
    }
}

module.exports = {
    getAllApplications,
    createApplication,
    updateApplicationStatus
};
