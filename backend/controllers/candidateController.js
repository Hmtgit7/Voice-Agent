// controllers/candidateController.js
const { Candidate, Conversation } = require('../models');

exports.createCandidate = async (req, res) => {
    try {
        const { name, phone, email, experience } = req.body;

        const candidate = await Candidate.create({
            name,
            phone,
            email,
            experience
        });

        return res.status(201).json({
            success: true,
            data: candidate
        });
    } catch (error) {
        console.error('Error creating candidate:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to create candidate',
            error: error.message
        });
    }
};

exports.getAllCandidates = async (req, res) => {
    try {
        const candidates = await Candidate.findAll({
            order: [['created_at', 'DESC']]
        });

        return res.status(200).json({
            success: true,
            count: candidates.length,
            data: candidates
        });
    } catch (error) {
        console.error('Error fetching candidates:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to fetch candidates',
            error: error.message
        });
    }
};

exports.getCandidateById = async (req, res) => {
    try {
        const candidate = await Candidate.findByPk(req.params.id, {
            include: [{ model: Conversation }]
        });

        if (!candidate) {
            return res.status(404).json({
                success: false,
                message: 'Candidate not found'
            });
        }

        return res.status(200).json({
            success: true,
            data: candidate
        });
    } catch (error) {
        console.error('Error fetching candidate:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to fetch candidate',
            error: error.message
        });
    }
};

exports.updateCandidate = async (req, res) => {
    try {
        const { name, phone, email, current_ctc, expected_ctc, notice_period, experience, status } = req.body;

        const candidate = await Candidate.findByPk(req.params.id);

        if (!candidate) {
            return res.status(404).json({
                success: false,
                message: 'Candidate not found'
            });
        }

        await candidate.update({
            name: name || candidate.name,
            phone: phone || candidate.phone,
            email: email || candidate.email,
            current_ctc: current_ctc || candidate.current_ctc,
            expected_ctc: expected_ctc || candidate.expected_ctc,
            notice_period: notice_period || candidate.notice_period,
            experience: experience || candidate.experience,
            status: status || candidate.status
        });

        return res.status(200).json({
            success: true,
            data: candidate
        });
    } catch (error) {
        console.error('Error updating candidate:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to update candidate',
            error: error.message
        });
    }
};

exports.deleteCandidate = async (req, res) => {
    try {
        const candidate = await Candidate.findByPk(req.params.id);

        if (!candidate) {
            return res.status(404).json({
                success: false,
                message: 'Candidate not found'
            });
        }

        await candidate.destroy();

        return res.status(200).json({
            success: true,
            message: 'Candidate deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting candidate:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to delete candidate',
            error: error.message
        });
    }
};