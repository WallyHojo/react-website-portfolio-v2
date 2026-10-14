import React, { useState, forwardRef } from "react";
import emailjs from "@emailjs/browser";

import Btn from "../Buttons";

import "./Form.css";

const Form = forwardRef((props, ref) => {
  // Replace with your actual EmailJS user ID from the environment variable
  const serviceID = process.env.REACT_APP_EMAILJS_SERVICE_ID;
  const templateID = process.env.REACT_APP_EMAILJS_TEMPLATE_ID;
  const publicKey = process.env.REACT_APP_EMAILJS_PUBLIC_KEY;

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [sending, setSending] = useState(false);

  // Validate that the environment variables are set
  if (!serviceID || !templateID || !publicKey) {
    return <div style={{ padding: "20px", color: "red" }}>Error: Missing EmailJS credentials. Please check your .env file.</div>;
  }

  const handleChange = (event) => {
    const { name, value } = event.target;

    // Update state based on the field being changed
    if (name === "firstName") setFirstName(value);
    else if (name === "lastName") setLastName(value);
    else if (name === "email") setEmail(value);
    else if (name === "message") setMessage(value);

    // Clear error and success messages on input change
    setError("");
    setSuccess("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Honeypot: real visitors never see or fill the "website" field; bots that
    // auto-fill every input do. Pretend success so they don't retry.
    if (e.currentTarget.elements.website?.value) {
      setSuccess("Email sent successfully!");
      return;
    }

    // Letters (any language), plus spaces, hyphens and apostrophes: O'Brien, Anne-Marie, José
    const namePattern = /^\p{L}[\p{L}\p{M}'’ .-]*\p{L}\.?$/u;
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Basic email pattern

    if (!namePattern.test(firstName.trim())) {
      setError("Please enter your first name (at least 2 letters).");
      return;
    }
    if (!namePattern.test(lastName.trim())) {
      setError("Please enter your last name (at least 2 letters).");
      return;
    }
    if (!emailPattern.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    // Send email using EmailJS
    const templateParams = {
      firstName,
      lastName,
      email,
      message,
    };

    setSending(true);
    emailjs
      .send(serviceID, templateID, templateParams, publicKey)
      .then(() => {
        setSuccess("Email sent successfully!");
        // Clear the form
        setFirstName("");
        setLastName("");
        setEmail("");
        setMessage("");
      })
      .catch(() => {
        setError("Failed to send email. Please try again later.");
      })
      .finally(() => setSending(false));
  };

  return (
    <>
      <p className="text-sm" sa="fade glacial mirror delay-400">Fields marked with (<span className="text-danger">*</span>) are required.</p>
      <form ref={ref} onSubmit={handleSubmit} sa="left-long glacial mirror">
        <div className="form__group flex-all flex-direction-row flex-wrap">
          <div className="group__field relative">
            <label className="absolute text-sm" htmlFor="firstName">
              First Name{" "}
              (<span className="text-danger">*</span>)
            </label>
            <input value={firstName} onChange={handleChange} type="text" name="firstName" id="firstName" placeholder="First Name *" data-cursor="light" required />
          </div>
          <div className="group__field relative">
            <label className="absolute text-sm" htmlFor="lastName">
              Last Name{" "}
              (<span className="text-danger">*</span>)
            </label>
            <input value={lastName} onChange={handleChange} type="text" name="lastName" id="lastName" placeholder="Last Name *" data-cursor="light" required />
          </div>
        </div>

        <div className="form__group">
          <div className="group__field relative">
            <label className="absolute text-sm" htmlFor="email">
              Email{" "}
              (<span className="text-danger">*</span>)
            </label>
            <input value={email} onChange={handleChange} type="email" name="email" id="email" placeholder="Email *" data-cursor="light" required />
          </div>
        </div>

        {/* Spam trap — hidden from people and assistive tech, see handleSubmit */}
        <div className="form__trap" aria-hidden="true">
          <label htmlFor="website">Website</label>
          <input type="text" name="website" id="website" tabIndex={-1} autoComplete="off" />
        </div>

        <div className="form__group relative">
          <div className="group__field relative">
            <label className="absolute text-sm" htmlFor="message">
              Message
            </label>
            <textarea value={message} onChange={handleChange} name="message" rows="4" id="message" placeholder="Your Message" data-cursor="light" />
          </div>
        </div>

        {/* Always mounted so screen readers announce changes */}
        <div aria-live="polite">
          {error && <p className="form__status form__status--error" role="alert">{error}</p>}
          {success && <p className="form__status form__status--success">{success}</p>}
        </div>

        <Btn type="submit" id="submit" primary className="magnetic magnetic--subtle" data-cursor="accent" disabled={sending}>
          {sending ? "Sending…" : "Send Message"}
        </Btn>
      </form>
    </>
  );
});

export default Form;