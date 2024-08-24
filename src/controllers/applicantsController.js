// src/controllers/applicantsController.js

const Applicant  = require('../models/applicant');
const utils = require('../utils/utils');

// Get all applicants
async function getAllApplicants(req, res) {
  try {
    const applicants = await Applicant.getAllApplicants();
    const sanitizedApplicants = applicants.map(applicant => {

      // Date transformation and data sanitization
      const transformedApplicant = {
        ...utils.sanitizeObject(applicant),
        date_of_birth: utils.transformDateFormat(applicant.date_of_birth),
        created_at: utils.transformDateFormat(applicant.created_at),
      };

      if (transformedApplicant.household) {
        transformedApplicant.household = transformedApplicant.household.map(member => ({
          ...member,
          date_of_birth: utils.transformDateFormat(member.date_of_birth),
        }));
      }
      return transformedApplicant;
    });

    res.status(200).json({ Applicants: sanitizedApplicants});
  } catch (error) {
    res.status(500).json({ message: 'Error fetching applicants', error });
  }
}

// Create a new applicant
async function createApplicant(req, res) {
  try {
    const sanitizedData = utils.sanitizeObject(req.body);
    const { applicant, householdMembers } = sanitizedData;

    const newApplicantId = await Applicant.createApplicantWithHousehold(applicant, householdMembers);
    res.status(201).json({ id: newApplicantId, message: "Applicant created successfully." });
  } catch (error) {
    if (error.message === 'Applicant with the same NRIC already exists.') {
      res.status(409).json({ message: 'Applicant with the same NRIC already exists.' });
    } else {
      res.status(500).json({ message: 'Error creating applicant and household', error });
    }  
  }
}

// Get an applicant by ID
async function getApplicantById(req, res) {
  try {
    const sanitizedParams = utils.sanitizeObject(req.params); // Sanitize path parameters
    const applicant = await Applicant.getApplicantById(sanitizedParams.id);
    
    if (applicant) {
      const transformedApplicant = utils.transformDatesInObject(applicant);
      res.status(200).json({ applicant: transformedApplicant });
    } else {
      res.status(404).json({ message: 'Applicant not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error fetching applicant', error });
  }
}

module.exports = {
  getAllApplicants,
  createApplicant,
  getApplicantById
};
