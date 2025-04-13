// controllers/jobController.js
const { Job } = require('../models');

exports.createJob = async (req, res) => {
    try {
        const { title, description, requirements, available_slots } = req.body;

        const job = await Job.create({
            title,
            description,
            requirements,
            available_slots
        });

        return res.status(201).json({
            success: true,
            data: job
        });
    } catch (error) {
        console.error('Error creating job:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to create job',
            error: error.message
        });
    }
};

exports.getAllJobs = async (req, res) => {
    try {
        const jobs = await Job.findAll({
            order: [['created_at', 'DESC']]
        });

        return res.status(200).json({
            success: true,
            count: jobs.length,
            data: jobs
        });
    } catch (error) {
        console.error('Error fetching jobs:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to fetch jobs',
            error: error.message
        });
    }
};

exports.getJobById = async (req, res) => {
    try {
        const job = await Job.findByPk(req.params.id);

        if (!job) {
            return res.status(404).json({
                success: false,
                message: 'Job not found'
            });
        }

        return res.status(200).json({
            success: true,
            data: job
        });
    } catch (error) {
        console.error('Error fetching job:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to fetch job',
            error: error.message
        });
    }
};

exports.updateJob = async (req, res) => {
    try {
        const { title, description, requirements, available_slots } = req.body;

        const job = await Job.findByPk(req.params.id);

        if (!job) {
            return res.status(404).json({
                success: false,
                message: 'Job not found'
            });
        }

        await job.update({
            title: title || job.title,
            description: description || job.description,
            requirements: requirements || job.requirements,
            available_slots: available_slots || job.available_slots
        });

        return res.status(200).json({
            success: true,
            data: job
        });
    } catch (error) {
        console.error('Error updating job:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to update job',
            error: error.message
        });
    }
};

exports.deleteJob = async (req, res) => {
    try {
        const job = await Job.findByPk(req.params.id);

        if (!job) {
            return res.status(404).json({
                success: false,
                message: 'Job not found'
            });
        }

        await job.destroy();

        return res.status(200).json({
            success: true,
            message: 'Job deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting job:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to delete job',
            error: error.message
        });
    }
};

