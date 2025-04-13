// src/components/voiceAgent/VoiceSimulator.js
import React, { useState, useEffect } from 'react';
import { MicrophoneIcon, SpeakerWaveIcon, StopIcon } from '@heroicons/react/24/outline';
import Button from '../common/Button';
import Card from '../common/Card';
import Select from '../common/Select';
import { useWebSpeech } from '../../hooks/useWebSpeech';

const VoiceSimulator = ({
  onSpeechRecognized,
  systemMessage,
  onSimulationStart,
  onSimulationEnd,
  isProcessing = false,
  disabled = false,
}) => {
  const {
    isListening,
    isSpeaking,
    transcript,
    voices,
    startListening,
    stopListening,
    speak,
    cancelSpeech,
    isSpeechRecognitionSupported,
    isSpeechSynthesisSupported,
  } = useWebSpeech();
  
  const [selectedVoice, setSelectedVoice] = useState(0);
  const [isSimulating, setIsSimulating] = useState(false);
  
  // Speak system message when it changes
  useEffect(() => {
    if (systemMessage && isSpeechSynthesisSupported && isSimulating) {
      speak(systemMessage, selectedVoice);
    }
  }, [systemMessage, isSpeechSynthesisSupported, isSimulating]);
  
  // Send transcript to parent component when speech is recognized
  useEffect(() => {
    if (transcript && !isListening && isSimulating) {
      onSpeechRecognized(transcript);
    }
  }, [transcript, isListening, onSpeechRecognized, isSimulating]);
  
  // Start simulation
  const startSimulation = () => {
    setIsSimulating(true);
    onSimulationStart();
    
    // Speak initial system message
    if (systemMessage && isSpeechSynthesisSupported) {
      speak(systemMessage, selectedVoice);
    }
  };
  
  // End simulation
  const endSimulation = () => {
    setIsSimulating(false);
    onSimulationEnd();
    
    // Stop any ongoing speech or listening
    if (isListening) {
      stopListening();
    }
    
    if (isSpeaking) {
      cancelSpeech();
    }
  };
  
  // Start listening
  const handleStartListening = () => {
    startListening();
  };
  
  // Stop listening
  const handleStopListening = () => {
    stopListening();
  };
  
  // Handle voice change
  const handleVoiceChange = (e) => {
    setSelectedVoice(parseInt(e.target.value, 10));
  };
  
  // Create voice options for select input
  const voiceOptions = voices.map((voice, index) => ({
    value: index.toString(),
    label: `${voice.name} (${voice.lang})`,
  }));
  
  // Check if browser supports speech APIs
  const isSpeechSupported = isSpeechRecognitionSupported && isSpeechSynthesisSupported;
  
  if (!isSpeechSupported) {
    return (
      <Card className="text-center py-8">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
          Speech API Not Supported
        </h3>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          Your browser does not support the Web Speech API. Please try a different browser,
          such as Google Chrome or Microsoft Edge.
        </p>
      </Card>
    );
  }
  
  return (
    <Card>
      <div className="flex flex-col items-center">
        {!isSimulating ? (
          <>
            <div className="mb-6 w-full max-w-md">
              <Select
                id="voice-select"
                name="voice"
                label="Select Voice"
                value={selectedVoice.toString()}
                onChange={handleVoiceChange}
                options={voiceOptions}
                disabled={isSimulating || disabled}
              />
            </div>
            
            <Button
              onClick={startSimulation}
              icon={<SpeakerWaveIcon className="h-5 w-5" />}
              disabled={disabled}
            >
              Start Voice Simulation
            </Button>
          </>
        ) : (
          <>
            <div className="voice-wave my-6">
              {Array(6).fill(0).map((_, i) => (
                <div 
                  key={i} 
                  className="bar"
                  style={{ 
                    height: (isListening || isSpeaking) ? `${10 + Math.random() * 30}px` : '5px',
                    animationPlayState: (isListening || isSpeaking) ? 'running' : 'paused'
                  }}
                ></div>
              ))}
            </div>
            
            <div className="text-center mb-6">
              {isSpeaking ? (
                <p className="text-primary-600 dark:text-primary-400">
                  System is speaking...
                </p>
              ) : isListening ? (
                <p className="text-secondary-600 dark:text-secondary-400">
                  Listening...
                </p>
              ) : isProcessing ? (
                <p className="text-warning-600 dark:text-warning-400">
                  Processing your response...
                </p>
              ) : (
                <p className="text-gray-600 dark:text-gray-400">
                  Click the microphone to speak
                </p>
              )}
            </div>
            
            <div className="flex space-x-4">
              <Button
                onClick={handleStartListening}
                variant="secondary"
                size="lg"
                className="rounded-full p-4"
                icon={<MicrophoneIcon className="h-6 w-6" />}
                disabled={isListening || isSpeaking || isProcessing || disabled}
              />
              
              <Button
                onClick={endSimulation}
                variant="danger"
                size="lg"
                className="rounded-full p-4"
                icon={<StopIcon className="h-6 w-6" />}
                disabled={disabled}
              >
                End Simulation
              </Button>
            </div>
            
            {transcript && (
              <div className="mt-6 text-center">
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Your last response:
                </h4>
                <p className="mt-1 text-gray-900 dark:text-white font-medium">
                  "{transcript}"
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </Card>
  );
};

export default VoiceSimulator;