import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service - AI Baby Generator',
  description: 'Read the Terms of Service for AI Baby Generator. Understand your rights and responsibilities when using our platform.',
  alternates: {
    canonical: 'https://www.babypodcast.pro/terms-of-service',
  },
  openGraph: {
    title: 'Terms of Service - AI Baby Generator',
    description: 'Read the Terms of Service for AI Baby Generator. Understand your rights and responsibilities when using our platform.',
    url: 'https://www.babypodcast.pro/terms-of-service',
    // Uses default social share image from root layout unless a specific one is set here
    // images: [
    //   {
    //     url: '/social-share-tos.png',
    //     width: 1200,
    //     height: 630,
    //     alt: 'Terms of Service - AI Baby Generator',
    //   },
    // ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Terms of Service - AI Baby Generator',
    description: 'Read the Terms of Service for AI Baby Generator. Understand your rights and responsibilities when using our platform.',
    // Uses default social share image from root layout unless a specific one is set here
    // images: ['/social-share-tos.png'],
    // creator: '@YourTwitterHandle',
  },
  // If other metadata properties exist, they should be preserved.
};

export default function TermsOfServicePage() {
  return (
    <div className="container mx-auto max-w-3xl px-4 py-10 text-gray-800 dark:text-gray-200 font-sans">
      <header className="mb-10 text-center">
        <h1 className="text-5xl font-extrabold tracking-tight text-blue-700 dark:text-blue-300 drop-shadow-lg">Terms of Service</h1>
        <p className="text-base text-gray-500 dark:text-gray-400 mt-3 italic">Last updated: May 20, 2025</p>
      </header>

      <section className="mb-8 p-6 bg-white dark:bg-gray-800 shadow-lg rounded-lg">
        <p className="mb-4">
          By accessing and using <strong>AI Baby Generator</strong> (&quot;the Service&quot;), you agree to comply with and be bound by the following Terms of Use (&quot;Terms&quot;) related to the use of Google Login. If you do not agree to these Terms, please do not use the Service or the Google Login functionality.
        </p>
      </section>

      <section className="mb-8 p-8 bg-white dark:bg-gray-800 shadow-xl rounded-2xl">
        <h2 className="text-3xl font-bold mb-6 text-blue-600 dark:text-blue-300 border-l-4 border-blue-500 pl-4">1. Google Login Integration</h2>
        <p className="mb-4 text-base leading-relaxed text-gray-700 dark:text-gray-300">
          1.1. To enhance your experience, <strong>AI Baby Generator</strong> offers a third-party authentication service powered by Google Login. By using Google Login, you allow us to access certain information from your Google Account, including but not limited to:
        </p>
        <ul className="list-disc list-inside mb-4 space-y-1 pl-8">
          <li>
            <strong>Your Google Account Profile Information</strong>: Your name, email address, profile picture, and other details that you have chosen to share with Google.
          </li>
          <li>
            <strong>Authentication Token</strong>: A secure token that confirms your identity and grants you access to the Service.
          </li>
        </ul>
        <p>
          1.2. Google Login uses OAuth 2.0 authentication protocol, which means your login session is managed securely by Google.
        </p>
      </section>

      <section className="mb-8 p-6 bg-white dark:bg-gray-800 shadow-lg rounded-lg">
        <h2 className="text-2xl font-semibold mb-4 text-blue-500 dark:text-blue-300 border-l-4 border-blue-400 pl-3">2. Data Collection and Usage</h2>
        <p className="mb-2">
          2.1. By using Google Login, you consent to the collection and use of your Google Account information for the following purposes:
        </p>
        <ul className="list-disc list-inside mb-4 space-y-1 pl-8">
          <li>To authenticate your identity and log you into the Service.</li>
          <li>To personalize your experience and customize content based on the information retrieved from your Google Account.</li>
          <li>To communicate with you, if necessary, regarding your account and Service updates.</li>
        </ul>
        <p>
          2.2. We will not collect or store your Google password. The information we access from your Google Account is limited to what is necessary to provide the login service and related functionality.
        </p>
      </section>

      <section className="mb-8 p-6 bg-white dark:bg-gray-800 shadow-lg rounded-lg">
        <h2 className="text-2xl font-semibold mb-4 text-blue-500 dark:text-blue-300 border-l-4 border-blue-400 pl-3">3. Access Tokens and Session Management</h2>
        <p className="mb-2">
          3.1. <strong>Access Tokens</strong>: When you log in using Google Login, we obtain an access token that enables us to authenticate you with Google. The access token is valid for a limited time, and we will refresh it using a secure refresh token as needed.
        </p>
        <p className="mb-2">
          3.2. <strong>Session Duration</strong>: Your session will remain active as long as your access token is valid or until you log out of your account or revoke access to your Google account.
        </p>
        <p>
          3.3. You can disconnect your Google account from the Service at any time by logging out or by modifying your Google account settings.
        </p>
      </section>

      <section className="mb-8 p-6 bg-white dark:bg-gray-800 shadow-lg rounded-lg">
        <h2 className="text-2xl font-semibold mb-4 text-blue-500 dark:text-blue-300 border-l-4 border-blue-400 pl-3">4. Privacy and Security</h2>
        <p className="mb-2">
          4.1. We take your privacy and security seriously. Please refer to our <Link href="/privacy-policy" className="text-blue-600 hover:underline dark:text-blue-400">Privacy Policy</Link> for detailed information on how we handle your personal information, including the data we access from Google Login.
        </p>
        <p className="mb-2">
          4.2. <strong>Data Security</strong>: We implement industry-standard security measures to protect your data. However, we cannot guarantee the security of your data transmitted over the internet.
        </p>
        <p>
          4.3. <strong>Revoking Access</strong>: You may revoke access to your Google account at any time by visiting your Google Account settings or by logging out of the Service.
        </p>
      </section>

      <section className="mb-8 p-6 bg-white dark:bg-gray-800 shadow-lg rounded-lg">
        <h2 className="text-2xl font-semibold mb-4 text-blue-500 dark:text-blue-300 border-l-4 border-blue-400 pl-3">5. User Responsibilities</h2>
        <p className="mb-2">
          5.1. By using Google Login, you agree to: Provide accurate and up-to-date information in your Google Account. Keep your Google account credentials and access tokens secure. Not use Google Login for any unlawful or fraudulent purposes.
        </p>
        <p className="mb-2">
          5.2. You may not use the Service if prohibited by applicable law. Without limiting the foregoing, you represent and warrant that you are not located in, under the control of, or a resident of any country subject to embargoes or sanctions, including those administered by the United States government, nor are you listed on any restricted party list.
        </p>
        <p className="mb-2">
          5.3. Your use of the Service must comply with all applicable laws, regulations, and third-party platform terms.
        </p>
        <p className="mb-2">
          5.4. You may only use the Service for personal, non-commercial purposes in accordance with these Terms.
        </p>
        <p className="mb-2">
          5.5. When using the Service, you agree not to:
        </p>
        <ul className="list-disc list-inside mb-4 space-y-1 pl-8">
          <li>Violate any applicable laws or regulations;</li>
          <li>Copy, distribute, sublicense, sell, or exploit the Service;</li>
          <li>Reverse-engineer or attempt to access the source code of the Service;</li>
          <li>Use bots, scrapers, or other automated means to access or manipulate content;</li>
          <li>Circumvent DRM protections or access controls on third-party platforms;</li>
          <li>Interfere with or disrupt the Service, including through the use of automated tools; Infringe the rights of others, including intellectual property and privacy rights, including but without limits: 1) upload, generate, display, post, distribute or otherwise transmit any information that violates any third-party right, including any copyright, trademark, patent, trade secret, moral right, privacy right, right of publicity, or any other intellectual property or proprietary right; 2) use AI Baby Generator Outputs in any immoral or illegal way, especially AI Baby Generator Outputs which features a recognisable person; 3) use AI Baby Generator Outputs on or in conjunction with anything pornographic, obscene, offensive (including but not limited to in relation to adult entertainment venues, escort services, drug use, dating services, in a way which portrays someone as suffering from, or medicating for, a physical or mental ailment), illegal, immoral, infringing, defamatory, hateful, threatening or libellous in nature, in a political context (such as the promotion, advertisement or endorsement of any party, candidate, or elected official or in connection with any political party or viewpoint); 4) use AI Baby Generator Outputs in a misleading or deceptive way, including without limit (i) by suggesting that any depicted person, brand, organisation or other third party endorses or is affiliated with you or your goods or services, unless permission has been granted; or (ii) by giving the impression that AI Baby Generator Outputs were created by anyone other than the intellectual property rights holder of AI Baby Generator Outputs (including without limitation, by claiming or giving the impression that you hold ownership of, or exclusive rights to, AI Baby Generator Outputs); 5) use AI Baby Generator Outputs in breach of any law, regulation or industry code, or in any way which infringes the rights of any person or entity; 6) Copy, share, or display AI Baby Generator Outputs without appropriate authorization.</li>
        </ul>
        <p>
          5.6. The content provided by AI Baby Generator such as pictures and videos are for personal use only. You are granted a limited, non-exclusive, non-transferable, revocable license to access and use AI Baby Generator Outputs. You do not acquire any ownership rights in AI Baby Generator Outputs. You have the exclusive right to use AI Baby Generator Outputs solely for personal, educational, or non-commercial research purposes.
        </p>
      </section>

      <section className="mb-8 p-6 bg-white dark:bg-gray-800 shadow-lg rounded-lg">
        <h2 className="text-2xl font-semibold mb-4 text-blue-500 dark:text-blue-300 border-l-4 border-blue-400 pl-3">6. Intellectual Property</h2>
        <p className="mb-2">
           6.1. All content, trademarks, and intellectual property related to the Service are owned by AI Baby Generator or its licensors. You may not use or reproduce any content without permission.
        </p>
         <p className="mb-2">
           6.2. AI Baby Generator respects the intellectual property rights of others and expects users to do the same. Unauthorized use of copyrighted material is prohibited.
        </p>
        <p className="mb-2">
           6.3. By using the Service, you grant AI Baby Generator a license to use any content you submit or create, for the purpose of operating and improving the Service.
        </p>
        <p className="mb-2">
            6.4. You have the exclusive right to use AI Baby Generator Outputs solely for personal, educational, or non-commercial research purposes.
        </p>
        <p>
          6.5. By submitting feedback or suggestions, you grant us a royalty-free, perpetual, worldwide license to use and incorporate such input without obligation.
        </p>
      </section>

      <section className="mb-8 p-6 bg-white dark:bg-gray-800 shadow-lg rounded-lg">
        <h2 className="text-2xl font-semibold mb-4 text-blue-500 dark:text-blue-300 border-l-4 border-blue-400 pl-3">7. Termination of Access</h2>
        <p className="mb-2">
          7.1. We reserve the right to terminate or suspend your access to Google Login if we believe you are in violation of these Terms or our Privacy Policy. We may also suspend or terminate Google Login integration for any reason, at our discretion, with or without notice.
        </p>
        <p>
          7.2. Provisions regarding intellectual property, liability, indemnification, and dispute resolution will survive termination.
        </p>
      </section>

      <section className="mb-8 p-6 bg-white dark:bg-gray-800 shadow-lg rounded-lg">
        <h2 className="text-2xl font-semibold mb-4 text-blue-500 dark:text-blue-300 border-l-4 border-blue-400 pl-3">8. Fees, Payment, Auto-Renewal, Cancellation, and Refund Policy</h2>
        
        <h3 className="text-xl font-semibold mt-4 mb-2 text-blue-500 dark:text-blue-300">8.1 Fees and Payment</h3>
        <p className="mb-2">
          You agree to pay all applicable fees for the Services, as specified at the time of your purchase or subscription. We reserve the right to adjust pricing at any time, and any price changes will take effect after advance notice to you.
        </p>

        <h3 className="text-xl font-semibold mt-4 mb-2 text-blue-500 dark:text-blue-300">8.2 Auto-Renewal and Cancellation of Subscriptions</h3>
        <p className="mb-2">
          If you choose to purchase a subscription, your subscription will continue and automatically renew at the then-current price for such subscription, at the frequency specified at the time of purchase (e.g., monthly, annually), until terminated in accordance with these Terms.
        </p>
        <ul className="list-disc list-inside mb-4 space-y-1 pl-8">
          <li>
            <strong>Authorization to Charge</strong>: By subscribing, you authorize us to charge your designated payment method now, and again at the beginning of any subsequent subscription period.
          </li>
          <li>
            <strong>Payment Failure</strong>: If AI Baby Generator does not receive payment upon renewal of your subscription, (i) you shall pay all amounts due on your account upon demand, and/or (ii) you agree that AI Baby Generator may either terminate or suspend your subscription and continue to attempt to charge your designated payment method until payment is received (upon receipt of payment, your account will be activated and for purposes of automatic renewal, your new subscription commitment period will begin as of the day payment was received).
          </li>
          <li>
            <strong>Cancellation</strong>: If you do not want your account to renew automatically, or if you want to change or terminate your subscription, you must do so through your account settings or contact AI Baby Generator at <a href="mailto:support@babypodcast.pro" className="text-blue-600 hover:underline dark:text-blue-400">support@babypodcast.pro</a> prior to the next renewal date. If you purchased your subscription through a third-party application store, you must cancel, change, or terminate your subscription through such third-party application store before your renewal start date.
          </li>
          <li>
            <strong>Effect of Cancellation</strong>: If you cancel your subscription, you may use your subscription until the end of your then-current subscription term; your subscription will not be renewed after your then-current term expires.
          </li>
        </ul>

        <h3 className="text-xl font-semibold mt-4 mb-2 text-blue-500 dark:text-blue-300">8.3 Refund Policy</h3>
        <ul className="list-disc list-inside mb-4 space-y-1 pl-8">
          <li>
            <strong>General</strong>: Except as expressly set forth in these Terms or as required by applicable law, all fees paid are non-refundable.
          </li>
          <li>
            <strong>Subscription Fees</strong>: Fees paid for a subscription period (e.g., monthly, annually) are generally non-refundable once the subscription period has commenced. Even if you cancel your subscription mid-period, you will not be eligible for a pro-rata refund of any portion of the subscription fee paid for the then-current subscription term. As stated in Section 8.2 above, upon cancellation, you will continue to have access to the service until the end of your then-current paid subscription term.
          </li>
          <li>
            <strong>One-Time Purchases (if applicable)</strong>: For any one-time purchases of service packs or credits (if such services are offered), refunds are generally not provided unless requested within 7 days of purchase and the service pack or credits remain entirely unused.
          </li>
          <li>
            <strong>Exceptions</strong>:
            <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
              <li>
                <strong>Material Service Defects</strong>: If our Service suffers from a material defect that prevents you from reasonably using its core functionalities, and we fail to remedy such defect within a reasonable time after receiving written notice from you, you may be eligible for a partial or full refund, determined on a case-by-case basis.
              </li>
              <li>
                <strong>As Required by Law</strong>: We will provide refunds where required by applicable law.
              </li>
            </ul>
          </li>
          <li>
            <strong>Refund Requests</strong>: All refund requests (if eligible under the exceptions above) must be submitted to <a href="mailto:support@babypodcast.pro" className="text-blue-600 hover:underline dark:text-blue-400">support@babypodcast.pro</a> with details of the purchase and the reason for the request. We will evaluate your request in accordance with this policy.
          </li>
        </ul>
      </section>

      <section className="mb-8 p-6 bg-white dark:bg-gray-800 shadow-lg rounded-lg">
        <h2 className="text-2xl font-semibold mb-4 text-blue-500 dark:text-blue-300 border-l-4 border-blue-400 pl-3">9. Disclaimer of Warranties</h2>
        <p className="mb-2">
          9.1. The Service is provided &quot;as is&quot; and &quot;as available.&quot; We disclaim all warranties, express or implied, including fitness for a particular purpose and non-infringement.
        </p>
        <p className="mb-2">
          9.2. We do not guarantee the Service will be uninterrupted, error-free, or compatible with all devices or platforms.
        </p>
        <p>
          9.3. Third-party services involved, including Google Login, are not under our control, and we do not review, approve, monitor, endorse, warrant, or make any representations and warranties, express or implied with respect to third party services and are not responsible for any third-party service.
        </p>
      </section>

      <section className="mb-8 p-6 bg-white dark:bg-gray-800 shadow-lg rounded-lg">
        <h2 className="text-2xl font-semibold mb-4 text-blue-500 dark:text-blue-300 border-l-4 border-blue-400 pl-3">10. Liabilities and Indemnification</h2>
        <p className="mb-2">
          10.1. We reserve the right to investigate violations and take appropriate action regarding your breach of Terms, including but not limited to suspending or disabling access.
        </p>
        <p>
          10.2. You agree to indemnify and hold us harmless from any claims, damages, or expenses arising from:
        </p>
        <ul className="list-disc list-inside space-y-1 pl-8">
          <li>Your use of the Service;</li>
          <li>Your breach of these Terms;</li>
          <li>Your violation of any law or third-party rights.</li>
        </ul>
      </section>

      <section className="mb-8 p-6 bg-white dark:bg-gray-800 shadow-lg rounded-lg">
        <h2 className="text-2xl font-semibold mb-4 text-blue-500 dark:text-blue-300 border-l-4 border-blue-400 pl-3">11. Limitation of Liability</h2>
        <p className="mb-2">
          11.1. To the fullest extent permitted by law, <strong>AI Baby Generator</strong> shall not be liable for any direct, indirect, incidental, consequential, or special damages arising from the use of Google Login, including any issues related to authentication, security breaches, or data loss.
        </p>
        <p className="mb-2">
          11.2. YOU SHALL USE THE SERVICES PROVIDED BY US AND AI Baby Generator OUTPUTS IN STRICT ACCORDANCE WITH THIS AGREEMENT. WE ARE NOT LIABLE FOR LOSSES ARISING FROM YOUR BREACH OF THESE TERMS OR ANY OF OUR OTHER RULES.
        </p>
        <p className="mb-2">
          11.3. WE WILL NOT BE LIABLE TO YOU OR ANY OTHER INDIVIDUAL OR ENTITY FOR ANY INDIRECT DAMAGES.
        </p>
        <p>
          11.4. IN NO EVENT SHALL OUR AGGREGATE LIABILITY FOR COMPENSATION UNDER THIS TERMS (WHETHER IN CONTRACT, TORT OR OTHERWISE) EXCEED THE HIGHER OF THE TOTAL FEES PAID BY YOU TO US FOR YOUR USE OF THE SERVICES HEREUNDER DURING THE TWELVE (12) MONTHS IMMEDIATELY PRIOR TO THE EVENT OR CIRCUMSTANCE GIVEN RISE TO SUCH LIABILITY.
        </p>
      </section>

      <section className="mb-8 p-6 bg-white dark:bg-gray-800 shadow-lg rounded-lg">
        <h2 className="text-2xl font-semibold mb-4 text-blue-500 dark:text-blue-300 border-l-4 border-blue-400 pl-3">12. Modifications to Terms of Use</h2>
        <p>
          We may update or modify these Terms of Use at any time, and such changes will be effective immediately upon posting on this page. It is your responsibility to review these Terms periodically for any changes. Continued use of the Service after any changes to these Terms constitutes acceptance of those changes.
        </p>
      </section>

      <section className="mb-8 p-6 bg-white dark:bg-gray-800 shadow-lg rounded-lg">
        <h2 className="text-2xl font-semibold mb-4 text-blue-500 dark:text-blue-300 border-l-4 border-blue-400 pl-3">13. Governing Law and Dispute Resolution</h2>
        <p className="mb-2">
          13.1 These Terms are governed by and construed in accordance with the laws of [Jurisdiction], without regard to its conflict of law principles. Any disputes arising out of or in connection with these Terms shall be subject to the exclusive jurisdiction of the courts in [Jurisdiction].
        </p>
        <p className="mb-2">
          13.2. Any controversy or dispute between you and us shall be firstly settled through friendly negotiations, fail which, you agree that such controversy or dispute may be submitted to the competent people&apos;s court at the place where you are permanently located.
        </p>
        <p className="mb-2">
          13.3. UNLESS YOU ARE A RESIDENT IN ANY PROVINCE, TERRITORY OR JURISDICTION WHERE SUCH CLAUSES OR WAIVERS ARE PROHIBITED, YOU AGREE THAT, YOU MAY BRING CLAIMS AGAINST THE OTHER ONLY ON AN INDIVIDUAL BASIS AND NOT ON A CLASS, REPRESENTATIVE, OR COLLECTIVE BASIS, AND YOU HEREBY WAIVES ALL RIGHTS TO HAVE ANY DISPUTE BE BROUGHT, HEARD, ADMINISTERED, RESOLVED, OR ARBITRATED ON A CLASS, COLLECTIVE, REPRESENTATIVE, OR MASS ACTION BASIS. ONLY INDIVIDUAL RELIEF IS AVAILABLE, AND DISPUTES OF MORE THAN ONE CUSTOMER OR USER CANNOT BE ARBITRATED OR CONSOLIDATED WITH THOSE OF ANY OTHER USER.
        </p>
        <p>
          13.4. We may seek injunctive or equitable relief in any competent court where you are permanently located, as necessary to protect our rights or interests.
        </p>
      </section>

      <section className="mb-8 p-6 bg-white dark:bg-gray-800 shadow-lg rounded-lg">
        <h2 className="text-2xl font-semibold mb-4 text-blue-500 dark:text-blue-300 border-l-4 border-blue-400 pl-3">14. General Provisions</h2>
        <p className="mb-2">
          14.1. If any provision of these Terms is deemed unenforceable, the remainder shall remain in effect.
        </p>
        <p className="mb-2">
          14.2. These Terms represent the entire agreement between you and us regarding the Service.
        </p>
        <p className="mb-2">
          14.3. You may not assign these Terms without our consent. We may assign them freely.
        </p>
        <p>
          14.4. Our failure to enforce any provision shall not constitute a waiver.
        </p>
      </section>

      <section className="p-6 bg-white dark:bg-gray-800 shadow-lg rounded-lg">
        <h2 className="text-2xl font-semibold mb-4 text-blue-500 dark:text-blue-300 border-l-4 border-blue-400 pl-3">15. Contact Us</h2>
        <p className="mt-4">
          This service is developed and maintained by KKKK, an independent developer from China.
        </p>
        <p>
          If you have any questions or concerns regarding these Terms of Use, or if you identify any infringement upon your legitimate rights or interests during your use of the Service, please promptly contact us and provide us with legally valid supporting materials, including but not limited to identity certificate, ownership certificate, and description of specific infringement, so that we may take necessary measures to deal with such issue. In addition, if you identify any violation of laws or regulations or relevant rules on the Service hereunder during your use of the Service, please contact us.
        </p>
        <p className="mt-2">
          <strong>Email</strong>: <a href="mailto:support@babypodcast.pro" className="text-blue-600 hover:underline dark:text-blue-400">support@babypodcast.pro</a>
        </p>
      </section>
      <Link href="/" className="fixed bottom-8 right-8 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg shadow-lg transition-colors duration-200 z-50">
        Back to Home
      </Link>
    </div>
  );
}