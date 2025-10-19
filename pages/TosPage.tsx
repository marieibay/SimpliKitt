
import React from 'react';

const TosPage: React.FC = () => {
  return (
    <div className="max-w-3xl mx-auto py-12">
      <h1 className="text-4xl font-extrabold text-gray-900 text-center">Terms of Service</h1>
      <div className="mt-8 prose prose-lg text-gray-700 mx-auto">
        <p><strong>Last Updated:</strong> {new Date().toLocaleDateString()}</p>

        <p>
          By accessing and using SimpliKitt (the "Website"), you agree to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms, please do not use our services.
        </p>

        <h2 className="text-2xl font-bold mt-8">Use of Tools</h2>
        <p>
          All tools provided on SimpliKitt are free for personal and commercial use. You agree to use our tools responsibly and not for any illegal or malicious purposes.
        </p>
        
        <h2 className="text-2xl font-bold mt-8">Disclaimer of Warranties</h2>
        <p>
          The tools and services on this Website are provided "as is" and "as available" without any warranties of any kind, either express or implied. We do not guarantee that the services will be error-free, uninterrupted, or that the results obtained from their use will be accurate or reliable.
        </p>
        
        <h2 className="text-2xl font-bold mt-8">Limitation of Liability</h2>
        <p>
          In no event shall SimpliKitt be liable for any direct, indirect, incidental, special, or consequential damages arising out of or in connection with the use or inability to use our services. You are solely responsible for your data and any files you process using our tools.
        </p>

        <h2 className="text-2xl font-bold mt-8">Changes to These Terms</h2>
        <p>
          We reserve the right to modify these Terms at any time. We will post the most current version of these Terms on the Website. Your continued use of the services after any changes constitutes your acceptance of the new Terms.
        </p>
      </div>
    </div>
  );
};

export default TosPage;
