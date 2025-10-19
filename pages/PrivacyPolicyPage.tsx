
import React from 'react';

const PrivacyPolicyPage: React.FC = () => {
  return (
    <div className="max-w-3xl mx-auto py-12">
      <h1 className="text-4xl font-extrabold text-gray-900 text-center">Privacy Policy</h1>
      <div className="mt-8 prose prose-lg text-gray-700 mx-auto">
        <p><strong>Last Updated:</strong> {new Date().toLocaleDateString()}</p>
        
        <p>
          SimpliKitt ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains our principles regarding the information we handle.
        </p>

        <h2 className="text-2xl font-bold mt-8">No Data Collection</h2>
        <p>
          We do not collect, store, sell, or share any personal data or files from our users. Our tools are designed with privacy as the top priority.
        </p>

        <h2 className="text-2xl font-bold mt-8">Client-Side Operations</h2>
        <p>
          All tools available on SimpliKitt operate entirely "client-side," which means all processing is done within your web browser on your own computer. Your files and data are never uploaded to our servers or any third-party service. What happens on your computer stays on your computer.
        </p>
        
        <h2 className="text-2xl font-bold mt-8">Cookies and Analytics</h2>
        <p>
          SimpliKitt does not use cookies for tracking or advertising purposes. We may use privacy-respecting analytics to count website visits, but this information is anonymous and cannot be used to identify individual users.
        </p>
        
        <h2 className="text-2xl font-bold mt-8">Changes to This Policy</h2>
        <p>
          We may update this Privacy Policy from time to time. Any changes will be posted on this page.
        </p>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;
