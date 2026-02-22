import { useRef, useCallback } from 'react';

const SpeechAPI =
  typeof window !== 'undefined' &&
  (window.SpeechRecognition || window.webkitSpeechRecognition);


export function useSpeechInput() {
  const recognitionRef = useRef(null);

  const startListening = useCallback((onResult, onEnd) => {
    if (!SpeechAPI || typeof onResult !== 'function') return;
    const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new Recognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';
    recognition.onresult = (event) => {
      if (event.results && event.results[event.resultIndex]) {
        const transcript = event.results[event.resultIndex][0].transcript.trim();
        onResult(transcript);
      }
    };
    recognition.onerror = (event) => {
      if (event.error === 'not-allowed') {
        alert('Microphone access was denied. You can still type the description.');
      }
    };
    recognition.onend = () => {
      if (typeof onEnd === 'function') {
        onEnd();
      }
    };
    recognitionRef.current = recognition;
    recognition.start();
  }, []);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
  }, []);

  return {
    isSupported: !!SpeechAPI,
    startListening,
    stopListening,
  };
}
