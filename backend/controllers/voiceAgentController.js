// controllers/voiceAgentController.js
const { Candidate, Job, Appointment, Conversation } = require('../models');
const entityExtractionService = require('../services/entityExtractionService');

exports.startVoiceCall = async (req, res) => {
    try {
        const { candidate_id, job_id } = req.body;

        // Check if candidate and job exist
        const candidate = await Candidate.findByPk(candidate_id);
        const job = await Job.findByPk(job_id);

        if (!candidate || !job) {
            return res.status(404).json({
                success: false,
                message: 'Candidate or Job not found'
            });
        }

        // Create initial conversation record
        const conversation = await Conversation.create({
            candidate_id,
            transcript: `Call initiated for ${candidate.name} regarding ${job.title} position.`,
            entities_extracted: {}
        });

        // In a real scenario, this would initiate a voice call via Twilio or another service
        // For now, we'll simulate the conversation flow

        return res.status(200).json({
            success: true,
            message: 'Voice call initiated',
            data: {
                conversation_id: conversation.id,
                candidate: {
                    id: candidate.id,
                    name: candidate.name,
                    phone: candidate.phone
                },
                job: {
                    id: job.id,
                    title: job.title
                },
                initial_greeting: `Hello ${candidate.name}, this is Company regarding a ${job.title} opportunity.`
            }
        });
    } catch (error) {
        console.error('Error initiating voice call:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to initiate voice call',
            error: error.message
        });
    }
};

