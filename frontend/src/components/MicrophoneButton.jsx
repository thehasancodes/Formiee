import { useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMicrophone, faMicrophoneSlash } from "@fortawesome/free-solid-svg-icons";

const microphoneLabels = {
  en: {
    unsupported: "Voice input is not supported in this browser",
    start: "Start voice input",
    stop: "Stop voice input",
  },
  bn: {
    unsupported: "এই ব্রাউজারে ভয়েস ইনপুট সমর্থিত নয়",
    start: "ভয়েস ইনপুট শুরু করুন",
    stop: "ভয়েস ইনপুট বন্ধ করুন",
  },
  hi: {
    unsupported: "इस ब्राउज़र में वॉइस इनपुट समर्थित नहीं है",
    start: "वॉइस इनपुट शुरू करें",
    stop: "वॉइस इनपुट बंद करें",
  },
};

export default function MicrophoneButton({ language, onTranscript }) {
  const recognitionRef = useRef(null);
  const [isListening, setIsListening] = useState(false);
  const [isSupported] = useState(
    () => Boolean(window.SpeechRecognition || window.webkitSpeechRecognition)
  );
  const labels = microphoneLabels[language.split("-")[0]] || microphoneLabels.en;

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      return undefined;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = false;
    recognition.lang = language;

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
  }, [language, onTranscript]);

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
          ? labels.unsupported
          : isListening
            ? labels.stop
            : labels.start
      }
      title={
        !isSupported
          ? labels.unsupported
          : isListening
            ? labels.stop
            : labels.start
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
