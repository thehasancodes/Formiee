import { useCallback, useState } from "react";
import MicrophoneButton from "./MicrophoneButton";

const translations = {
  en: {
    eyebrow: "GET IN TOUCH",
    title: "Contact Us",
    description: "Send us a message and we will get back to you.",
    voiceInput: "Voice input",
    change: "Change",
    firstName: "First Name",
    lastName: "Last Name",
    email: "Email Address",
    phone: "Phone Number",
    message: "Your Message",
    firstNamePlaceholder: "John",
    lastNamePlaceholder: "Doe",
    messagePlaceholder: "Write your message here",
    missingFirstName: "Please provide your first name.",
    missingLastName: "Please provide your last name.",
    missingEmail: "Please provide your email address.",
    invalidEmail: "Please provide a valid email address.",
    missingPhone: "Please provide your phone number.",
    missingMessage: "Please enter your message.",
    sending: "Sending...",
    submit: "Send Message",
    waiting: "Please wait...",
    sent: "Message sent successfully!",
    failed: "Failed to send message.",
    error: "Something went wrong!",
    english: "English",
    bengali: "Bengali",
    hindi: "Hindi",
  },
  bn: {
    eyebrow: "যোগাযোগ করুন",
    title: "আমাদের সাথে যোগাযোগ করুন",
    description: "আমাদের একটি বার্তা পাঠান, আমরা আপনার সাথে যোগাযোগ করব।",
    voiceInput: "ভয়েস ইনপুট",
    change: "পরিবর্তন করুন",
    firstName: "নামের প্রথম অংশ",
    lastName: "নামের শেষ অংশ",
    email: "ইমেইল ঠিকানা",
    phone: "ফোন নম্বর",
    message: "আপনার বার্তা",
    firstNamePlaceholder: "আপনার নামের প্রথম অংশ",
    lastNamePlaceholder: "আপনার নামের শেষ অংশ",
    messagePlaceholder: "এখানে আপনার বার্তা লিখুন",
    missingFirstName: "আপনার নামের প্রথম অংশ লিখুন।",
    missingLastName: "আপনার নামের শেষ অংশ লিখুন।",
    missingEmail: "আপনার ইমেইল ঠিকানা লিখুন।",
    invalidEmail: "সঠিক ইমেইল ঠিকানা লিখুন।",
    missingPhone: "আপনার ফোন নম্বর লিখুন।",
    missingMessage: "আপনার বার্তা লিখুন।",
    sending: "পাঠানো হচ্ছে...",
    submit: "বার্তা পাঠান",
    waiting: "অনুগ্রহ করে অপেক্ষা করুন...",
    sent: "বার্তা সফলভাবে পাঠানো হয়েছে!",
    failed: "বার্তা পাঠানো যায়নি।",
    error: "একটি সমস্যা হয়েছে!",
    english: "ইংরেজি",
    bengali: "বাংলা",
    hindi: "হিন্দি",
  },
  hi: {
    eyebrow: "संपर्क करें",
    title: "हमसे संपर्क करें",
    description: "हमें संदेश भेजें, हम आपसे जल्द संपर्क करेंगे।",
    voiceInput: "वॉइस इनपुट",
    change: "बदलें",
    firstName: "पहला नाम",
    lastName: "उपनाम",
    email: "ईमेल पता",
    phone: "फ़ोन नंबर",
    message: "आपका संदेश",
    firstNamePlaceholder: "आपका पहला नाम",
    lastNamePlaceholder: "आपका उपनाम",
    messagePlaceholder: "यहाँ अपना संदेश लिखें",
    missingFirstName: "कृपया अपना पहला नाम लिखें।",
    missingLastName: "कृपया अपना उपनाम लिखें।",
    missingEmail: "कृपया अपना ईमेल पता लिखें।",
    invalidEmail: "कृपया मान्य ईमेल पता लिखें।",
    missingPhone: "कृपया अपना फ़ोन नंबर लिखें।",
    missingMessage: "कृपया अपना संदेश लिखें।",
    sending: "भेजा जा रहा है...",
    submit: "संदेश भेजें",
    waiting: "कृपया प्रतीक्षा करें...",
    sent: "संदेश सफलतापूर्वक भेजा गया!",
    failed: "संदेश नहीं भेजा जा सका।",
    error: "कुछ गड़बड़ हो गई!",
    english: "अंग्रेज़ी",
    bengali: "बंगाली",
    hindi: "हिंदी",
  },
};

