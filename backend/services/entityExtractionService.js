// services/entityExtractionService.js
/**
 * This service extracts entities from user input using regex and NLP
 */
const natural = require('natural');

class EntityExtractionService {
    /**
     * Extract boolean value (yes/no) from text
     * @param {string} text - The text to extract from
     * @returns {boolean|null} - True for yes, False for no, null if not found
     */
    extractBoolean(text) {
        const positiveRegex = /\b(yes|yeah|sure|definitely|correct|right|ok|okay|yep|yup|positive|true|confirm)\b/i;
        const negativeRegex = /\b(no|nope|not|negative|false|incorrect|wrong|nah)\b/i;

        if (positiveRegex.test(text)) {
            return true;
        } else if (negativeRegex.test(text)) {
            return false;
        }

        return null;
    }

    /**
     * Extract duration (notice period) from text
     * @param {string} text - The text to extract from
     * @returns {number|null} - Notice period in days, null if not found
     */
    extractDuration(text) {
        // Match patterns like "30 days", "1 month", "2 months", "two weeks", etc.
        const daysRegex = /(\d+)\s*days?/i;
        const weeksRegex = /(\d+)\s*weeks?/i;
        const monthsRegex = /(\d+)\s*months?/i;

        // Text to number mapping for common words
        const textToNumber = {
            'one': 1, 'two': 2, 'three': 3, 'four': 4, 'five': 5,
            'six': 6, 'seven': 7, 'eight': 8, 'nine': 9, 'ten': 10,
            'eleven': 11, 'twelve': 12, 'fifteen': 15, 'thirty': 30,
            'sixty': 60, 'ninety': 90
        };

        // Check for text numbers first
        for (const [word, number] of Object.entries(textToNumber)) {
            const textDaysRegex = new RegExp(`${word}\\s*days?`, 'i');
            const textWeeksRegex = new RegExp(`${word}\\s*weeks?`, 'i');
            const textMonthsRegex = new RegExp(`${word}\\s*months?`, 'i');

            if (textDaysRegex.test(text)) {
                return number;
            }

            if (textWeeksRegex.test(text)) {
                return number * 7;
            }

            if (textMonthsRegex.test(text)) {
                return number * 30;
            }
        }

        // Check for numeric patterns
        let match = daysRegex.exec(text);
        if (match) {
            return parseInt(match[1], 10);
        }

        match = weeksRegex.exec(text);
        if (match) {
            return parseInt(match[1], 10) * 7;
        }

        match = monthsRegex.exec(text);
        if (match) {
            return parseInt(match[1], 10) * 30;
        }

        return null;
    }

    /**
     * Extract CTC (Current and Expected) from text
     * @param {string} text - The text to extract from
     * @returns {Object} - Object with current and expected CTC
     */
    extractCTC(text) {
        // Match patterns like "10 LPA", "10.5 lakh", "12,50,000", etc.
        const ctcRegex = /(\d+(?:[\.,]\d+)?)\s*(?:lakh|lakhs|lpa|L|lac)/gi;
        const numberRegex = /(\d+(?:[\.,]\d+)?)(?:\s*k|\s*thousand|\s*lakh|\s*lakhs|\s*lpa|\s*L|\s*lac|\s*million|\s*M)?\b/gi;

        const result = { current: null, expected: null };

        // First, try to extract using specific CTC regex
        const ctcMatches = [...text.matchAll(ctcRegex)];

        if (ctcMatches.length >= 2) {
            result.current = parseFloat(ctcMatches[0][1]);
            result.expected = parseFloat(ctcMatches[1][1]);
            return result;
        }

        // If not found or incomplete, try general number extraction
        // and use context clues to determine current vs expected
        const currentRegex = /current|present|now|earning|making|get/i;
        const expectedRegex = /expect|looking|want|desired|asking/i;

        const sentences = text.split(/[.;,]/);

        for (const sentence of sentences) {
            const numbers = [...sentence.matchAll(numberRegex)];

            if (numbers.length === 0) continue;

            if (currentRegex.test(sentence) && !result.current) {
                result.current = parseFloat(numbers[0][1]);
            } else if (expectedRegex.test(sentence) && !result.expected) {
                result.expected = parseFloat(numbers[0][1]);
            } else if (!result.current) {
                result.current = parseFloat(numbers[0][1]);
            } else if (!result.expected && numbers.length > 1) {
                result.expected = parseFloat(numbers[1][1]);
            }
        }

        return result;
    }

