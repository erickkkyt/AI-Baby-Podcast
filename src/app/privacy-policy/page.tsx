import Link from 'next/link';

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-[#0d1117] text-gray-300 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-[#161b22] p-6 sm:p-8 rounded-lg shadow-lg">
        <header className="mb-8 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold text-white">Privacy Policy</h1>
          <p className="text-sm text-gray-400 mt-2">Last Updated: {new Date().toLocaleDateString()}</p>
        </header>

        <article className="prose prose-invert prose-sm sm:prose-base max-w-none space-y-6">
          <p>
            AI Baby Podcast ("us", "we", or "our") operates the AI Baby Podcast website and related services (the "Service"). This page informs you of our policies regarding the collection, use, and disclosure of personal data when you use our Service and the choices you have associated with that data.
          </p>

          <section>
            <h2 className="text-xl sm:text-2xl font-semibold text-white">1. Information Collection and Use</h2>
            <p>
              We collect several different types of information for various purposes to provide and improve our Service to you.
            </p>
            <h3 className="text-lg sm:text-xl font-medium text-white mt-4">Types of Data Collected</h3>
            <h4 className="text-md sm:text-lg font-normal text-gray-200 mt-2">Personal Data</h4>
            <p>
              While using our Service, we may ask you to provide us with certain personally identifiable information that can be used to contact or identify you ("Personal Data"). Personally identifiable information may include, but is not limited to:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Email address</li>
              <li>First name and last name (optional)</li>
              <li>Usage Data</li>
              <li>Cookies and Tracking Technologies</li>
            </ul>
            <h4 className="text-md sm:text-lg font-normal text-gray-200 mt-3">Usage Data</h4>
            <p>
              We may also collect information on how the Service is accessed and used ("Usage Data"). This Usage Data may include information such as your computer's Internet Protocol address (e.g. IP address), browser type, browser version, the pages of our Service that you visit, the time and date of your visit, the time spent on those pages, unique device identifiers and other diagnostic data.
            </p>
            <h4 className="text-md sm:text-lg font-normal text-gray-200 mt-3">Tracking & Cookies Data</h4>
            <p>
              We use cookies and similar tracking technologies to track the activity on our Service and we hold certain information. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, if you do not accept cookies, you may not be able to use some portions of our Service.
            </p>
          </section>

          <section>
            <h2 className="text-xl sm:text-2xl font-semibold text-white">2. Use of Data</h2>
            <p>
              AI Baby Podcast uses the collected data for various purposes:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>To provide and maintain our Service</li>
              <li>To notify you about changes to our Service</li>
              <li>To allow you to participate in interactive features of our Service when you choose to do so</li>
              <li>To provide customer support</li>
              <li>To gather analysis or valuable information so that we can improve our Service</li>
              <li>To monitor the usage of our Service</li>
              <li>To detect, prevent and address technical issues</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl sm:text-2xl font-semibold text-white">3. Data Retention</h2>
            <p>
              We will retain your Personal Data only for as long as is necessary for the purposes set out in this Privacy Policy. We will retain and use your Personal Data to the extent necessary to comply with our legal obligations (for example, if we are required to retain your data to comply with applicable laws), resolve disputes, and enforce our legal agreements and policies.
            </p>
          </section>
          
          <section>
            <h2 className="text-xl sm:text-2xl font-semibold text-white">4. Data Transfer</h2>
            <p>
             Your information, including Personal Data, may be transferred to — and maintained on — computers located outside of your state, province, country or other governmental jurisdiction where the data protection laws may differ than those from your jurisdiction.
            </p>
             <p>If you are located outside [Your Company's Country of Operation] and choose to provide information to us, please note that we transfer the data, including Personal Data, to [Your Company's Country of Operation] and process it there. Your consent to this Privacy Policy followed by your submission of such information represents your agreement to that transfer.</p>
          </section>

          <section>
            <h2 className="text-xl sm:text-2xl font-semibold text-white">5. Disclosure of Data</h2>
            <h3 className="text-lg sm:text-xl font-medium text-white mt-4">Legal Requirements</h3>
            <p>
              AI Baby Podcast may disclose your Personal Data in the good faith belief that such action is necessary to:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>To comply with a legal obligation</li>
              <li>To protect and defend the rights or property of AI Baby Podcast</li>
              <li>To prevent or investigate possible wrongdoing in connection with the Service</li>
              <li>To protect the personal safety of users of the Service or the public</li>
              <li>To protect against legal liability</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl sm:text-2xl font-semibold text-white">6. Security of Data</h2>
            <p>
              The security of your data is important to us but remember that no method of transmission over the Internet or method of electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your Personal Data, we cannot guarantee its absolute security.
            </p>
          </section>

          <section>
            <h2 className="text-xl sm:text-2xl font-semibold text-white">7. Your Data Protection Rights</h2>
            <p>
             Depending on your location, you may have certain data protection rights. AI Baby Podcast aims to take reasonable steps to allow you to correct, amend, delete, or limit the use of your Personal Data. If you wish to be informed what Personal Data we hold about you and if you want it to be removed from our systems, please contact us. 
            </p>
             <p>Please note that we may ask you to verify your identity before responding to such requests.</p>
          </section>
          
          <section>
            <h2 className="text-xl sm:text-2xl font-semibold text-white">8. Service Providers</h2>
            <p>
                We may employ third party companies and individuals to facilitate our Service ("Service Providers"), to provide the Service on our behalf, to perform Service-related services or to assist us in analyzing how our Service is used. These third parties have access to your Personal Data only to perform these tasks on our behalf and are obligated not to disclose or use it for any other purpose.
            </p>
          </section>

          <section>
            <h2 className="text-xl sm:text-2xl font-semibold text-white">9. Links to Other Sites</h2>
            <p>
              Our Service may contain links to other sites that are not operated by us. If you click a third party link, you will be directed to that third party's site. We strongly advise you to review the Privacy Policy of every site you visit. We have no control over and assume no responsibility for the content, privacy policies or practices of any third party sites or services.
            </p>
          </section>

          <section>
            <h2 className="text-xl sm:text-2xl font-semibold text-white">10. Children's Privacy</h2>
            <p>
              Our Service does not address anyone under the age of 13 ("Children"). We do not knowingly collect personally identifiable information from anyone under the age of 13. If you are a parent or guardian and you are aware that your Child has provided us with Personal Data, please contact us. If we become aware that we have collected Personal Data from children without verification of parental consent, we take steps to remove that information from our servers.
            </p>
          </section>

          <section>
            <h2 className="text-xl sm:text-2xl font-semibold text-white">11. Changes to This Privacy Policy</h2>
            <p>
              We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page. We will let you know via email and/or a prominent notice on our Service, prior to the change becoming effective and update the "Last Updated" date at the top of this Privacy Policy.
            </p>
            <p>
              You are advised to review this Privacy Policy periodically for any changes. Changes to this Privacy Policy are effective when they are posted on this page.
            </p>
          </section>

          <section>
            <h2 className="text-xl sm:text-2xl font-semibold text-white">12. Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy, please contact us: [Your Contact Email Address or Link to Contact Page]. You should replace this with your actual contact information.
            </p>
            <p>
                Go back to <Link href="/" className="text-purple-400 hover:text-purple-300">Homepage</Link>.
            </p>
          </section>
        </article>
      </div>
    </div>
  );
} 