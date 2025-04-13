// src/hooks/useWebSpeech.js
import { useState, useEffect, useCallback, useRef } from 'react';

export const useWebSpeech = () => {
    const [isListening, setIsListening] = useState(false);
    const [transcript, setTranscript] = useState('');
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [voices, setVoices] = useState([]);
    const [error, setError] = useState(null);

    const recognitionRef = useRef(null);
    const synthesisRef = useRef(window.speechSynthesis);

    // Check if browser supports web speech API
    const isSpeechRecognitionSupported = 'SpeechRecognition' in window || 'webkitSpeechRecognition' in window;
    const isSpeechSynthesisSupported = 'speechSynthesis' in window;

    // Initialize speech recognition
    useEffect(() => {
        if (!isSpeechRecognitionSupported) {
            setError('Speech recognition is not supported in this browser.');
            return;
        }

        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        recognitionRef.current = new SpeechRecognition();

        recognitionRef.current.continuous = false;
        recognitionRef.current.interimResults = false;
        recognitionRef.current.lang = 'en-US';

        recognitionRef.current.onstart = () => {
            setIsListening(true);
        };

        recognitionRef.current.onend = () => {
            setIsListening(false);
        };

        recognitionRef.current.onresult = (event) => {
            const result = event.results[0][0].transcript;
            setTranscript(result);
        };

        recognitionRef.current.onerror = (event) => {
            console.error('Speech recognition error', event.error);
            setError(`Speech recognition error: ${event.error}`);
            setIsListening(false);
        };

        return () => {
            if (recognitionRef.current) {
                recognitionRef.current.stop();
            }
        };
    }, [isSpeechRecognitionSupported]);

    // Initialize speech synthesis and get available voices
    useEffect(() => {
        if (!isSpeechSynthesisSupported) {
            setError('Speech synthesis is not supported in this browser.');
            return;
        }

        const handleVoicesChanged = () => {
            const availableVoices = synthesisRef.current.getVoices();
            setVoices(availableVoices);
        };

        handleVoicesChanged(); // Get voices on first load

        synthesisRef.current.onvoiceschanged = handleVoicesChanged;

        return () => {
            if (synthesisRef.current) {
                synthesisRef.current.cancel();
            }
        };
    }, [isSpeechSynthesisSupported]);

    // Start listening function
    const startListening = useCallback(() => {
        if (!isSpeechRecognitionSupported) {
            setError('Speech recognition is not supported in this browser.');
            return;
        }

        setTranscript('');
        setError(null);

        try {
            recognitionRef.current.start();
        } catch (err) {
            console.error('Speech recognition error', err);
            setError(`Speech recognition error: ${err.message}`);
        }
    }, [isSpeechRecognitionSupported]);

    // Stop listening function
    const stopListening = useCallback(() => {
        if (!isSpeechRecognitionSupported || !recognitionRef.current) {
            return;
        }

        try {
            recognitionRef.current.stop();
        } catch (err) {
            console.error('Speech recognition error', err);
            setError(`Speech recognition error: ${err.message}`);
        }
    }, [isSpeechRecognitionSupported]);

    // Speak text function
    const speak = useCallback(
        (text, voiceIndex = 0, rate = 1, pitch = 1) => {
            if (!isSpeechSynthesisSupported) {
                setError('Speech synthesis is not supported in this browser.');
                return;
            }

            if (isSpeaking) {
                synthesisRef.current.cancel();
            }

            const utterance = new SpeechSynthesisUtterance(text);

            // Set voice if available
            if (voices.length > 0) {
                utterance.voice = voices[voiceIndex];
            }

            utterance.rate = rate;
            utterance.pitch = pitch;

            utterance.onstart = () => {
                setIsSpeaking(true);
            };

            utterance.onend = () => {
                setIsSpeaking(false);
            };

            utterance.onerror = (event) => {
                console.error('Speech synthesis error', event);
                setError(`Speech synthesis error: ${event.error}`);
                setIsSpeaking(false);
            };

            synthesisRef.current.speak(utterance);
        },
        [isSpeechSynthesisSupported, isSpeaking, voices]
    );

    // Cancel speaking
    const cancelSpeech = useCallback(() => {
        if (!isSpeechSynthesisSupported) {
            return;
        }

        synthesisRef.current.cancel();
        setIsSpeaking(false);
    }, [isSpeechSynthesisSupported]);

    return {
        isListening,
        isSpeaking,
        transcript,
        voices,
        error,
        startListening,
        stopListening,
        speak,
        cancelSpeech,
        isSpeechRecognitionSupported,
        isSpeechSynthesisSupported,
    };
};

export default useWebSpeech;