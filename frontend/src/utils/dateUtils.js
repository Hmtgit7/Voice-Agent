// src/utils/dateUtils.js
import { format, parseISO, isValid, differenceInDays, addDays } from 'date-fns';

export const formatDate = (dateString, formatStr = 'MMM dd, yyyy') => {
    if (!dateString) return '';

    const date = typeof dateString === 'string' ? parseISO(dateString) : dateString;

    if (!isValid(date)) return 'Invalid Date';

    return format(date, formatStr);
};

export const formatDateTime = (dateString, formatStr = 'MMM dd, yyyy HH:mm') => {
    return formatDate(dateString, formatStr);
};

export const formatTime = (dateString, formatStr = 'HH:mm') => {
    return formatDate(dateString, formatStr);
};

export const calculateDaysBetween = (startDate, endDate) => {
    if (!startDate || !endDate) return 0;

    const start = typeof startDate === 'string' ? parseISO(startDate) : startDate;
    const end = typeof endDate === 'string' ? parseISO(endDate) : endDate;

    if (!isValid(start) || !isValid(end)) return 0;

    return differenceInDays(end, start);
};

export const addDaysToDate = (dateString, days) => {
    if (!dateString) return null;

    const date = typeof dateString === 'string' ? parseISO(dateString) : dateString;

    if (!isValid(date)) return null;

    return addDays(date, days);
};

export const getTimeSlots = (date, startHour = 9, endHour = 17, intervalMinutes = 60) => {
    if (!date) return [];

    const slots = [];
    const baseDate = typeof date === 'string' ? parseISO(date) : date;

    if (!isValid(baseDate)) return [];

    // Set hours to start hour and minutes to 0
    const startDate = new Date(baseDate);
    startDate.setHours(startHour, 0, 0, 0);

    // Set hours to end hour and minutes to 0
    const endDate = new Date(baseDate);
    endDate.setHours(endHour, 0, 0, 0);

    let currentSlot = startDate;

    while (currentSlot < endDate) {
        slots.push(new Date(currentSlot));
        currentSlot = new Date(currentSlot.getTime() + intervalMinutes * 60000);
    }

    return slots;
};

export const generateDateRange = (startDate, endDate) => {
    if (!startDate || !endDate) return [];

    const start = typeof startDate === 'string' ? parseISO(startDate) : startDate;
    const end = typeof endDate === 'string' ? parseISO(endDate) : endDate;

    if (!isValid(start) || !isValid(end)) return [];

    const dateRange = [];
    let currentDate = start;

    while (currentDate <= end) {
        dateRange.push(new Date(currentDate));
        currentDate = addDays(currentDate, 1);
    }

    return dateRange;
};