export default function ContactForm({ language, languageName, onChangeLanguage }) {
  const copy = translations[language.split("-")[0]] || translations.en;
  const localizedLanguageName = {
    English: copy.english,
    Bengali: copy.bengali,
    Hindi: copy.hindi,
  }[languageName] || languageName;
  const fieldLabel = (english, translated) =>
    language.startsWith("en") ? english : `${english} / ${translated}`;
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    message: "",
  });

  const [wasValidated, setWasValidated] = useState(false);
  const [status, setStatus] = useState({
    message: "",
    type: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleTranscript = useCallback((transcript) => {
    setFormData((prev) => ({
      ...prev,
      message: prev.message ? `${prev.message} ${transcript}` : transcript,
    }));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setWasValidated(true);

    if (!e.currentTarget.checkValidity()) {
      return;
    }

    setIsSubmitting(true);
    setStatus({ message: copy.waiting, type: "loading" });

    try {
      const response = await fetch(
        "https://api.web3forms.com/submit",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            access_key: import.meta.env.VITE_WEB3FORMS_ACCESS_KEY,
            ...formData,
          }),
        }
      );

      const result = await response.json();

      if (response.ok && result.success) {
        setStatus({
          message: result.message || copy.sent,
          type: "success",
        });

        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
          message: "",
        });

        setWasValidated(false);
      } else {
        setStatus({
          message: result.message || copy.failed,
          type: "error",
        });
      }
    } catch (error) {
      console.error(error);

      setStatus({
        message: copy.error,
        type: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const fieldClass = (name) => {
    const valid =
      name === "email"
        ? /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)
        : formData[name].trim().length > 0;

    const empty = !formData[name].trim();

    return `form-input ${wasValidated && (!valid || empty) ? "is-invalid" : ""}`;
  };

  return (
    <section className="contact-page" lang={language}>
      <div className="contact-card">
        <MicrophoneButton language={language} onTranscript={handleTranscript} />

        <header className="contact-header">
          <span className="contact-eyebrow">{copy.eyebrow}</span>
          <h1>{copy.title}</h1>

          <p>
            {copy.description}
          </p>
          <button
            className="language-change-button"
            type="button"
            onClick={onChangeLanguage}
          >
            {copy.voiceInput}: {localizedLanguageName}{" "}
            <span aria-hidden="true">· {copy.change}</span>
          </button>
        </header>

        <form
          noValidate
          onSubmit={handleSubmit}
          className={`contact-form ${wasValidated ? "was-validated" : ""}`}
        >
          <div className="form-row">
            <div className="form-field">
              <label htmlFor="firstName" className="form-label">
                {fieldLabel("First Name", copy.firstName)}
              </label>

              <input
                type="text"
                name="firstName"
                id="firstName"
                placeholder={copy.firstNamePlaceholder}
                required
                value={formData.firstName}
                onChange={handleChange}
                className={fieldClass("firstName")}
              />

              {wasValidated && !formData.firstName.trim() && (
                <p className="empty-feedback">{copy.missingFirstName}</p>
              )}
            </div>

            <div className="form-field">
              <label htmlFor="lastName" className="form-label">
                {fieldLabel("Last Name", copy.lastName)}
              </label>

              <input
                type="text"
                name="lastName"
                id="lastName"
                placeholder={copy.lastNamePlaceholder}
                required
                value={formData.lastName}
                onChange={handleChange}
                className={fieldClass("lastName")}
              />

              {wasValidated && !formData.lastName.trim() && (
                <p className="empty-feedback">{copy.missingLastName}</p>
              )}
            </div>
          </div>

          <div className="form-row">
            <div className="form-field">
              <label
                htmlFor="email"
                className="form-label"
              >
                {fieldLabel("Email Address", copy.email)}
              </label>

              <input
                type="email"
                name="email"
                id="email"
                placeholder="you@company.com"
                required
                value={formData.email}
                onChange={handleChange}
                className={fieldClass("email")}
              />

              {wasValidated && !formData.email.trim() && (
                <p className="empty-feedback">
                  {copy.missingEmail}
                </p>
              )}

              {wasValidated &&
                formData.email.trim() &&
                !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email) && (
                  <p className="invalid-feedback">
                    {copy.invalidEmail}
                  </p>
                )}
            </div>

            <div className="form-field">
              <label
                htmlFor="phone"
                className="form-label"
              >
                {fieldLabel("Phone Number", copy.phone)}
              </label>

              <input
                type="tel"
                name="phone"
                id="phone"
                placeholder="+91 9876543210"
                required
                value={formData.phone}
                onChange={handleChange}
                className={fieldClass("phone")}
              />

              {wasValidated && !formData.phone.trim() && (
                <p className="empty-feedback">{copy.missingPhone}</p>
              )}
            </div>
          </div>

          <div className="form-field">
            <label
              htmlFor="message"
              className="form-label"
            >
              {fieldLabel("Message", copy.message)}
            </label>

            <textarea
              rows={5}
              name="message"
              id="message"
              placeholder={copy.messagePlaceholder}
              required
              value={formData.message}
              onChange={handleChange}
              className={`${fieldClass("message")} form-textarea`}
            />

            {wasValidated && !formData.message.trim() && (
              <p className="empty-feedback">
                {copy.missingMessage}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="submit-button"
          >
            {isSubmitting ? copy.sending : copy.submit}
          </button>

          {status.message && (
            <p
              role="status"
              aria-live="polite"
              className={`form-status ${status.type}`}
            >
              {status.message}
            </p>
          )}
        </form>
      </div>
    </section>
  );
}