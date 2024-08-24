// src/controllers/schemeController.js

const Scheme = require('../models/scheme');
const Applicant  = require('../models/applicant');
const utils = require('../utils/utils');

// Controller to get all schemes
async function getAllSchemes(req, res) {
    try {
        const schemes = await Scheme.getAllSchemes();

        const schemesMap = {};

        for (const scheme of schemes) {
            // Sanitize the scheme object
            const sanitizedScheme = utils.sanitizeObject(scheme);

            // Get criteria for the scheme
            const criteria = await Scheme.getCriteriaBySchemeId(sanitizedScheme.id);
            // Sanitize the criteria data
            const sanitizedCriteria = criteria.map(utils.sanitizeObject);

            // Get benefits for the scheme
            const benefits = await Scheme.getBenefitsBySchemeId(sanitizedScheme.id);
            // Sanitize the benefits data
            const sanitizedBenefits = benefits.map(utils.sanitizeObject);

            // Format the criteria and benefits
            const formattedCriteria = sanitizedCriteria.map(c => ({
                employment_status: c.employment_status || undefined,
                has_children: c.has_children ? { school_level: c.children_school_level || undefined } : undefined
            }));

            // Check if the scheme already exists in the map
            if (!schemesMap[sanitizedScheme.id]) {
                schemesMap[sanitizedScheme.id] = {
                    id: sanitizedScheme.id,
                    name: sanitizedScheme.name,
                    criteria: formattedCriteria.length ? formattedCriteria[0] : {}, // Only one criteria object should exist per scheme
                    benefits: []
                };
            }

            // Add benefits to the scheme
            sanitizedBenefits.forEach(b => {
                schemesMap[sanitizedScheme.id].benefits.push({
                    id: b.id,
                    name: b.name,
                    amount: b.amount
                });
            });
        }

        // Convert the schemes object to an array
        const schemesArray = Object.values(schemesMap);
        
        res.status(200).json({ schemes: schemesArray });

    } catch (error) {
        res.status(500).json({ message: 'Error fetching schemes', error });
    }
}

// Controller to get all schemes that an applicant is eligible to apply for
async function getEligibleSchemes(req, res) {
    try {
        const sanitizedQuery = utils.sanitizeObject(req.query);
        const applicantId = sanitizedQuery.applicant;
        if (!applicantId) {
            return res.status(400).json({ message: 'Applicant ID is required' });
        }

        // Fetch applicant details
        const applicant = await Applicant.getApplicantById(applicantId);
        if (!applicant) {
            return res.status(404).json({ message: 'Applicant not found' });
        }

        // Extract relevant details from the applicant
        const sanitizedApplicant = utils.sanitizeObject(applicant);
        const { employment_status, household } = sanitizedApplicant;

        // Determine if the applicant has children and extract children's school levels
        let has_children = false;
        let children_school_level = [];

        household.forEach(member => {
            if (member.relation === 'son' || member.relation === 'daughter') {
                has_children = true;
                if (member.school_level) {
                    children_school_level.push(member.school_level);
                }
            }
        });

        const applicantInfo = {
            employment_status,
            has_children,
            children_school_level
        };

        // Fetch eligible schemes
        const eligibleSchemes = await Scheme.getEligibleSchemes(applicantInfo);
        const sanitizedEligibleSchemes = eligibleSchemes.map(utils.sanitizeObject);

        // Transform the eligible schemes into the desired structure
        const formattedSchemes = sanitizedEligibleSchemes.reduce((acc, scheme) => {
            const {
                id,
                name,
                employment_status,
                has_children,
                benefit_name,
                amount,
                children_school_level: eligibleSchoolLevel
            } = scheme;

            // Initialize scheme if it doesn't exist
            if (!acc[id]) {
                acc[id] = {
                    id,
                    name,
                    criteria: {
                        employment_status: employment_status || undefined,
                        has_children: has_children ? { school_level: eligibleSchoolLevel } : undefined
                    },
                    benefits: []
                };
            }

            // Add benefits to the scheme
            if (benefit_name) {
                acc[id].benefits.push({
                    id: scheme.benefit_id,
                    name: benefit_name,
                    amount
                });
            }

            return acc;
        }, {});

        // Convert the schemes object to an array
        const schemesArray = Object.values(formattedSchemes);

        res.status(200).json({ schemes: schemesArray });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching eligible schemes', error });
    }
}

module.exports = {
    getAllSchemes,
    getEligibleSchemes
};
