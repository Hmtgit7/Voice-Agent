// src/utils/formatters.js
export const formatCurrency = (amount, locale = 'en-US', currency = 'USD') => {
    if (amount === null || amount === undefined) return '';

    return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency,
    }).format(amount);
};

export const formatNumber = (number, locale = 'en-US', options = {}) => {
    if (number === null || number === undefined) return '';

    return new Intl.NumberFormat(locale, options).format(number);
};

export const formatPhoneNumber = (phoneNumber) => {
    if (!phoneNumber) return '';

    // Remove all non-numeric characters
    const cleaned = phoneNumber.replace(/\D/g, '');

    // Format based on length
    if (cleaned.length === 10) {
        return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
    } else if (cleaned.length === 11) {
        return `+${cleaned.slice(0, 1)} (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7)}`;
    }

    return phoneNumber;
};

export const truncateText = (text, maxLength = 100) => {
    if (!text) return '';

    if (text.length <= maxLength) return text;

    return text.slice(0, maxLength) + '...';
};

export const capitalizeFirstLetter = (string) => {
    if (!string) return '';

    return string.charAt(0).toUpperCase() + string.slice(1);
};

export const formatStatus = (status) => {
    if (!status) return '';

    // Replace underscores with spaces and capitalize each word
    return status
        .split('_')
        .map(word => capitalizeFirstLetter(word))
        .join(' ');
};