exports.processVoiceInput = async (req, res) => {
    try {
        const { conversation_id, user_response, current_question } = req.body;

        // Find conversation
        const conversation = await Conversation.findByPk(conversation_id);
        if (!conversation) {
            return res.status(404).json({
                success: false,
                message: 'Conversation not found'
            });
        }

        // Find candidate
        const candidate = await Candidate.findByPk(conversation.candidate_id);
        if (!candidate) {
            return res.status(404).json({
                success: false,
                message: 'Candidate not found'
            });
        }

        // Update transcript with user response
        let updatedTranscript = conversation.transcript + `\nCandidate: ${user_response}`;

        // Extract entities based on current question
        let extractedEntities = conversation.entities_extracted || {};
        let nextQuestion = '';
        let isComplete = false;

        switch (current_question) {
            case 'interest':
                if (entityExtractionService.extractBoolean(user_response)) {
                    extractedEntities.interested = true;
                    nextQuestion = 'notice_period';
                    updatedTranscript += '\nSystem: What is your current notice period?';
                } else {
                    extractedEntities.interested = false;
                    isComplete = true;
                    updatedTranscript += '\nSystem: Thank you for your time. We\'ll keep your profile for future opportunities.';
                }
                break;

            case 'notice_period':
                const noticePeriod = entityExtractionService.extractDuration(user_response);
                if (noticePeriod) {
                    extractedEntities.notice_period = noticePeriod;
                    nextQuestion = 'ctc';
                    updatedTranscript += '\nSystem: Can you share your current and expected CTC?';

                    // Update candidate record
                    await candidate.update({ notice_period: noticePeriod });
                } else {
                    nextQuestion = 'notice_period_retry';
                    updatedTranscript += '\nSystem: Could you please specify your notice period in days or months?';
                }
                break;

            case 'notice_period_retry':
                const noticePeriodRetry = entityExtractionService.extractDuration(user_response);
                if (noticePeriodRetry) {
                    extractedEntities.notice_period = noticePeriodRetry;
                    nextQuestion = 'ctc';
                    updatedTranscript += '\nSystem: Can you share your current and expected CTC?';

                    // Update candidate record
                    await candidate.update({ notice_period: noticePeriodRetry });
                } else {
                    nextQuestion = 'ctc'; // Move on anyway
                    updatedTranscript += '\nSystem: Let\'s move on. Can you share your current and expected CTC?';
                }
                break;

            case 'ctc':
                const { current, expected } = entityExtractionService.extractCTC(user_response);
                if (current && expected) {
                    extractedEntities.current_ctc = current;
                    extractedEntities.expected_ctc = expected;
                    nextQuestion = 'availability';
                    updatedTranscript += '\nSystem: When are you available for an interview next week?';

                    // Update candidate record
                    await candidate.update({
                        current_ctc: current,
                        expected_ctc: expected
                    });
                } else {
                    nextQuestion = 'ctc_retry';
                    updatedTranscript += '\nSystem: Could you please specify both your current and expected CTC?';
                }
                break;

            case 'ctc_retry':
                const ctcRetry = entityExtractionService.extractCTC(user_response);
                if (ctcRetry.current && ctcRetry.expected) {
                    extractedEntities.current_ctc = ctcRetry.current;
                    extractedEntities.expected_ctc = ctcRetry.expected;
                    nextQuestion = 'availability';
                    updatedTranscript += '\nSystem: When are you available for an interview next week?';

                    // Update candidate record
                    await candidate.update({
                        current_ctc: ctcRetry.current,
                        expected_ctc: ctcRetry.expected
                    });
                } else {
                    nextQuestion = 'availability'; // Move on anyway
                    updatedTranscript += '\nSystem: Let\'s move on. When are you available for an interview next week?';
                }
                break;

            case 'availability':
                // Get available slots for the job
                const job = await Job.findOne({
                    include: [{
                        model: Appointment,
                        where: { candidate_id: candidate.id },
                        required: false
                    }]
                });

                if (!job || !job.available_slots || job.available_slots.length === 0) {
                    nextQuestion = 'no_slots';
                    updatedTranscript += '\nSystem: I\'m sorry, but there are no available slots at the moment. We\'ll contact you soon to schedule an interview.';
                    isComplete = true;
                    break;
                }

                const availableDate = entityExtractionService.extractDate(user_response);
                if (availableDate) {
                    // Find the closest available slot to the requested date
                    const closestSlot = entityExtractionService.findClosestSlot(availableDate, job.available_slots);

                    if (closestSlot) {
                        extractedEntities.interview_slot = closestSlot;
                        nextQuestion = 'confirm_slot';
                        updatedTranscript += `\nSystem: We've scheduled your interview on ${new Date(closestSlot).toLocaleString()}. Is that correct?`;
                    } else {
                        nextQuestion = 'alternative_slots';
                        const alternatives = job.available_slots.slice(0, 3).map(slot =>
                            new Date(slot).toLocaleString()
                        ).join(', ');
                        updatedTranscript += `\nSystem: I'm sorry, that time isn't available. We have these slots: ${alternatives}. Which one works for you?`;
                    }
                } else {
                    nextQuestion = 'availability_retry';
                    updatedTranscript += '\nSystem: Could you please provide a specific date and time?';
                }
                break;

            case 'availability_retry':
            case 'alternative_slots':
                const retryDate = entityExtractionService.extractDate(user_response);
                const job2 = await Job.findOne({
                    where: { id: job.id }
                });

                if (retryDate && job2 && job2.available_slots) {
                    // Find the closest available slot to the requested date
                    const closestSlot = entityExtractionService.findClosestSlot(retryDate, job2.available_slots);

                    if (closestSlot) {
                        extractedEntities.interview_slot = closestSlot;
                        nextQuestion = 'confirm_slot';
                        updatedTranscript += `\nSystem: We've scheduled your interview on ${new Date(closestSlot).toLocaleString()}. Is that correct?`;
                    } else {
                        isComplete = true;
                        updatedTranscript += '\nSystem: I\'m sorry, but we couldn\'t find a suitable slot. Our team will contact you soon to schedule an interview.';
                    }
                } else {
                    isComplete = true;
                    updatedTranscript += '\nSystem: I\'m sorry, but we couldn\'t schedule an interview at this time. Our team will contact you soon.';
                }
                break;

            case 'confirm_slot':
                if (entityExtractionService.extractBoolean(user_response)) {
                    // Create appointment
                    const jobId = job ? job.id : null;

                    if (jobId && extractedEntities.interview_slot) {
                        await Appointment.create({
                            job_id: jobId,
                            candidate_id: candidate.id,
                            date_time: extractedEntities.interview_slot
                        });

                        // Update candidate status
                        await candidate.update({ status: 'scheduled' });

                        isComplete = true;
                        updatedTranscript += '\nSystem: Great! Your interview has been scheduled. You will receive a confirmation email shortly. Thank you for your time.';
                    } else {
                        isComplete = true;
                        updatedTranscript += '\nSystem: I apologize, but there was an issue with scheduling. Our team will contact you to confirm the interview.';
                    }
                } else {
                    nextQuestion = 'availability';
                    updatedTranscript += '\nSystem: Let\'s try again. When are you available for an interview next week?';
                }
                break;

            default:
                nextQuestion = 'interest';
                updatedTranscript += '\nSystem: Are you interested in this role?';
        }

        // Update conversation
        await conversation.update({
            transcript: updatedTranscript,
            entities_extracted: extractedEntities
        });

        return res.status(200).json({
            success: true,
            data: {
                conversation_id: conversation.id,
                next_question: isComplete ? null : nextQuestion,
                system_response: updatedTranscript.split('\n').pop().replace('System: ', ''),
                is_complete: isComplete,
                extracted_entities: extractedEntities
            }
        });
    } catch (error) {
        console.error('Error processing voice input:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to process voice input',
            error: error.message
        });
    }
};