// src/utils/validators.js
export const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
};

export const validatePhone = (phone) => {
    // Allow for different formats of phone numbers
    // This is a simple validation, you might want to use a library for more complex validation
    const re = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/;
    return re.test(phone);
};

export const validateRequired = (value) => {
    if (value === null || value === undefined) return false;

    if (typeof value === 'string') {
        return value.trim() !== '';
    }

    return true;
};

export const validateMinLength = (value, minLength) => {
    if (!value) return false;

    return String(value).length >= minLength;
};

export const validateMaxLength = (value, maxLength) => {
    if (!value) return true;

    return String(value).length <= maxLength;
};

export const validateNumber = (value) => {
    if (value === null || value === undefined || value === '') return false;

    return !isNaN(Number(value));
};

export const validatePositiveNumber = (value) => {
    if (!validateNumber(value)) return false;

    return Number(value) > 0;
};

export const validateNoticePeriod = (value) => {
    if (!validateNumber(value)) return false;

    const days = Number(value);

    return days >= 0 && days <= 180;
};

