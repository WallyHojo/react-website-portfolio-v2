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

    const namePattern = /^[a-zA-Z]{2,}$/; // Letters only, at least 2 characters
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Basic email pattern

    if (!namePattern.test(firstName)) {
      setError("First name must be at least 2 letters long and contain only letters.");
      return;
    }
    if (!namePattern.test(lastName)) {
      setError("Last name must be at least 2 letters long and contain only letters.");
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

    emailjs
      .send(serviceID, templateID, templateParams, publicKey)
      .then((response) => {
        console.log("Email sent successfully!", response.status, response.text);
        setSuccess("Email sent successfully!");
        // Clear the form
        setFirstName("");
        setLastName("");
        setEmail("");
        setMessage("");
      })
      .catch((err) => {
        console.error("Failed to send email:", err);
        setError("Failed to send email. Please try again later.");
      });
  };

  return (
    <>
      <p sa="fade glacial mirror delay-400">
        <small>
          Fields marked with (<span className="text-danger">*</span>) are required.
        </small>
      </p>
      <form ref={ref} onSubmit={handleSubmit} sa="left-long glacial mirror">
        <div className="form__group flex-all flex-direction-row flex-wrap">
          <div className="group__field relative">
            <label className="absolute" htmlFor="firstName">
              First Name{" "}
              <small>
                (<span className="text-danger">*</span>)
              </small>
            </label>
            <input value={firstName} onChange={handleChange} type="text" name="firstName" id="firstName" placeholder="First Name *" data-cursor="light" required />
          </div>
          <div className="group__field relative">
            <label className="absolute" htmlFor="lastName">
              Last Name{" "}
              <small>
                (<span className="text-danger">*</span>)
              </small>
            </label>
            <input value={lastName} onChange={handleChange} type="text" name="lastName" id="lastName" placeholder="Last Name *" data-cursor="light" required />
          </div>
        </div>

        <div className="form__group">
          <div className="group__field relative">
            <label className="absolute" htmlFor="email">
              Email{" "}
              <small>
                (<span className="text-danger">*</span>)
              </small>
            </label>
            <input value={email} onChange={handleChange} type="email" name="email" id="email" placeholder="Email *" data-cursor="light" required />
          </div>
        </div>

        <div className="form__group relative">
          <div className="group__field relative">
            <label className="absolute" htmlFor="message">
              Message
            </label>
            <textarea value={message} onChange={handleChange} name="message" rows="5" id="message" placeholder="Your Message" data-cursor="light" />
          </div>
        </div>

        {error && <p style={{ color: "red" }}>{error}</p>}
        {success && <p style={{ color: "green" }}>{success}</p>}

        <Btn type="submit" id="submit" primary className="magnetic magnetic--subtle" data-cursor="accent">Send Message</Btn>
      </form>
    </>
  );
});

export default Form;