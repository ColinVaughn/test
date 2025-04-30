
import HeaderWithAdmin from "@/components/HeaderWithAdmin";
import Footer from "@/components/Footer";

const PrivacyPage = () => {
  return (
    <div className="min-h-screen bg-gaming-darker">
      <HeaderWithAdmin />
      <main className="container mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold text-white mb-8">Privacy Policy</h1>
        <div className="prose prose-invert max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-white mb-4">1. Introduction</h2>
            <p className="text-gray-300">
              BattleForgePC, LLC ("we," "us," or "our") operates the website and online Marketplace at 
              www.battleforgepc.com (collectively, "Site"). This Privacy Policy applies to all visitors, users, 
              and customers of our Site and Marketplace. By using our Site or Marketplace, you consent to the 
              practices described herein.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-white mb-4">2. Information We Collect</h2>
            <h3 className="text-xl font-semibold text-white mb-2">2.1 Personal Data You Provide</h3>
            <p className="text-gray-300">
              <strong>Account Registration:</strong> Name, email address, phone number, billing/shipping address, 
              and password when you create an account or place an order.
            </p>
            <p className="text-gray-300">
              <strong>Order Information:</strong> Payment method details (e.g., credit card number via our payment processor), 
              order history, and communication preferences.
            </p>
            
            <h3 className="text-xl font-semibold text-white mb-2 mt-4">2.2 Automatically Collected Data</h3>
            <p className="text-gray-300">
              <strong>Usage Data:</strong> IP address, browser type/version, pages visited, time and date stamps, 
              and referral URLs collected via cookies and similar technologies.
            </p>
            <p className="text-gray-300">
              <strong>Device Data:</strong> Device identifiers, operating system, and mobile network information 
              if you access the Site via mobile device.
            </p>
            
            <h3 className="text-xl font-semibold text-white mb-2 mt-4">2.3 Third‐Party Sources</h3>
            <p className="text-gray-300">
              <strong>Analytics & Advertising:</strong> Data from Google Analytics, Facebook Pixel, and other analytics 
              or advertising partners to understand Site usage and target ads.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-white mb-4">3. How We Use Your Information</h2>
            <ul className="text-gray-300 list-disc pl-6 space-y-2">
              <li>
                <strong>Order Fulfillment:</strong> Process and ship your orders, send order confirmations, and provide customer support.
              </li>
              <li>
                <strong>Account Management:</strong> Create and secure your account, manage your profile, and authenticate your identity.
              </li>
              <li>
                <strong>Marketing & Promotions:</strong> Send newsletters, promotions, and updates if you opt in; you may unsubscribe at any time.
              </li>
              <li>
                <strong>Site Improvement:</strong> Analyze usage trends and preferences to enhance our Site functionality and user experience.
              </li>
              <li>
                <strong>Fraud Prevention:</strong> Monitor and prevent fraudulent activity, unauthorized transactions, and security breaches.
              </li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-white mb-4">4. Sharing Your Information</h2>
            <ul className="text-gray-300 list-disc pl-6 space-y-2">
              <li>
                <strong>Service Providers:</strong> We share data with payment processors, shipping carriers, IT service providers, 
                and other vendors who perform services on our behalf.
              </li>
              <li>
                <strong>Marketplace Sellers:</strong> For Marketplace orders, we share your shipping address and order details 
                with the relevant Seller to fulfill your order.
              </li>
              <li>
                <strong>Legal Requirements:</strong> We disclose information when required by law, subpoena, 
                or to protect our rights, privacy, safety, or property.
              </li>
              <li>
                <strong>Business Transfers:</strong> Information may be transferred in connection with a merger, acquisition, 
                or sale of assets, provided the recipient agrees to abide by this Privacy Policy.
              </li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-white mb-4">5. Cookies & Tracking Technologies</h2>
            <p className="text-gray-300">
              We use cookies, web beacons, and similar tools to:
            </p>
            <ul className="text-gray-300 list-disc pl-6 space-y-2">
              <li>Authenticate users and prevent fraudulent use.</li>
              <li>Remember your preferences and improve Site performance.</li>
              <li>Analyze Site traffic and user behavior for marketing and analytics purposes.</li>
            </ul>
            <p className="text-gray-300 mt-2">
              You can manage cookie preferences through your browser settings, but disabling cookies may affect Site functionality.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-white mb-4">6. Your Privacy Rights</h2>
            <h3 className="text-xl font-semibold text-white mb-2">6.1 EU GDPR Rights</h3>
            <p className="text-gray-300">
              If you are in the European Economic Area, you have the right to access, correct, delete, 
              restrict processing of, or port your personal data, and to withdraw consent at any time. 
              You may lodge a complaint with a supervisory authority.
            </p>
            
            <h3 className="text-xl font-semibold text-white mb-2 mt-4">6.2 California Consumer Privacy Act (CCPA)</h3>
            <p className="text-gray-300">
              If you are a California resident, you have the right to:
            </p>
            <ul className="text-gray-300 list-disc pl-6 space-y-2">
              <li>Know what personal data we collect and how it is used and shared.</li>
              <li>Delete your personal data, subject to certain exceptions.</li>
              <li>Opt-Out of the sale of your personal data (we do not sell data for monetary consideration).</li>
              <li><strong>Non‐Discrimination:</strong> We will not discriminate against you for exercising your CCPA rights.</li>
            </ul>
            <p className="text-gray-300 mt-2">
              To exercise these rights, please contact us as described below.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-white mb-4">7. Data Security</h2>
            <p className="text-gray-300">
              We implement reasonable administrative, technical, and physical safeguards to protect personal data 
              from unauthorized access, disclosure, alteration, and destruction. No method of transmission over the 
              Internet is 100% secure; we cannot guarantee absolute security.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-white mb-4">8. Data Retention</h2>
            <p className="text-gray-300">
              We retain personal data for as long as necessary to fulfill the purposes outlined in this Privacy Policy, 
              comply with legal obligations, resolve disputes, and enforce agreements. Inactive accounts may be deleted 
              after a period of years, unless otherwise required by law.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-white mb-4">9. Children's Privacy</h2>
            <p className="text-gray-300">
              Our Site is not intended for children under 16 (or higher minimum age required by local law). 
              We do not knowingly collect personal data from minors. If we learn we have collected such data, 
              we will delete it promptly.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-white mb-4">10. Third‐Party Links</h2>
            <p className="text-gray-300">
              Our Site may contain links to third‐party websites. This Privacy Policy does not apply to those sites. 
              We encourage you to review the privacy policies of any linked sites.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-white mb-4">11. Changes to This Policy</h2>
            <p className="text-gray-300">
              We may update this Privacy Policy to reflect changes in our practices or legal requirements. 
              The "Last updated" date at the top will indicate when the policy was last revised. 
              We encourage you to review it periodically.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-white mb-4">12. Contact Us</h2>
            <p className="text-gray-300">
              If you have questions or wish to exercise your rights, contact:
            </p>
            <address className="text-gray-300 not-italic mt-2">
              BattleForgePC, LLC<br />
              104 Regency Apt 44, Central, SC 29630<br />
              Email: <a href="mailto:colin@battleforgepc.com" className="text-gaming-blue hover:underline">privacy@battleforgepc.com</a><br />
              Phone: (803) 555-1234
            </address>
          </section>

          <p className="text-gray-400 italic">Last updated: April 29, 2025</p>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PrivacyPage;
