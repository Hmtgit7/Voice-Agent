// services/dialogueService.js
/**
 * This service handles dialogue management using intent recognition
 * In a production environment, you would integrate with Rasa or Mycroft Adapt
 */
const natural = require('natural');
const tokenizer = new natural.WordTokenizer();

class DialogueService {
    constructor() {
        // Initialize intent recognizers
        this.initializeClassifiers();
    }

    initializeClassifiers() {
        // In a real implementation, you would load Rasa or Mycroft Adapt models
        // For now, we'll use a simple classifier based on natural.js
        this.classifier = new natural.BayesClassifier();

        // Train with some sample phrases
        // Interest in job
        this.classifier.addDocument('yes I am interested', 'affirm_interest');
        this.classifier.addDocument('yes', 'affirm_interest');
        this.classifier.addDocument('sure', 'affirm_interest');
        this.classifier.addDocument('definitely', 'affirm_interest');
        this.classifier.addDocument('I would like to apply', 'affirm_interest');

        this.classifier.addDocument('no', 'deny_interest');
        this.classifier.addDocument('not interested', 'deny_interest');
        this.classifier.addDocument('I pass', 'deny_interest');
        this.classifier.addDocument('not at this time', 'deny_interest');

        // Notice period
        this.classifier.addDocument('30 days', 'notice_period');
        this.classifier.addDocument('1 month', 'notice_period');
        this.classifier.addDocument('2 months', 'notice_period');
        this.classifier.addDocument('60 days', 'notice_period');
        this.classifier.addDocument('my notice period is', 'notice_period');

        // CTC
        this.classifier.addDocument('my current salary', 'ctc');
        this.classifier.addDocument('I earn', 'ctc');
        this.classifier.addDocument('my ctc', 'ctc');
        this.classifier.addDocument('I am expecting', 'ctc');
        this.classifier.addDocument('current CTC is', 'ctc');
        this.classifier.addDocument('expected CTC is', 'ctc');

        // Availability
        this.classifier.addDocument('I am available on', 'availability');
        this.classifier.addDocument('I can interview on', 'availability');
        this.classifier.addDocument('next Monday', 'availability');
        this.classifier.addDocument('Tuesday at 2pm', 'availability');
        this.classifier.addDocument('Wednesday afternoon', 'availability');

        // Confirmation
        this.classifier.addDocument('that works', 'confirm');
        this.classifier.addDocument('yes that time is good', 'confirm');
        this.classifier.addDocument('confirmed', 'confirm');
        this.classifier.addDocument('sure', 'confirm');

        this.classifier.addDocument('no that doesn\'t work', 'deny');
        this.classifier.addDocument('I need a different time', 'deny');
        this.classifier.addDocument('not available then', 'deny');

        // Train the classifier
        this.classifier.train();
    }

    /**
     * Process user input and determine intent
     * @param {string} userInput - The user's input text
     * @returns {Object} - Object containing intent and confidence
     */
    processInput(userInput) {
        const classification = this.classifier.getClassifications(userInput);
        const topIntent = classification[0];

        return {
            intent: topIntent.label,
            confidence: topIntent.value,
            allIntents: classification
        };
    }

    /**
     * Get next question based on current state
     * @param {string} currentState - The current conversation state
     * @param {Object} entities - Extracted entities
     * @returns {string} - The next question to ask
     */
    getNextQuestion(currentState, entities = {}) {
        switch (currentState) {
            case 'initial':
                return "Are you interested in this role?";

            case 'interest_confirmed':
                return "What is your current notice period?";

            case 'notice_period_provided':
                return "Can you share your current and expected CTC?";

            case 'ctc_provided':
                return "When are you available for an interview next week?";

            case 'availability_provided':
                const dateTime = entities.interview_slot ?
                    new Date(entities.interview_slot).toLocaleString() :
                    "the selected time";

                return `We've scheduled your interview on ${dateTime}. Is that correct?`;

            case 'appointment_confirmed':
                return "Great! Your interview has been scheduled. You will receive a confirmation email shortly. Thank you for your time.";

            default:
                return "Is there anything else you'd like to know about the role?";
        }
    }
}

module.exports = new DialogueService();