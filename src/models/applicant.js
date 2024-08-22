// src/models/applicant.js

const db = require('../../config/dbConfig'); // Import the centralized DB config

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
  const { name, employment_status, sex, date_of_birth, marital_status } = applicant;

  try {
    const [result] = await db.query(
      'INSERT INTO applicants (name, employment_status, sex, date_of_birth, marital_status) VALUES (?, ?, ?, ?, ?)',
      [name, employment_status, sex, date_of_birth, marital_status]
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


// Update an applicant
async function updateApplicant(id, applicant) {
  const { name, employment_status, sex, date_of_birth } = applicant;
  await db.query(
    'UPDATE applicants SET name = ?, employment_status = ?, sex = ?, date_of_birth = ? WHERE id = ?',
    [name, employment_status, sex, date_of_birth, id]
  );
}

// Delete an applicant
async function deleteApplicant(id) {
  await db.query('DELETE FROM applicants WHERE id = ?', [id]);
}

module.exports = {
  getAllApplicants,
  createApplicantWithHousehold,
  getApplicantById,
  updateApplicant,
  deleteApplicant
};
