import React, { useEffect } from 'react';

const defaultTitle = 'SimpliKitt - Instant, No-Cost Digital Tools';
const defaultDescription = 'A web-based suite of free, instant, and privacy-first digital tools. All tools run exclusively in your browser, ensuring your data remains private. SimpliKitt offers simple solutions for common digital problems without requiring software installation or account creation.';

const AboutPage: React.FC = () => {
  useEffect(() => {
    const title = 'About SimpliKitt - Our Mission and Privacy-First Philosophy';
    const description = 'Learn about SimpliKitt\'s mission to provide free, private, client-side digital tools. Understand our commitment to your privacy and how our browser-based utilities work.';
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
        <h2 className="text-2xl font-bold mt-8">Our Philosophy: Client-Side by Design</h2>
        <p>
            Many online tools require you to upload your files or data to a remote server for processing. While this is a common approach, it means you lose control over your information as it sits on someone else's computer, even if temporarily. We believe there's a better, more private way.
        </p>
        <p>
            Our philosophy is "client-side by design." This means every tool on SimpliKitt is engineered to run entirely within your own browser on your own computer (the "client"). By leveraging the power of modern web technologies, we bring the processing to you, ensuring your data never needs to be sent across the internet. It's faster, more efficient, and fundamentally more secure. Your privacy isn't an afterthought; it's the foundation of how our tools are built.
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