    /**
     * Extract date and time from text
     * @param {string} text - The text to extract from
     * @returns {Date|null} - Date object if found, null otherwise
     */
    extractDate(text) {
        // First, try direct Date parsing for formats like "2023-04-15T14:30:00"
        const isoDateRegex = /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/;
        const isoMatch = text.match(isoDateRegex);

        if (isoMatch) {
            return new Date(isoMatch[0]);
        }

        // Map day names to day of week
        const dayMap = {
            'sunday': 0, 'monday': 1, 'tuesday': 2, 'wednesday': 3,
            'thursday': 4, 'friday': 5, 'saturday': 6,
            'sun': 0, 'mon': 1, 'tue': 2, 'wed': 3, 'thu': 4, 'fri': 5, 'sat': 6
        };

        // Match patterns like "next Monday", "Tuesday afternoon", "Friday at 2pm"
        const dayRegex = /\b(next\s+)?(monday|tuesday|wednesday|thursday|friday|saturday|sunday|mon|tue|wed|thu|fri|sat|sun)\b/i;
        const timeRegex = /\b(\d{1,2})(?::(\d{2}))?\s*(am|pm|a\.m\.|p\.m\.)?\b/i;
        const periodRegex = /\b(morning|afternoon|evening)\b/i;

        const dayMatch = text.match(dayRegex);
        const timeMatch = text.match(timeRegex);
        const periodMatch = text.match(periodRegex);

        if (!dayMatch) return null;

        // Get the current date
        const now = new Date();
        const currentDay = now.getDay();

        // Calculate the target day
        const targetDay = dayMap[dayMatch[2].toLowerCase()];
        let daysToAdd = (targetDay - currentDay + 7) % 7;

        // If "next" is specified, add 7 more days
        if (dayMatch[1] && dayMatch[1].trim().toLowerCase() === 'next') {
            daysToAdd += 7;
        }

        // If the target day is today and there's no "next" prefix, go to next week
        if (daysToAdd === 0 && !dayMatch[1]) {
            daysToAdd = 7;
        }

        // Create the date object for the target day
        const targetDate = new Date(now);
        targetDate.setDate(now.getDate() + daysToAdd);

        // Set default time (9:00 AM for morning, 2:00 PM for afternoon, 6:00 PM for evening)
        if (periodMatch) {
            const period = periodMatch[1].toLowerCase();
            if (period === 'morning') {
                targetDate.setHours(9, 0, 0, 0);
            } else if (period === 'afternoon') {
                targetDate.setHours(14, 0, 0, 0);
            } else if (period === 'evening') {
                targetDate.setHours(18, 0, 0, 0);
            }
        } else {
            // Default to 9:00 AM if no time specified
            targetDate.setHours(9, 0, 0, 0);
        }

        // If specific time is mentioned, set it
        if (timeMatch) {
            let hour = parseInt(timeMatch[1], 10);
            const minute = timeMatch[2] ? parseInt(timeMatch[2], 10) : 0;
            const ampm = timeMatch[3] ? timeMatch[3].toLowerCase() : null;

            // Convert to 24-hour format if needed
            if (ampm && (ampm === 'pm' || ampm === 'p.m.') && hour < 12) {
                hour += 12;
            } else if (ampm && (ampm === 'am' || ampm === 'a.m.') && hour === 12) {
                hour = 0;
            }

            targetDate.setHours(hour, minute, 0, 0);
        }

        return targetDate;
    }

    /**
     * Find the closest available slot to the requested date
     * @param {Date} requestedDate - The requested date
     * @param {Array<string>} availableSlots - List of available slot timestamps
     * @returns {string|null} - The closest matching slot or null if none found
     */
    findClosestSlot(requestedDate, availableSlots) {
        if (!availableSlots || availableSlots.length === 0) return null;

        // Convert requestedDate to timestamp for comparison
        const requestedTimestamp = requestedDate.getTime();

        // Map of day to readable name
        const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

        // First, try to find slots on the same day
        const sameDay = availableSlots.filter(slot => {
            const slotDate = new Date(slot);
            return slotDate.getDate() === requestedDate.getDate() &&
                slotDate.getMonth() === requestedDate.getMonth() &&
                slotDate.getFullYear() === requestedDate.getFullYear();
        });

        if (sameDay.length > 0) {
            // Find the closest time on the same day
            return this.findClosestTime(requestedTimestamp, sameDay);
        }

        // If no slots on the same day, find the closest day
        return this.findClosestTime(requestedTimestamp, availableSlots);
    }

    /**
     * Find the closest time from a list of slots
     * @param {number} targetTimestamp - The target timestamp
     * @param {Array<string>} timeSlots - List of time slot timestamps
     * @returns {string|null} - The closest matching slot or null if none found
     */
    findClosestTime(targetTimestamp, timeSlots) {
        if (!timeSlots || timeSlots.length === 0) return null;

        let closestSlot = null;
        let minDifference = Infinity;

        for (const slot of timeSlots) {
            const slotTimestamp = new Date(slot).getTime();
            const difference = Math.abs(slotTimestamp - targetTimestamp);

            if (difference < minDifference) {
                minDifference = difference;
                closestSlot = slot;
            }
        }

        return closestSlot;
    }
}

module.exports = new EntityExtractionService();