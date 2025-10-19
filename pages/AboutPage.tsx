
import React from 'react';

const AboutPage: React.FC = () => {
  return (
    <div className="max-w-3xl mx-auto py-12">
      <h1 className="text-4xl font-extrabold text-gray-900 text-center">About SimpliKitt</h1>
      <div className="mt-8 prose prose-lg text-gray-700 mx-auto">
        <p>
          Our mission at SimpliKitt is to provide simple, powerful, and accessible digital tools for everyone—completely free of charge. We believe that solving common digital problems shouldn't require downloading bulky software, creating an account, or worrying about your privacy.
        </p>
        <h2 className="text-2xl font-bold mt-8">Privacy by Design</h2>
        <p>
          We believe in <strong>privacy by design</strong>. All our tools run exclusively in your browser (client-side). This means your files, data, and any information you work with are never uploaded to our servers. Your information stays on your device, period. We do not collect, store, or transmit any of your personal data.
        </p>
        <h2 className="text-2xl font-bold mt-8">Our Commitment</h2>
        <ul>
          <li><strong>Free for Everyone:</strong> All tools are, and will always be, completely free to use.</li>
          <li><strong>Instant Access:</strong> No sign-ups, no installations. Just open your browser and get to work.</li>
          <li><strong>User-Friendly:</strong> We design our tools to be intuitive and easy to use for people of all skill levels.</li>
        </ul>
        <p>
          SimpliKitt was created to be a safe, instant, and user-friendly resource for your everyday digital needs.
        </p>
      </div>
    </div>
  );
};

export default AboutPage;
