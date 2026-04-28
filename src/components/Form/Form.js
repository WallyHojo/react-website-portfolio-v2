import React, { useRef, useState } from "react";
import emailjs from '@emailjs/browser';
import "./Form.css";

const Form = () => {
    // Replace with your actual EmailJS user ID from the environment variable
    const serviceID = process.env.REACT_APP_EMAILJS_SERVICE_ID;
    const templateID = process.env.REACT_APP_EMAILJS_TEMPLATE_ID;
    const publicKey = process.env.REACT_APP_EMAILJS_PUBLIC_KEY;
    
    const form = useRef();
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // Validate that the environment variables are set
    if (!serviceID || !templateID || !publicKey) {
        return (
            <div style={{ padding: '20px', color: 'red' }}>
                Error: Missing EmailJS credentials. Please check your .env file.
            </div>
        );
    }

    const handleChange = (event) => {
        const { name, value } = event.target;

        // Update state based on the field being changed
        if (name === 'firstName') setFirstName(value);
        else if (name === 'lastName') setLastName(value);
        else if (name === 'email') setEmail(value);
        else if (name === 'message') setMessage(value);

        // Clear error and success messages on input change
        setError('');
        setSuccess('');
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const namePattern = /^[a-zA-Z]{2,}$/; // Letters only, at least 2 characters
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Basic email pattern

        if (!namePattern.test(firstName)) {
            setError('First name must be at least 2 letters long and contain only letters.');
            return;
        }
        if (!namePattern.test(lastName)) {
            setError('Last name must be at least 2 letters long and contain only letters.');
            return;
        }
        if (!emailPattern.test(email)) {
            setError('Please enter a valid email address.');
            return;
        }

        // Send email using EmailJS
        const templateParams = {
            firstName,
            lastName,
            email,
            message,
        };

        emailjs.send(serviceID, templateID, templateParams, publicKey)
            .then((response) => {
                console.log('Email sent successfully!', response.status, response.text);
                setSuccess('Email sent successfully!');
                // Clear the form
                setFirstName('');
                setLastName('');
                setEmail('');
                setMessage('');
            })
            .catch((err) => {
                console.error('Failed to send email:', err);
                setError('Failed to send email. Please try again later.');
            });
    }; 

    return (
        <>
        <div className='contact__form'>
            <p><small>Fields marked with (<span className='text-danger'>*</span>) are required.</small></p>
            <form ref={form} onSubmit={handleSubmit} id='contact'>
                <div className='form__group flex-all flex-direction-row flex-wrap'>
                    <div className='group__field'>
                        <label htmlFor='firstName'>First Name <small>(<span className='text-danger'>*</span>)</small></label>
                        <input value={firstName} onChange={handleChange} type='text' name='firstName' id='firstName' placeholder='First Name *' required />
                    </div>
                    <div className='group__field'>
                        <label htmlFor='lastName'>Last Name <small>(<span className='text-danger'>*</span>)</small></label>
                        <input value={lastName} onChange={handleChange} type='text' name='lastName' id='lastName' placeholder='Last Name *' required />
                    </div>
                </div>

                <div className='form__group'>
                    <label htmlFor='email'>Email <small>(<span className='text-danger'>*</span>)</small></label>
                    <input value={email} onChange={handleChange} type='email' name='email' id='email' placeholder='Email *' required />
                </div>

                <div className='form__group'>
                    <label htmlFor='message'>Message</label>
                    <textarea value={message} onChange={handleChange} name='message' rows='5' id='message' placeholder='Your Message' />
                </div>

                {error && <p style={{ color: 'red' }}>{error}</p>}
                {success && <p style={{ color: 'green' }}>{success}</p>}

                <button type='submit' id='submit' className='btn btn-primary' data-cursor='light'>
                    <span className='btn__text'>Get in Touch</span>
                    <span className='btn__arrow'>
                        <svg xmlns='http://www.w3.org/2000/svg' width='15' height='16' viewBox='0 0 15 16' fill='none'>
                        <g clipPath='url(#clip0_388_188)'>
                            <path
                            d='M12.6346 2H5.3634C5.2665 2 5.17356 2.0417 5.10503 2.11593C5.03651 2.19017 4.99801 2.29085 4.99801 2.39582C4.99801 2.5008 5.03651 2.60148 5.10503 2.67571C5.17356 2.74995 5.2665 2.79165 5.3634 2.79165H11.7545L1.10661 14.3269C1.07281 14.3635 1.046 14.407 1.02771 14.4548C1.00941 14.5027 1 14.5539 1 14.6057C1 14.6575 1.00941 14.7088 1.02771 14.7566C1.046 14.8044 1.07281 14.8479 1.10661 14.8845C1.14041 14.9211 1.18053 14.9502 1.22469 14.97C1.26885 14.9898 1.31619 15 1.36398 15C1.41178 15 1.45911 14.9898 1.50328 14.97C1.54744 14.9502 1.58756 14.9211 1.62136 14.8845L12.2692 3.34855V10.2726C12.2692 10.3776 12.3077 10.4782 12.3762 10.5525C12.4448 10.6267 12.5377 10.6684 12.6346 10.6684C12.7315 10.6684 12.8245 10.6267 12.893 10.5525C12.9615 10.4782 13 10.3776 13 10.2726V2.39438C12.9993 2.28977 12.9605 2.18968 12.8921 2.11584C12.8237 2.042 12.7312 2.00038 12.6346 2Z'
                            fill='var(--color-text-primary)'
                            />
                        </g>

                        <defs>
                            <clipPath id='clip0_388_188'>
                            <rect width='15' height='16' fill='white' />
                            </clipPath>
                        </defs>
                        </svg>
                    </span>
                </button>                
            </form>  
        </div>    
        </>
    )
}

export default Form;