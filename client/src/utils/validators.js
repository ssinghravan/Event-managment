// Reusable validation utility functions

/**
 * Validate email format
 * @param {string} email - Email address to validate
 * @returns {boolean} - True if valid, false otherwise
 */
export const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

/**
 * Validate phone number format
 * Supports various formats including international
 * @param {string} phone - Phone number to validate
 * @returns {boolean} - True if valid, false otherwise
 */
export const isValidPhone = (phone) => {
    const phoneRegex = /^[\+]?[(]?[0-9]{1,4}[)]?[-\s\.]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{1,9}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
};

/**
 * Validate URL format
 * @param {string} url - URL to validate
 * @returns {boolean} - True if valid, false otherwise
 */
export const isValidUrl = (url) => {
    try {
        new URL(url);
        return true;
    } catch (error) {
        return false;
    }
};

/**
 * Check password strength
 * @param {string} password - Password to check
 * @returns {object} - Object with strength level and score
 */
export const checkPasswordStrength = (password) => {
    let score = 0;

    if (!password) return { strength: 'none', score: 0 };

    // Length check
    if (password.length >= 8) score += 1;
    if (password.length >= 12) score += 1;

    // Character variety checks
    if (/[a-z]/.test(password)) score += 1; // lowercase
    if (/[A-Z]/.test(password)) score += 1; // uppercase
    if (/[0-9]/.test(password)) score += 1; // numbers
    if (/[^a-zA-Z0-9]/.test(password)) score += 1; // special chars

    // Determine strength level
    let strength = 'weak';
    if (score >= 5) strength = 'strong';
    else if (score >= 3) strength = 'medium';

    return { strength, score };
};

/**
 * Validate text length
 * @param {string} text - Text to validate
 * @param {number} min - Minimum length
 * @param {number} max - Maximum length
 * @returns {boolean} - True if valid, false otherwise
 */
export const isValidLength = (text, min, max = Infinity) => {
    const length = text.trim().length;
    return length >= min && length <= max;
};

/**
 * Check if field is required and has value
 * @param {string} value - Value to check
 * @returns {boolean} - True if has value, false otherwise
 */
export const isRequired = (value) => {
    return value && value.trim().length > 0;
};

/**
 * Validate date is in the future
 * @param {string} dateString - Date string to validate
 * @returns {boolean} - True if date is in future, false otherwise
 */
export const isFutureDate = (dateString) => {
    const inputDate = new Date(dateString);
    const now = new Date();
    return inputDate > now;
};

/**
 * Validate date is within range
 * @param {string} dateString - Date string to validate
 * @param {number} maxMonths - Maximum months in future (default 12)
 * @returns {boolean} - True if within range, false otherwise
 */
export const isDateInRange = (dateString, maxMonths = 12) => {
    const inputDate = new Date(dateString);
    const now = new Date();
    const maxDate = new Date();
    maxDate.setMonth(maxDate.getMonth() + maxMonths);

    return inputDate > now && inputDate <= maxDate;
};

/**
 * Format validation error messages
 */
export const errorMessages = {
    required: 'This field is required',
    email: 'Please enter a valid email address',
    phone: 'Please enter a valid phone number',
    password: 'Password must be at least 6 characters',
    passwordMatch: 'Passwords do not match',
    url: 'Please enter a valid URL',
    minLength: (min) => `Must be at least ${min} characters`,
    maxLength: (max) => `Must be less than ${max} characters`,
    futureDate: 'Date must be in the future',
    dateRange: 'Date must be within the next year',
};
