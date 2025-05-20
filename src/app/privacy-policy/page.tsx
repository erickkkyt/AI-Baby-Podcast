import React from 'react';
import Link from 'next/link';

export default function PrivacyPolicyPage() {
  return (
    <div className="container mx-auto px-4 py-8 text-gray-800 dark:text-gray-200">
      <header className="mb-8 text-center">
        <h1 className="text-4xl font-bold text-blue-600 dark:text-blue-400">Privacy Policy</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">Last updated: May 20, 2025</p>
      </header>

      <section className="mb-8 p-6 bg-white dark:bg-gray-800 shadow-lg rounded-lg">
        <p className="mb-4">
          Welcome to <strong>AI Baby Podcast</strong>. Your privacy is of utmost importance to us. This Privacy Policy outlines how we collect, use, store, and protect your personal information when you use our services. By using our product, you consent to the collection and use of information in accordance with this policy.
        </p>
      </section>

      <section className="mb-8 p-6 bg-white dark:bg-gray-800 shadow-lg rounded-lg">
        <h2 className="text-2xl font-semibold mb-4 text-blue-500 dark:text-blue-300">1. Information We Collect</h2>
        <p className="mb-4">
          We collect different types of information to provide, improve, and personalize your experience with our service. This includes:
        </p>
        <h3 className="text-xl font-medium mb-2 text-gray-700 dark:text-gray-300">Personal Information</h3>
        <ul className="list-disc list-inside mb-4 space-y-2 pl-4">
          <li>
            <strong>Account Information</strong>: When you create an account, we collect information such as your name, email address, and profile details.
          </li>
          <li>
            <strong>Payment Information</strong>: If you make a purchase or subscribe to a paid plan, we collect billing information, such as credit card numbers or other payment methods.
          </li>
        </ul>
        <h3 className="text-xl font-medium mb-2 text-gray-700 dark:text-gray-300">Usage Data</h3>
        <p className="mb-4">
          We collect information about how you use our service, including interaction data, pages viewed, time spent, and features used. This data helps us understand how our service is used and where we can improve.
        </p>
        <h3 className="text-xl font-medium mb-2 text-gray-700 dark:text-gray-300">Device and Technical Information</h3>
        <ul className="list-disc list-inside mb-4 space-y-2 pl-4">
          <li>
            Information about the device you use to access our service (e.g., device type, operating system, browser type, IP address).
          </li>
          <li>
            Cookies and similar technologies: We may use cookies, web beacons, and other tracking technologies to enhance your experience and analyze site traffic. You can control cookie settings through your browser.
          </li>
        </ul>
      </section>

      <section className="mb-8 p-6 bg-white dark:bg-gray-800 shadow-lg rounded-lg">
        <h2 className="text-2xl font-semibold mb-4 text-blue-500 dark:text-blue-300">2. How We Use Your Information</h2>
        <p className="mb-4">
          We use the information we collect for the following purposes:
        </p>
        <ul className="list-disc list-inside space-y-2 pl-4">
          <li>
            <strong>To Provide and Improve Our Services</strong>: We use your data to deliver the features and functionality of the product, improve performance, and troubleshoot issues.
          </li>
          <li>
            <strong>To Communicate with You</strong>: We may send you service-related emails, notifications, or marketing communications if you have opted into them.
          </li>
          <li>
            <strong>To Process Payments</strong>: If applicable, we use payment information to process transactions and provide billing support.
          </li>
          <li>
            <strong>For Legal and Security Purposes</strong>: We may use your information to comply with legal obligations or protect our users and services from fraudulent activity.
          </li>
        </ul>
      </section>

      <section className="mb-8 p-6 bg-white dark:bg-gray-800 shadow-lg rounded-lg">
        <h2 className="text-2xl font-semibold mb-4 text-blue-500 dark:text-blue-300">3. Sharing Your Information</h2>
        <p className="mb-4">
          We may share your information with the following entities:
        </p>
        <ul className="list-disc list-inside space-y-2 pl-4">
          <li>
            <strong>Third-Party Service Providers</strong>: We use third-party companies to support our business, such as payment processors, analytics services, and cloud storage providers. These partners are required to keep your information confidential and only use it to provide services to us.
          </li>
          <li>
            <strong>Legal Compliance</strong>: We may disclose your information if required by law or to comply with legal processes, such as subpoenas or court orders.
          </li>
          <li>
            <strong>Business Transfers</strong>: In the event of a merger, acquisition, or sale of all or part of our assets, your personal information may be transferred.
          </li>
        </ul>
      </section>

      <section className="mb-8 p-6 bg-white dark:bg-gray-800 shadow-lg rounded-lg">
        <h2 className="text-2xl font-semibold mb-4 text-blue-500 dark:text-blue-300">4. Data Security</h2>
        <p className="mb-4">
          We take the security of your personal information seriously. We implement appropriate technical and organizational measures to protect your data from unauthorized access, disclosure, alteration, or destruction. However, no method of transmission over the internet or electronic storage is 100% secure, and we cannot guarantee absolute security.
        </p>
        <p>
          You acknowledge and authorize that, in order to enhance your user experience in using our product, we and our affiliated companies may use the input collected through your usage of our product and the corresponding output for the optimization of the products and services under this policy, provided that such information is processed with secure encryption technology and de-identified or anonymized. If you refuse to provide the foregoing authorization, you may provide feedback to us in accordance with Article 10 of this policy, and we will take effective measures to protect your legitimate rights and interests on the basis of fully respecting your opinions, but this may affect your use of some functions of our product.
        </p>
      </section>

      <section className="mb-8 p-6 bg-white dark:bg-gray-800 shadow-lg rounded-lg">
        <h2 className="text-2xl font-semibold mb-4 text-blue-500 dark:text-blue-300">5. International Data Transfers</h2>
        <p>
          Our service may involve the transfer of your personal data to countries outside your own, including to the United States or other locations where our servers or third-party service providers are based. By using our service, you consent to the transfer of your information across borders.
        </p>
      </section>

      <section className="mb-8 p-6 bg-white dark:bg-gray-800 shadow-lg rounded-lg">
        <h2 className="text-2xl font-semibold mb-4 text-blue-500 dark:text-blue-300">6. Your Rights and Choices</h2>
        <p className="mb-4">
          Depending on your location, you may have the following rights concerning your personal information:
        </p>
        <ul className="list-disc list-inside space-y-2 pl-4">
          <li>
            <strong>Access and Correction</strong>: You can request access to the personal information we hold about you and request corrections if the information is inaccurate or incomplete.
          </li>
          <li>
            <strong>Data Deletion</strong>: You can request that we delete your personal information, subject to legal and contractual obligations.
          </li>
          <li>
            <strong>Opt-Out of Marketing</strong>: You can opt-out of receiving marketing emails or notifications at any time by following the unsubscribe instructions provided in the communication.
          </li>
          <li>
            <strong>Data Portability</strong>: You may request a copy of your personal data in a structured, commonly used format.
          </li>
        </ul>
        <p className="mt-4">
          If you wish to exercise any of these rights or have questions about how we handle your data, please contact us at <a href="mailto:m15905196940@163.com" className="text-blue-600 hover:underline dark:text-blue-400">m15905196940@163.com</a>.
        </p>
      </section>

      <section className="mb-8 p-6 bg-white dark:bg-gray-800 shadow-lg rounded-lg">
        <h2 className="text-2xl font-semibold mb-4 text-blue-500 dark:text-blue-300">7. Retention of Data</h2>
        <p>
          We retain your personal information for as long as necessary to fulfill the purposes outlined in this Privacy Policy, or as required by law. When your data is no longer needed, we will securely delete it.
        </p>
      </section>

      <section className="mb-8 p-6 bg-white dark:bg-gray-800 shadow-lg rounded-lg">
        <h2 className="text-2xl font-semibold mb-4 text-blue-500 dark:text-blue-300">8. Cookies and Tracking Technologies</h2>
        <p className="mb-4">
          We use cookies, web beacons, and similar technologies to enhance your experience. These technologies help us:
        </p>
        <ul className="list-disc list-inside space-y-2 pl-4">
          <li>Analyze user activity</li>
          <li>Personalize content and ads</li>
          <li>Monitor site traffic and usage</li>
        </ul>
        <p className="mt-4">
          You can control cookies through your browser settings. For more information on how we use cookies, please refer to our <strong>Cookie Policy</strong> (Note: You may need to create a separate Cookie Policy page or section).
        </p>
      </section>

      <section className="mb-8 p-6 bg-white dark:bg-gray-800 shadow-lg rounded-lg">
        <h2 className="text-2xl font-semibold mb-4 text-blue-500 dark:text-blue-300">9. Changes to This Privacy Policy</h2>
        <p>
          We may update our Privacy Policy from time to time. Any changes will be posted on this page, with an updated &quot;Last updated&quot; date. We encourage you to review this policy periodically to stay informed about how we are protecting your data.
        </p>
      </section>

      <section className="p-6 bg-white dark:bg-gray-800 shadow-lg rounded-lg">
        <h2 className="text-2xl font-semibold mb-4 text-blue-500 dark:text-blue-300">10. Contact Us</h2>
        <p>
          If you have any questions or concerns about this Privacy Policy or our data practices, please contact us at:
        </p>
        <p className="mt-2">
          <strong>Email</strong>: <a href="mailto:m15905196940@163.com" className="text-blue-600 hover:underline dark:text-blue-400">m15905196940@163.com</a>
        </p>
      </section>
    </div>
  );
} 