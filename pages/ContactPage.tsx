import React, { useEffect } from 'react';

const defaultTitle = 'SimpliKitt - Instant, No-Cost Digital Tools';
const defaultDescription = 'A web-based suite of free, instant, and privacy-first digital tools. All tools run exclusively in your browser, ensuring your data remains private. SimpliKitt offers simple solutions for common digital problems without requiring software installation or account creation.';

const ContactPage: React.FC = () => {
  useEffect(() => {
    const title = 'Contact SimpliKitt';
    const description = 'Get in touch with the SimpliKitt team. Send us your questions, feedback, or suggestions via email.';
    document.title = title;
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', description);
    }
    
    return () => {
      document.title = defaultTitle;
      const metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription) {
        metaDescription.setAttribute('content', defaultDescription);
      }
    };
  }, []);

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