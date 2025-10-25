import React, { useEffect } from 'react';
import { updateMetaTags, resetMetaTags } from '../utils/meta';

const PrivacyPolicyPage: React.FC = () => {
  useEffect(() => {
    const title = 'Privacy Policy - SimpliKitt';
    const description = 'Read the SimpliKitt privacy policy. Learn how we handle your data (or rather, how we don\'t) with our client-side tools.';
    updateMetaTags(title, description);
    
    return () => {
      resetMetaTags();
    };
  }, []);

  return (
    <div className="max-w-3xl mx-auto py-12">
      <h1 className="text-4xl font-extrabold text-gray-900 text-center">Privacy Policy</h1>
      <div className="mt-8 prose prose-lg text-gray-700 mx-auto">
        <h2 className="text-2xl font-bold">Introduction</h2>
        <p>
          SimpliKitt (“we”, “our”, “us”) is committed to protecting your privacy. This Privacy Policy explains how information is handled when you use our website. Because all of our tools run client-side, directly in your browser, our data handling practices are minimal.
        </p>

        <hr className="my-8" />

        <h2 className="text-2xl font-bold">Information We Don’t Collect</h2>
        <p>
          All SimpliKitt tools process data entirely within your web browser. That means:
        </p>
        <ul className="list-disc list-outside pl-8">
            <li><strong>We do not</strong> collect, store, or transmit any data you enter into our tools.</li>
            <li><strong>We do not</strong> collect, store, or transmit any files you upload.</li>
            <li><strong>We do not have</strong> access to your results, outputs, or processed files.</li>
        </ul>
        <p>
            All operations happen locally on your device — your data never leaves your browser or reaches our servers.
        </p>

        <hr className="my-8" />

        <h2 className="text-2xl font-bold">Information We May Collect</h2>
        <p>
            We use Google Analytics to collect <strong>anonymous usage data</strong> to help us understand how our tools are used and improve them over time. This may include:
        </p>
        <ul className="list-disc list-outside pl-8">
            <li>Pages visited on our site</li>
            <li>Time spent on each page</li>
            <li>Browser type, operating system, and screen resolution</li>
            <li>General (non-identifiable) geographic data such as city or country</li>
        </ul>
        <p>
            This information is <strong>aggregated and anonymized</strong>. It cannot be used to identify you personally. We do not track individual users or collect any personal identifiers.
        </p>
        <p>
            To learn how Google collects and processes analytics data, you can review <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Google’s Privacy Policy</a>.
        </p>

        <hr className="my-8" />

        <h2 className="text-2xl font-bold">Cookies</h2>
        <p>
            Our website uses cookies solely for Google Analytics. Cookies are small text files that help us understand website traffic patterns. You can disable cookies in your browser settings at any time — our tools will still function normally.
        </p>

        <hr className="my-8" />

        <h2 className="text-2xl font-bold">Third-Party Links</h2>
        <p>
            Our site may contain links to external websites. We are not responsible for the privacy practices of those sites. We encourage users to review the privacy statements of any website they visit that collects personally identifiable information.
        </p>

        <hr className="my-8" />

        <h2 className="text-2xl font-bold">Policy Updates</h2>
        <p>
            We may update this Privacy Policy periodically. Updates will be posted on this page, and the “Last Updated” date will reflect the most recent version. We encourage you to review this page occasionally to stay informed.
        </p>

        <hr className="my-8" />

        <h2 className="text-2xl font-bold">Contact Us</h2>
        <p>
            If you have any questions about this Privacy Policy or how we handle data, contact us at <a href="mailto:hello@simplikitt.com" className="text-blue-600 hover:underline">hello@simplikitt.com</a>.
        </p>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;