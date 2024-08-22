const db = require('../../config/dbConfig');

// Get all schemes
async function getAllSchemes() {
    const [schemes] = await db.query('SELECT * FROM schemes');
    return schemes;
}

// Get a scheme by ID
async function getSchemeById(id) {
    const [scheme] = await db.query('SELECT * FROM schemes WHERE id = ?', [id]);
    return scheme[0];
}

// Get all criteria for a scheme
async function getCriteriaBySchemeId(schemeId) {
    const [criteria] = await db.query('SELECT * FROM criteria WHERE scheme_id = ?', [schemeId]);
    return criteria;
}

// Get all benefits for a scheme
async function getBenefitsBySchemeId(schemeId) {
    const [benefits] = await db.query('SELECT * FROM benefits WHERE scheme_id = ?', [schemeId]);
    return benefits;
}

// Get eligible schemes for an applicant
async function getEligibleSchemes({ employment_status, has_children, children_school_level }) {
    console.log({ employment_status, has_children, children_school_level });

    // Convert children_school_level array to a comma-separated string for SQL query
    const childrenSchoolLevelConditions = children_school_level.length
        ? `c.children_school_level IN (${children_school_level.map(() => '?').join(', ')})`
        : 'c.children_school_level IS NULL';

    const query = `
        SELECT s.name, c.employment_status, c.has_children, b.name AS benefit_name, b.amount
        FROM schemes s
        LEFT JOIN criteria c ON s.id = c.scheme_id
        LEFT JOIN benefits b ON s.id = b.scheme_id
        WHERE (c.employment_status IS NULL OR c.employment_status = ?)
        AND (c.has_children IS NULL OR c.has_children = ?)
        AND (${childrenSchoolLevelConditions})
    `;

    // Flatten the array for the query parameters
    const queryParams = [
        employment_status,
        has_children ? 1 : 0,  // Convert boolean to integer for query
        ...children_school_level
    ];

    const [eligibleSchemes] = await db.query(query, queryParams);
    return eligibleSchemes;
}


module.exports = {
    getAllSchemes,
    getSchemeById,
    getCriteriaBySchemeId,
    getBenefitsBySchemeId,
    getEligibleSchemes,
};
