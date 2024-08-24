// src/models/applicant.js

const db = require('../../config/dbConfig'); // Import the centralized DB config
const utils = require('../utils/utils');

// Define methods for interacting with the `applicants` table

// Get all applicants with household information
async function getAllApplicants() {
  const [applicantRows] = await db.query('SELECT * FROM applicants');
  const applicants = await Promise.all(applicantRows.map(async applicant => {
    const [householdRows] = await db.query('SELECT * FROM household WHERE applicant_id = ?', [applicant.id]);
    return {
      ...applicant,
      household: householdRows,
    };
  }));
  return applicants;
}

// Create a new applicant
async function createApplicantWithHousehold(applicant, householdMembers) {
  const { name, employment_status, sex, date_of_birth, marital_status, nric } = applicant;

  try {

    // Hash the NRIC
    const hashedNRIC = utils.hashNRIC(nric);

    // Check if the applicant with the same hashed NRIC already exists
    const [existingApplicants] = await db.query(
      'SELECT id FROM applicants WHERE hashed_nric = ?',
      [hashedNRIC]
    );

    if (existingApplicants.length > 0) {
      throw new Error('Applicant with the same NRIC already exists.');
    }

    // Insert new applicant
    const [result] = await db.query(
      'INSERT INTO applicants (name, employment_status, sex, date_of_birth, marital_status, hashed_nric) VALUES (?, ?, ?, ?, ?, ?)',
      [name, employment_status, sex, date_of_birth, marital_status, hashedNRIC]
    );
    const applicantId = result.insertId;

    // Insert household members
    for (const member of householdMembers) {
      const { name, employment_status, sex, date_of_birth, relation } = member;
      await db.query(
        'INSERT INTO household (applicant_id, name, employment_status, sex, date_of_birth, relation) VALUES (?, ?, ?, ?, ?, ?)',
        [applicantId, name, employment_status, sex, date_of_birth, relation]
      );
    }
    
    return applicantId;
  }
  catch (error) {
    console.log('Error creating applicant and household');
    throw error;
  }

}

// Get an applicant by ID with household information
async function getApplicantById(id) {
  const [applicantRows] = await db.query('SELECT * FROM applicants WHERE id = ?', [id]);
  const applicant = applicantRows[0];
  
  if (applicant) {
    const [householdRows] = await db.query('SELECT * FROM household WHERE applicant_id = ?', [applicant.id]);
    return {
      ...applicant,
      household: householdRows,
    };
  } else {
    return null;
  }
}


module.exports = {
  getAllApplicants,
  createApplicantWithHousehold,
  getApplicantById
};
