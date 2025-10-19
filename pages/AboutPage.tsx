import React from 'react';

const AboutPage: React.FC = () => {
  return (
    <div className="max-w-3xl mx-auto py-12">
      <h1 className="text-4xl font-extrabold text-gray-900 text-center">About SimpliKitt</h1>
       <p className="mt-4 text-center text-lg text-gray-600">Instant, no-cost digital tools for everyday problems.</p>
      <div className="mt-8 prose prose-lg text-gray-700 mx-auto">
        <h2 className="text-2xl font-bold mt-8">Our Mission</h2>
        <p>
         In a world filled with complex software and subscriptions, SimpliKitt was created with a simple goal: to provide fast, free, and easy-to-use tools that solve common digital tasks. We believe that you shouldn't have to download an application, sign up for a service, or worry about your privacy just to perform a simple conversion, calculation, or text manipulation.
        </p>
        <h2 className="text-2xl font-bold mt-8">Privacy First</h2>
        <p>
          Our core principle is privacy. All tools on SimpliKitt run entirely in your web browser. This means any data you input or files you upload are processed on your own device. Nothing is ever sent to our servers. Your work remains your own, from start to finish. We don't see it, we don't store it, we don't want it.
        </p>
         <h2 className="text-2xl font-bold mt-8">How It Works</h2>
        <p>
          We leverage the power of modern web technologies like JavaScript and WebAssembly to build powerful tools that work offline and directly in your browser. This client-side approach not only protects your privacy but also makes our tools incredibly fast, as there's no waiting for server uploads or processing.
        </p>
        <h2 className="text-2xl font-bold mt-8">Our Promise</h2>
        <ul>
          <li><strong>Free to Use:</strong> Our core tools will always be free.</li>
          <li><strong>Privacy-Focused:</strong> We will never upload or store your data.</li>
          <li><strong>No Sign-ups:</strong> Use our tools instantly, no account required.</li>
          <li><strong>Fast & Simple:</strong> Designed for speed and ease of use.</li>
        </ul>
      </div>
    </div>
  );
};

export default AboutPage;
