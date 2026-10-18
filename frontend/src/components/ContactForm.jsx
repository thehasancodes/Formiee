import { useCallback, useState } from "react";
import MicrophoneButton from "./MicrophoneButton";

export default function ContactForm() {
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
    setStatus({ message: "Please wait...", type: "loading" });

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
          message: result.message || "Message sent successfully!",
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
          message: result.message || "Failed to send message.",
          type: "error",
        });
      }
    } catch (error) {
      console.error(error);

      setStatus({
        message: "Something went wrong!",
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
    <section className="contact-page">
      <div className="contact-card">
        <MicrophoneButton onTranscript={handleTranscript} />

        <header className="contact-header">
          <span className="contact-eyebrow">GET IN TOUCH</span>
          <h1>Contact Us</h1>

          <p>
          Send us a message and we will get back to you.
          </p>
        </header>

        <form
          noValidate
          onSubmit={handleSubmit}
          className={`contact-form ${wasValidated ? "was-validated" : ""}`}
        >
          <div className="form-row">
            <div className="form-field">
              <label htmlFor="firstName" className="form-label">
                First Name
              </label>

              <input
                type="text"
                name="firstName"
                id="firstName"
                placeholder="John"
                required
                value={formData.firstName}
                onChange={handleChange}
                className={fieldClass("firstName")}
              />

              {wasValidated && !formData.firstName.trim() && (
                <p className="empty-feedback">Please provide your first name.</p>
              )}
            </div>

            <div className="form-field">
              <label htmlFor="lastName" className="form-label">
                Last Name
              </label>

              <input
                type="text"
                name="lastName"
                id="lastName"
                placeholder="Doe"
                required
                value={formData.lastName}
                onChange={handleChange}
                className={fieldClass("lastName")}
              />

              {wasValidated && !formData.lastName.trim() && (
                <p className="empty-feedback">Please provide your last name.</p>
              )}
            </div>
          </div>

          <div className="form-row">
            <div className="form-field">
              <label
                htmlFor="email"
                className="form-label"
              >
                Email Address
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
                  Please provide your email address.
                </p>
              )}

              {wasValidated &&
                formData.email.trim() &&
                !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email) && (
                  <p className="invalid-feedback">
                    Please provide a valid email address.
                  </p>
                )}
            </div>

            <div className="form-field">
              <label
                htmlFor="phone"
                className="form-label"
              >
                Phone Number
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
                <p className="empty-feedback">
                  Please provide your phone number.
                </p>
              )}
            </div>
          </div>

          <div className="form-field">
            <label
              htmlFor="message"
              className="form-label"
            >
              Your Message
            </label>

            <textarea
              rows={5}
              name="message"
              id="message"
              placeholder="Your Message"
              required
              value={formData.message}
              onChange={handleChange}
              className={`${fieldClass("message")} form-textarea`}
            />

            {wasValidated && !formData.message.trim() && (
              <p className="empty-feedback">
                Please enter your message.
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="submit-button"
          >
            {isSubmitting ? "Sending..." : "Send Message"}
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