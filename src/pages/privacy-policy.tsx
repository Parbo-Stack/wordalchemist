import React from "react";

const PrivacyPolicy = () => {
  return (
    <div className="max-w-3xl mx-auto p-6 text-gray-800">
      <h1 className="text-3xl font-bold mb-4">Privacy Policy</h1>
      <p className="mb-4">**Effective Date:** [Enter Date]</p>

      <h2 className="text-2xl font-semibold mt-4">1. Information We Collect</h2>
      <p className="mb-2"><strong>1.1 Automatically Collected Data</strong></p>
      <ul className="list-disc pl-5 mb-4">
        <li>Your IP address</li>
        <li>Browser type & version</li>
        <li>Pages visited and actions taken</li>
      </ul>

      <p className="mb-2"><strong>1.2 Cookies and Tracking Technologies</strong></p>
      <p className="mb-4">We use cookies to enhance your gaming experience.</p>

      <h2 className="text-2xl font-semibold mt-4">2. How We Use Your Information</h2>
      <p className="mb-4">We may use your data for improving site performance, analyzing traffic, and sending updates.</p>

      <h2 className="text-2xl font-semibold mt-4">3. Third-Party Services</h2>
      <p className="mb-4">
        We may use third-party tools like Google Analytics. Their policies apply.
        <a href="https://policies.google.com/privacy" className="text-blue-600 underline"> Google Analytics Privacy Policy</a>.
      </p>

      <h2 className="text-2xl font-semibold mt-4">4. Contact Us</h2>
      <p>If you have any questions, contact us at <strong>fodeocreate@gmail.com</strong>.</p>
    </div>
  );
};

export default PrivacyPolicy;
