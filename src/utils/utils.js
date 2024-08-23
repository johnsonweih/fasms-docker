/**
 * Utility functions for sanitizing and transforming data
 */
const moment = require('moment-timezone');

// Function to remove sensitive characters from a string
function sanitizeString(input) {
    try {
        if (typeof input !== 'string') {
            return input;
        }
        return input.replace(/[<>]/g, '');
    } catch (error) {
        console.error('Error sanitizing string:', error);
        return input; // Return the original input in case of error
    }
}

// Function to sanitize an object by removing sensitive characters from all string properties
function sanitizeObject(obj) {
    try {
        if (typeof obj !== 'object' || obj === null) {
            return obj;
        }
        const sanitizedObj = {};
        for (const key in obj) {
            if (Object.hasOwnProperty.call(obj, key)) {
                sanitizedObj[key] = typeof obj[key] === 'string' ? sanitizeString(obj[key]) : obj[key];
            }
        }
        return sanitizedObj;
    } catch (error) {
        console.error('Error sanitizing object:', error);
        return obj; // Return the original object in case of error
    }
}

// Function to transform date format (targeted for string, avoid expensive using for large dataset)
function transformDateFormat(text) {
    try {
        // Return early if the input is null or undefined
        if (text === null || text === undefined) {
            return text;
        }

        // Convert object to string if necessary
        let stringText = (typeof text === 'object') ? JSON.stringify(text) : text;

        // Proceed only if the text is a string
        if (typeof stringText === 'string') {
            const dateRegex = /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z/g;

            // Replace date strings with formatted dates
            stringText = stringText.replace(dateRegex, (match) => {
                try {
                    const date = moment(match);
                    return date.tz('Asia/Singapore').format('YYYY-MM-DD HH:mm');
                } catch (error) {
                    console.error('Error transforming date in string:', error);
                    return match; // Return the original match if error occurs
                }
            });

            // Convert the string back to object if it was originally an object
            try {
                // Attempt to parse the string back to JSON if it seems to be an object
                return JSON.parse(stringText);
            } catch (error) {
                // If parsing fails, return the string
                return stringText;
            }
        }

        return text; // Return the original input if it's not a string
    } catch (error) {
        console.error('Error in transformDateFormat function:', error);
        return text; // Return the original text in case of error
    }
}

// Function to scan through object and transform date format if any (target for small to medium-sized objects)
function transformDatesInObject(obj) {
  try {
    if (Array.isArray(obj)) {
      return obj.map(transformDatesInObject);
    } else if (obj !== null && typeof obj === 'object') {
      const result = {};
      for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
          const value = obj[key];
          
          // Log the type and value for debugging
          console.log(`Processing key: ${key}, value: ${value}`);
          
          if (value instanceof Date) {
            // Transform JavaScript Date object to formatted string
            const formattedDate = moment(value).tz('Asia/Singapore').format('YYYY-MM-DD HH:mm');
            result[key] = formattedDate;
          } else if (typeof value === 'string' && /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z/.test(value)) {
            // Transform ISO date string to formatted string
            try {
              const formattedDate = moment(value).tz('Asia/Singapore').format('YYYY-MM-DD HH:mm');
              result[key] = formattedDate;
            } catch (error) {
              console.error(`Error transforming date for key "${key}":`, error);
              result[key] = value; // Preserve original value on error
            }
          } else if (typeof value === 'object') {
            // Recursively handle nested objects
            result[key] = transformDatesInObject(value);
          } else {
            // Copy other values as is
            result[key] = value;
          }
        }
      }
      return result;
    }
    
    return obj;
  } catch (error) {
    console.error('Error transforming dates in object:', error);
    return obj; // Return the original object in case of error
  }
}


// Export utility functions
module.exports = {
    sanitizeString,
    sanitizeObject,
    transformDateFormat,
    transformDatesInObject,
};
