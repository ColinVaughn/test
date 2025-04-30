
import HeaderWithAdmin from "@/components/HeaderWithAdmin";
import Footer from "@/components/Footer";

const TermsPage = () => {
  return (
    <div className="min-h-screen bg-gaming-darker">
      <HeaderWithAdmin />
      <main className="container mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold text-white mb-8">Terms of Service</h1>
        <div className="prose prose-invert max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-white mb-4">1. Acceptance of Terms</h2>
            <p className="text-gray-300">
              By accessing or using BattleForgePC's website or Marketplace ("Site"), or placing an order 
              through either channel, you agree to be bound by this Agreement, our Privacy Policy, 
              and any other policies we post on the Site.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-white mb-4">2. Definitions</h2>
            <ul className="text-gray-300 list-disc pl-6 space-y-2">
              <li>
                <strong>Products:</strong> Gaming computers and accessories sold directly by BattleForgePC.
              </li>
              <li>
                <strong>Marketplace Items:</strong> Products sold by third-party Sellers via our Marketplace.
              </li>
              <li>
                <strong>Buyer:</strong> Any customer purchasing Products or Marketplace Items.
              </li>
              <li>
                <strong>Seller:</strong> Any third-party merchant listing items on our Marketplace.
              </li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-white mb-4">3. User Accounts & Security</h2>
            <p className="text-gray-300">
              If you create an account, you must:
            </p>
            <ul className="text-gray-300 list-disc pl-6 space-y-2">
              <li>Provide accurate information and keep credentials confidential.</li>
              <li>Notify us immediately of any unauthorized use.</li>
              <li>Acknowledge we may suspend or terminate accounts for suspected fraud or policy violations.</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-white mb-4">4. Orders, Pricing & Payment</h2>
            <ul className="text-gray-300 list-disc pl-6 space-y-2">
              <li><strong>Order Acceptance:</strong> All orders are subject to availability and order confirmation.</li>
              <li><strong>Pricing:</strong> Prices are in USD and exclude taxes and shipping, which are added at checkout.</li>
              <li><strong>Payment Methods:</strong> We accept major credit cards, PayPal, and other methods listed at checkout; we may change payment options at any time.</li>
              <li><strong>Marketplace Disbursements:</strong> For Marketplace transactions, Sellers receive payment only after the Buyer's refund window closes or the order completes.</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-white mb-4">5. Shipping & Delivery</h2>
            <p className="text-gray-300">
              We ship via carriers selected at checkout; estimated delivery windows are provided but not guaranteed.
            </p>
            <p className="text-gray-300 mt-2">
              Risk of loss passes to the Buyer upon carrier pickup. Buyers are responsible for insurance or tracking disputes.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-white mb-4">6. Returns & Refunds</h2>
            <h3 className="text-xl font-semibold text-white mb-2">Direct Sales ("Products")</h3>
            <ul className="text-gray-300 list-disc pl-6 space-y-2 mb-4">
              <li><strong>14-Day Free Return:</strong> Return most Products, unopened and in original packaging, within 14 days of delivery for a full refund.</li>
              <li><strong>1-Year Warranty:</strong> Defective Products may be returned within one year for repair, replacement, or refund at our discretion.</li>
              <li><strong>Refund Processing:</strong> Once approved, refunds to your original payment method may take up to 10 business days from receipt and inspection of the returned item.</li>
            </ul>
            <h3 className="text-xl font-semibold text-white mb-2">Marketplace Items</h3>
            <ul className="text-gray-300 list-disc pl-6 space-y-2">
              <li><strong>3-Day Return Window:</strong> Buyers may request a refund or return within 3 calendar days of delivery if the item is materially non-conforming, defective, or damaged.</li>
              <li><strong>Seller-Handled Refunds:</strong> Unless otherwise agreed, Sellers process returns and issue refunds in accordance with this policy.</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-white mb-4">7. Order Cancellations</h2>
            <p className="text-gray-300">
              Requests to cancel an order after placement will be honored only after we receive all parts back from our supplier in resalable condition. Refund timing may extend beyond standard processing periods.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-white mb-4">8. Seller Obligations (Marketplace)</h2>
            <p className="text-gray-300">
              Sellers must:
            </p>
            <ul className="text-gray-300 list-disc pl-6 space-y-2">
              <li>Provide accurate, complete, and non-misleading listings (descriptions, images, condition, pricing).</li>
              <li>Comply with all applicable laws and our policies.</li>
              <li>Fulfill orders promptly and ship with adequate packaging and insurance.</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-white mb-4">9. Intellectual Property Rights</h2>
            <p className="text-gray-300">
              All content on the Site—logos, text, graphics, software—is owned or licensed by BattleForgePC. You agree not to copy, reproduce, distribute, or create derivative works thereof.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-white mb-4">10. Privacy & Data Protection</h2>
            <p className="text-gray-300">
              Our Privacy Policy explains how we collect, use, store, and disclose personal data. We comply with applicable privacy laws, including GDPR for EU data subjects.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-white mb-4">11. Force Majeure</h2>
            <p className="text-gray-300">
              Neither party is liable for delays or failures to perform due to events beyond reasonable control (e.g., natural disasters, strikes, pandemics). The affected party must notify the other promptly.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-white mb-4">12. Indemnification</h2>
            <p className="text-gray-300">
              You agree to indemnify, hold harmless, and defend BattleForgePC and its affiliates from any third-party claims arising out of your breach of this Agreement, misuse of Products or Marketplace, or violation of law.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-white mb-4">13. Limitation of Liability</h2>
            <p className="text-gray-300">
              To the fullest extent permitted by law, BattleForgePC's aggregate liability for any claim related to this Agreement is limited to the total amount you paid for the specific Product or transaction at issue. We disclaim indirect, incidental, consequential, and punitive damages.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-white mb-4">14. Dispute Resolution & Arbitration</h2>
            <p className="text-gray-300">
              All disputes arising under this Agreement will be submitted to binding arbitration under the American Arbitration Association's Consumer Arbitration Rules. The arbitration award may be entered in any court of competent jurisdiction.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-white mb-4">15. Governing Law & Venue</h2>
            <p className="text-gray-300">
              This Agreement is governed by the laws of the State of South Carolina without regard to conflict‐of‐law principles. For non-arbitrated matters, venue lies exclusively in the courts of South Carolina.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-white mb-4">16. Modification of Terms</h2>
            <p className="text-gray-300">
              We reserve the right to modify this Agreement at any time. Changes become effective upon posting; continued use of the Site or Marketplace constitutes acceptance of the revised terms.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-white mb-4">17. Severability</h2>
            <p className="text-gray-300">
              If any provision is held unenforceable, the remaining provisions remain in full force and effect.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-white mb-4">18. Assignment</h2>
            <p className="text-gray-300">
              You may not assign or transfer your rights or obligations under this Agreement without our prior written consent.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-white mb-4">19. Contact Information</h2>
            <p className="text-gray-300">
              For questions or legal notices, contact us at:
            </p>
            <address className="text-gray-300 not-italic mt-2">
              BattleForgePC, LLC<br />
              104 Regency Drive, Central, SC 29630<br />
              Email: <a href="mailto:support@battleforgepc.com" className="text-gaming-blue hover:underline">support@battleforgepc.com</a><br />
              Phone: (843) 680-1187
            </address>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default TermsPage;
