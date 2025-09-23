import { useState, useEffect } from "react";

export default function useSpeechToText() {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");

  // Create SpeechRecognition instance
  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;

  const recognition = SpeechRecognition ? new SpeechRecognition() : null;

  useEffect(() => {
    if (!recognition) {
      alert("Speech recognition is not supported in this browser.");
      return;
    }

    recognition.continuous = false; // Stop after user finishes speaking
    recognition.interimResults = false; // Don't show partial words
    recognition.lang = "en-IN"; // Indian English

    recognition.onresult = (event) => {
      const speechResult = event.results[0][0].transcript;
      setTranscript(speechResult);
      setIsListening(false);
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
      setIsListening(false);
    };
  }, []);

  const startListening = () => {
    if (!recognition) return;
    setTranscript("");
    setIsListening(true);
    recognition.start();
  };

  return { transcript, isListening, startListening };
}
