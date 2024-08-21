// src/models/applicant.js

const db = require('../../config/dbConfig'); // Import the centralized DB config

// Define methods for interacting with the `applicants` table

// Get all applicants
async function getAllApplicants() {
  const [rows] = await db.query('SELECT * FROM applicants');
  return rows;
}

// Create a new applicant
async function createApplicant(applicant) {
  const { name, employment_status, sex, date_of_birth } = applicant;
  const [result] = await db.query(
    'INSERT INTO applicants (name, employment_status, sex, date_of_birth) VALUES (?, ?, ?, ?)',
    [name, employment_status, sex, date_of_birth]
  );
  return result.insertId;
}

// Get an applicant by ID
async function getApplicantById(id) {
  const [rows] = await db.query('SELECT * FROM applicants WHERE id = ?', [id]);
  return rows[0];
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
  createApplicant,
  getApplicantById,
  updateApplicant,
  deleteApplicant
};
