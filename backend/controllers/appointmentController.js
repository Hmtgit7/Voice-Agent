// controllers/appointmentController.js
const { Appointment, Job, Candidate } = require('../models');

exports.createAppointment = async (req, res) => {
    try {
        const { job_id, candidate_id, date_time } = req.body;

        // Check if job exists
        const job = await Job.findByPk(job_id);
        if (!job) {
            return res.status(404).json({
                success: false,
                message: 'Job not found'
            });
        }

        // Check if candidate exists
        const candidate = await Candidate.findByPk(candidate_id);
        if (!candidate) {
            return res.status(404).json({
                success: false,
                message: 'Candidate not found'
            });
        }

        // Check if time slot is available
        const isTimeSlotAvailable = job.available_slots.some(slot =>
            new Date(slot).toISOString() === new Date(date_time).toISOString()
        );

        if (!isTimeSlotAvailable) {
            return res.status(400).json({
                success: false,
                message: 'Time slot is not available'
            });
        }

        // Create appointment
        const appointment = await Appointment.create({
            job_id,
            candidate_id,
            date_time
        });

        // Update candidate status
        await candidate.update({ status: 'scheduled' });

        // Remove the booked slot from available slots
        const updatedSlots = job.available_slots.filter(slot =>
            new Date(slot).toISOString() !== new Date(date_time).toISOString()
        );

        await job.update({ available_slots: updatedSlots });

        return res.status(201).json({
            success: true,
            data: appointment
        });
    } catch (error) {
        console.error('Error creating appointment:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to create appointment',
            error: error.message
        });
    }
};

exports.getAllAppointments = async (req, res) => {
    try {
        const appointments = await Appointment.findAll({
            include: [
                { model: Job, attributes: ['id', 'title'] },
                { model: Candidate, attributes: ['id', 'name', 'phone'] }
            ],
            order: [['date_time', 'ASC']]
        });

        return res.status(200).json({
            success: true,
            count: appointments.length,
            data: appointments
        });
    } catch (error) {
        console.error('Error fetching appointments:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to fetch appointments',
            error: error.message
        });
    }
};

exports.getAppointmentById = async (req, res) => {
    try {
        const appointment = await Appointment.findByPk(req.params.id, {
            include: [
                { model: Job, attributes: ['id', 'title', 'description'] },
                { model: Candidate, attributes: ['id', 'name', 'phone', 'email'] }
            ]
        });

        if (!appointment) {
            return res.status(404).json({
                success: false,
                message: 'Appointment not found'
            });
        }

        return res.status(200).json({
            success: true,
            data: appointment
        });
    } catch (error) {
        console.error('Error fetching appointment:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to fetch appointment',
            error: error.message
        });
    }
};

exports.updateAppointment = async (req, res) => {
    try {
        const { date_time, status } = req.body;

        const appointment = await Appointment.findByPk(req.params.id, {
            include: [{ model: Job }, { model: Candidate }]
        });

        if (!appointment) {
            return res.status(404).json({
                success: false,
                message: 'Appointment not found'
            });
        }

        // If rescheduling, check if new time slot is available
        if (date_time && date_time !== appointment.date_time.toISOString()) {
            const job = appointment.Job;

            const isTimeSlotAvailable = job.available_slots.some(slot =>
                new Date(slot).toISOString() === new Date(date_time).toISOString()
            );

            if (!isTimeSlotAvailable) {
                return res.status(400).json({
                    success: false,
                    message: 'New time slot is not available'
                });
            }

            // Add the previous slot back to available slots
            const updatedSlots = [...job.available_slots, appointment.date_time];
            await job.update({ available_slots: updatedSlots });

            // Remove the new booked slot
            const finalSlots = updatedSlots.filter(slot =>
                new Date(slot).toISOString() !== new Date(date_time).toISOString()
            );
            await job.update({ available_slots: finalSlots });
        }

        await appointment.update({
            date_time: date_time || appointment.date_time,
            status: status || appointment.status
        });

        // Update candidate status if appointment status changed
        if (status && status !== appointment.status) {
            const candidateStatus = status === 'completed' ? 'interviewed' :
                status === 'cancelled' ? 'contacted' : 'scheduled';

            await appointment.Candidate.update({ status: candidateStatus });
        }

        return res.status(200).json({
            success: true,
            data: appointment
        });
    } catch (error) {
        console.error('Error updating appointment:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to update appointment',
            error: error.message
        });
    }
};

exports.deleteAppointment = async (req, res) => {
    try {
        const appointment = await Appointment.findByPk(req.params.id, {
            include: [{ model: Job }, { model: Candidate }]
        });

        if (!appointment) {
            return res.status(404).json({
                success: false,
                message: 'Appointment not found'
            });
        }

        // Add the slot back to available slots
        const job = appointment.Job;
        const updatedSlots = [...job.available_slots, appointment.date_time];
        await job.update({ available_slots: updatedSlots });

        // Update candidate status
        await appointment.Candidate.update({ status: 'contacted' });

        await appointment.destroy();

        return res.status(200).json({
            success: true,
            message: 'Appointment deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting appointment:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to delete appointment',
            error: error.message
        });
    }
};