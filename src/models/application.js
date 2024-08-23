const db = require('../../config/dbConfig'); // Import the centralized DB config

// Get all applications from the database
async function getAllApplications() {
    const query = 'SELECT * FROM applications';
    try {
        const [applicationRows] = await db.query(query);
        return applicationRows;
    } catch (error) {
        throw new Error('Error fetching applications: ' + error.message);
    }
}

// Create a new application in the database
async function createApplication(applicationData) {
    const { applicant_id, scheme_id } = applicationData;
    const query = `
            INSERT INTO applications (applicant_id, scheme_id, status, created_at, status_last_modified_at)
            VALUES (?, ?, ?, NOW(), NOW())
        `;
    try {
        const [result] = await db.query(query, [applicant_id, scheme_id, 'pending']);
        return result.insertId;
    } catch (error) {
        throw new Error('Error creating application: ' + error.message);
    }
}

// Update application status in the database
async function updateApplicationStatus(applicationId, status) {
    const query = `
            UPDATE applications
            SET status = ?, status_last_modified_at = NOW()
            WHERE id = ?
        `;
    try {
        const [result] = await db.query(query, [status, applicationId]);
        return result.affectedRows;
    } catch (error) {
        throw new Error('Error updating application status: ' + error.message);
    }
}

module.exports = {
    getAllApplications,
    createApplication,
    updateApplicationStatus
  };
  