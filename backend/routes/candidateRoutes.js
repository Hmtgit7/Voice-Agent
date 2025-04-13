// routes/candidateRoutes.js
const express = require('express');
const router = express.Router();
const candidateController = require('../controllers/candidateController');

router.post('/', candidateController.createCandidate);
router.get('/', candidateController.getAllCandidates);
router.get('/:id', candidateController.getCandidateById);
router.put('/:id', candidateController.updateCandidate);
router.delete('/:id', candidateController.deleteCandidate);

module.exports = router;