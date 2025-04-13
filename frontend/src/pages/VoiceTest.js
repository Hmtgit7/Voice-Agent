// src/pages/VoiceTest.js
import React, { useState, useEffect } from 'react';
import { UserGroupIcon, BriefcaseIcon } from '@heroicons/react/24/outline';
import VoiceSimulator from '../components/voiceAgent/VoiceSimulator';
import ConversationDisplay from '../components/voiceAgent/ConversationDisplay';
import EntityDisplay from '../components/voiceAgent/EntityDisplay';
import Card from '../components/common/Card';
import Select from '../components/common/Select';
import Spinner from '../components/common/Spinner';
import { useToast } from '../contexts/ToastContext';
import jobService from '../services/jobService';
import candidateService from '../services/candidateService';
import voiceAgentService from '../services/voiceAgentService';

const VoiceTest = () => {
    const { showToast } = useToast();

    // Loading states
    const [loading, setLoading] = useState(true);
    const [isProcessing, setIsProcessing] = useState(false);

    // Data states
    const [jobs, setJobs] = useState([]);
    const [candidates, setCandidates] = useState([]);
    const [selectedJob, setSelectedJob] = useState('');
    const [selectedCandidate, setSelectedCandidate] = useState('');

    // Conversation states
    const [conversationId, setConversationId] = useState(null);
    const [conversation, setConversation] = useState([]);
    const [currentQuestion, setCurrentQuestion] = useState('');
    const [systemMessage, setSystemMessage] = useState('');
    const [extractedEntities, setExtractedEntities] = useState({});
    const [isSimulating, setIsSimulating] = useState(false);

    // Fetch jobs and candidates when component mounts
    useEffect(() => {
        fetchInitialData();
    }, []);

    // Fetch jobs and candidates
    const fetchInitialData = async () => {
        try {
            setLoading(true);

            // Fetch jobs
            const jobsResponse = await jobService.getAllJobs();
            setJobs(jobsResponse.data || []);

            // Fetch candidates
            const candidatesResponse = await candidateService.getAllCandidates();
            setCandidates(candidatesResponse.data || []);
        } catch (error) {
            console.error('Error fetching initial data:', error);
            showToast('Failed to fetch jobs and candidates', 'error');
        } finally {
            setLoading(false);
        }
    };

    // Start voice simulation
    const startSimulation = async () => {
        if (!selectedJob || !selectedCandidate) {
            showToast('Please select a job and a candidate first', 'warning');
            return;
        }

        try {
            setIsProcessing(true);

            // Start the voice call
            const response = await voiceAgentService.startVoiceCall({
                job_id: selectedJob,
                candidate_id: selectedCandidate,
            });

            // Set conversation ID
            setConversationId(response.data.conversation_id);

            // Add initial greeting to conversation
            setConversation([
                {
                    type: 'system',
                    text: response.data.initial_greeting,
                },
            ]);

            // Set system message for speech
            setSystemMessage(response.data.initial_greeting);

            // Set current question
            setCurrentQuestion('interest');

            // Set simulation state
            setIsSimulating(true);
        } catch (error) {
            console.error('Error starting voice simulation:', error);
            showToast('Failed to start voice simulation', 'error');
        } finally {
            setIsProcessing(false);
        }
    };

    // End voice simulation
    const endSimulation = () => {
        setIsSimulating(false);
        setConversationId(null);
        setCurrentQuestion('');
        setSystemMessage('');
    };

    // Process user's speech
    const processUserSpeech = async (transcript) => {
        if (!conversationId || !currentQuestion) return;

        try {
            setIsProcessing(true);

            // Add user's speech to conversation
            setConversation((prevConversation) => [
                ...prevConversation,
                {
                    type: 'user',
                    text: transcript,
                },
            ]);

            // Process the voice input
            const response = await voiceAgentService.processVoiceInput({
                conversation_id: conversationId,
                user_response: transcript,
                current_question: currentQuestion,
            });

            // Add system response to conversation
            setConversation((prevConversation) => [
                ...prevConversation,
                {
                    type: 'system',
                    text: response.data.system_response,
                },
            ]);

            // Set system message for speech
            setSystemMessage(response.data.system_response);

            // Update current question
            setCurrentQuestion(response.data.next_question);

            // Update extracted entities
            setExtractedEntities(response.data.extracted_entities);

            // Check if conversation is complete
            if (response.data.is_complete) {
                showToast('Conversation complete!', 'success');
                setTimeout(() => {
                    endSimulation();
                }, 5000); // End simulation after 5 seconds
            }
        } catch (error) {
            console.error('Error processing voice input:', error);
            showToast('Failed to process voice input', 'error');
        } finally {
            setIsProcessing(false);
        }
    };

    // Handle job selection
    const handleJobChange = (e) => {
        setSelectedJob(e.target.value);
    };

    // Handle candidate selection
    const handleCandidateChange = (e) => {
        setSelectedCandidate(e.target.value);
    };

    // Job options for select input
    const jobOptions = [
        { value: '', label: 'Select a job', disabled: true },
        ...jobs.map((job) => ({
            value: job.id,
            label: job.title,
        })),
    ];

    // Candidate options for select input
    const candidateOptions = [
        { value: '', label: 'Select a candidate', disabled: true },
        ...candidates.map((candidate) => ({
            value: candidate.id,
            label: candidate.name,
        })),
    ];

    // If data is loading, show spinner
    if (loading) {
        return (
            <div className="flex justify-center items-center py-12">
                <Spinner size="lg" />
            </div>
        );
    }

    return (
        <div>
            <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Voice Agent Testing</h1>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                    Test the voice agent by simulating a call with a candidate
                </p>
            </div>

            <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1 space-y-6">
                    {/* Selection Controls */}
                    {!isSimulating && (
                        <Card title="Select Job and Candidate">
                            <div className="space-y-4">
                                <Select
                                    id="job-select"
                                    name="job"
                                    label="Select Job"
                                    value={selectedJob}
                                    onChange={handleJobChange}
                                    options={jobOptions}
                                    leftIcon={<BriefcaseIcon className="h-5 w-5 text-gray-400" />}
                                    disabled={isSimulating}
                                />

                                <Select
                                    id="candidate-select"
                                    name="candidate"
                                    label="Select Candidate"
                                    value={selectedCandidate}
                                    onChange={handleCandidateChange}
                                    options={candidateOptions}
                                    leftIcon={<UserGroupIcon className="h-5 w-5 text-gray-400" />}
                                    disabled={isSimulating}
                                />
                            </div>
                        </Card>
                    )}

                    {/* Voice Simulator */}
                    <VoiceSimulator
                        onSpeechRecognized={processUserSpeech}
                        systemMessage={systemMessage}
                        onSimulationStart={startSimulation}
                        onSimulationEnd={endSimulation}
                        isProcessing={isProcessing}
                        disabled={loading || (!isSimulating && (!selectedJob || !selectedCandidate))}
                    />

                    {/* Extracted Entities */}
                    <EntityDisplay
                        entities={extractedEntities}
                        loading={isProcessing}
                    />
                </div>

                <div className="lg:col-span-2">
                    {/* Conversation History */}
                    <ConversationDisplay
                        conversation={conversation}
                        loading={isProcessing}
                    />
                </div>
            </div>
        </div>
    );
};

export default VoiceTest;