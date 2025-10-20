
import React from 'react';

const ContactPage: React.FC = () => {
  return (
    <div className="max-w-3xl mx-auto py-12 text-center">
      <h1 className="text-4xl font-extrabold text-gray-900">Contact Us</h1>
      <div className="mt-8 prose prose-lg text-gray-700 mx-auto">
        <p>
          Have questions, feedback, or suggestions? We'd love to hear from you! 
        </p>
        <p>
          Please reach out to us at:
        </p>
        <a href="mailto:hello@simplikitt.com" className="text-xl font-semibold text-blue-600 hover:underline">
          hello@simplikitt.com
        </a>
        <p className="mt-4">
          We'll do our best to get back to you as soon as possible.
        </p>
      </div>
    </div>
  );
};

export default ContactPage;