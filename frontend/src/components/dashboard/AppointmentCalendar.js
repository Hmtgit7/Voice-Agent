// src/components/dashboard/AppointmentCalendar.js
import React, { useState } from 'react';
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths } from 'date-fns';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import Card from '../common/Card';

const AppointmentCalendar = ({ appointments = [], onSelectDate }) => {
    const [currentMonth, setCurrentMonth] = useState(new Date());

    // Get days in current view
    const getDaysInMonth = () => {
        const start = startOfWeek(startOfMonth(currentMonth));
        const end = endOfWeek(endOfMonth(currentMonth));

        return eachDayOfInterval({ start, end });
    };

    // Previous month
    const prevMonth = () => {
        setCurrentMonth(subMonths(currentMonth, 1));
    };

    // Next month
    const nextMonth = () => {
        setCurrentMonth(addMonths(currentMonth, 1));
    };

    // Check if a date has appointments
    const hasAppointments = (day) => {
        return appointments.some(appointment => isSameDay(new Date(appointment.date_time), day));
    };

    // Get appointments for a specific day
    const getAppointmentsForDay = (day) => {
        return appointments.filter(appointment => isSameDay(new Date(appointment.date_time), day));
    };

    // Format day to display
    const formatDay = (day) => {
        return format(day, 'd');
    };

    const days = getDaysInMonth();

    return (
        <Card title="Appointments Calendar">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {format(currentMonth, 'MMMM yyyy')}
                </h2>

                <div className="flex space-x-2">
                    <button
                        type="button"
                        onClick={prevMonth}
                        className="p-2 rounded-md text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-dark-700"
                    >
                        <span className="sr-only">Previous month</span>
                        <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
                    </button>

                    <button
                        type="button"
                        onClick={nextMonth}
                        className="p-2 rounded-md text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-dark-700"
                    >
                        <span className="sr-only">Next month</span>
                        <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-7 gap-2 text-center mb-2">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                    <div key={day} className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        {day}
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-7 gap-2">
                {days.map((day) => {
                    const dayAppointments = getAppointmentsForDay(day);
                    const hasEvents = dayAppointments.length > 0;
                    const isCurrentMonth = isSameMonth(day, currentMonth);

                    return (
                        <button
                            key={day.toString()}
                            onClick={() => onSelectDate(day)}
                            className={`
                py-2 rounded-md text-center relative
                ${isCurrentMonth ? 'text-gray-900 dark:text-white' : 'text-gray-400 dark:text-gray-600'}
                ${hasEvents ? 'bg-primary-50 dark:bg-primary-900/20' : 'hover:bg-gray-100 dark:hover:bg-dark-700'}
              `}
                        >
                            <span className="text-sm">{formatDay(day)}</span>

                            {hasEvents && (
                                <span className="absolute bottom-1 left-1/2 transform -translate-x-1/2 h-1 w-1 rounded-full bg-primary-600 dark:bg-primary-400"></span>
                            )}
                        </button>
                    );
                })}
            </div>
        </Card>
    );
};

export default AppointmentCalendar;