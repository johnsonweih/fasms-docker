const Scheme = require('../models/scheme');
const Applicant  = require('../models/applicant');

// Controller to get all schemes
async function getAllSchemes(req, res) {
    try {
        const schemes = await Scheme.getAllSchemes();
        res.status(200).json(schemes);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching schemes', error });
    }
}

// Controller to get all schemes that an applicant is eligible to apply for
async function getEligibleSchemes(req, res) {
    try {
        const applicantId = req.query.applicant;
        if (!applicantId) {
            return res.status(400).json({ message: 'Applicant ID is required' });
        }

        // Fetch applicant details
        const applicant = await Applicant.getApplicantById(applicantId);
        if (!applicant) {
            return res.status(404).json({ message: 'Applicant not found' });
        }

        // Extract relevant details from the applicant
        const { employment_status, household } = applicant;

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

        // Transform the eligible schemes into the desired structure
        const formattedSchemes = eligibleSchemes.reduce((acc, scheme) => {
            const {
                id,
                name,
                employment_status,
                has_children,
                benefit_name,
                amount
            } = scheme;

            // Initialize scheme if it doesn't exist
            if (!acc[id]) {
                acc[id] = {
                    id,
                    name,
                    criteria: {
                        employment_status: employment_status || undefined,
                        has_children: has_children ? { school_level: `${children_school_level.join(', ')}` } : undefined
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
