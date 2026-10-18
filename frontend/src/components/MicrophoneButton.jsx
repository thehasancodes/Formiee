import { useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMicrophone, faMicrophoneSlash } from "@fortawesome/free-solid-svg-icons";

export default function MicrophoneButton({ onTranscript }) {
  const recognitionRef = useRef(null);
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(true);

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setIsSupported(false);
      return undefined;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = false;
    recognition.lang = "en-US";

    recognition.onresult = (event) => {
      const transcript = Array.from(event.results)
        .slice(event.resultIndex)
        .map((result) => result[0].transcript)
        .join(" ");

      if (transcript.trim()) {
        onTranscript(transcript.trim());
      }
    };

    recognition.onend = () => setIsListening(false);
    recognition.onerror = () => setIsListening(false);
    recognitionRef.current = recognition;

    return () => {
      recognition.abort();
      recognitionRef.current = null;
    };
  }, [onTranscript]);

  const toggleListening = () => {
    if (!isSupported) {
      return;
    }

    if (isListening) {
      recognitionRef.current?.stop();
      return;
    }

    recognitionRef.current?.start();
    setIsListening(true);
  };

  return (
    <button
      type="button"
      className={`microphone-button ${isListening ? "is-listening" : ""}`}
      aria-label={
        !isSupported
          ? "Voice input is not supported in this browser"
          : isListening
            ? "Stop voice input"
            : "Start voice input"
      }
      title={
        !isSupported
          ? "Voice input is not supported in this browser"
          : isListening
            ? "Stop voice input"
            : "Start voice input"
      }
      disabled={!isSupported}
      onClick={toggleListening}
    >
      <FontAwesomeIcon
        icon={isListening ? faMicrophoneSlash : faMicrophone}
        aria-hidden="true"
      />
    </button>
  );
}
