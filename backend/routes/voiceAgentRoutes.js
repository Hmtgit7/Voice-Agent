// routes/voiceAgentRoutes.js
const express = require('express');
const router = express.Router();
const voiceAgentController = require('../controllers/voiceAgentController');

router.post('/call', voiceAgentController.startVoiceCall);
router.post('/process', voiceAgentController.processVoiceInput);

module.exports = router;