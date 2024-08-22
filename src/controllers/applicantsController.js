// src/controllers/applicantsController.js

const Applicant  = require('../models/applicant');

// Get all applicants
async function getAllApplicants(req, res) {
  try {
    const applicants = await Applicant.getAllApplicants();
    res.status(200).json(applicants);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching applicants', error });
  }
}

// Create a new applicant
async function createApplicant(req, res) {
  try {
    const { applicant, householdMembers } = req.body; // Expecting a structure with applicant and householdMembers

    const newApplicantId = await Applicant.createApplicantWithHousehold(applicant, householdMembers);
    res.status(201).json({ id: newApplicantId });
  } catch (error) {
    res.status(500).json({ message: 'Error creating applicant and household', error });
  }
}

// Get an applicant by ID
async function getApplicantById(req, res) {
  try {
    const applicant = await Applicant.getApplicantById(req.params.id);
    if (applicant) {
      res.status(200).json(applicant);
    } else {
      res.status(404).json({ message: 'Applicant not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error fetching applicant', error });
  }
}

// Update an applicant
async function updateApplicant(req, res) {
  try {
    await Applicant.updateApplicant(req.params.id, req.body);
    res.status(200).json({ message: 'Applicant updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error updating applicant', error });
  }
}

// Delete an applicant
async function deleteApplicant(req, res) {
  try {
    await Applicant.deleteApplicant(req.params.id);
    res.status(200).json({ message: 'Applicant deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting applicant', error });
  }
}

module.exports = {
  getAllApplicants,
  createApplicant,
  getApplicantById,
  updateApplicant,
  deleteApplicant
};
