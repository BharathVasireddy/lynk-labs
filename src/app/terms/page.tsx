import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service - Lynk Labs',
  description: 'Read the terms and conditions for using Lynk Labs diagnostic testing services.',
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Terms of Service</h1>
          <p className="text-sm text-gray-500 mb-8">Last updated: January 2025</p>
          
          <div className="prose prose-lg max-w-none space-y-6">
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Acceptance of Terms</h2>
              <p className="text-gray-600">
                By accessing and using Lynk Labs services, you accept and agree to be bound by the 
                terms and provision of this agreement.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Service Description</h2>
              <p className="text-gray-600 mb-4">
                Lynk Labs provides home-based diagnostic testing services including:
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2">
                <li>Online test booking and scheduling</li>
                <li>Home sample collection services</li>
                <li>Laboratory testing and analysis</li>
                <li>Digital report delivery</li>
                <li>Customer support services</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">User Responsibilities</h2>
              <ul className="list-disc list-inside text-gray-600 space-y-2">
                <li>Provide accurate and complete information</li>
                <li>Follow test preparation instructions</li>
                <li>Be available at scheduled appointment times</li>
                <li>Pay for services as agreed</li>
                <li>Maintain confidentiality of your account</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Payment Terms</h2>
              <ul className="list-disc list-inside text-gray-600 space-y-2">
                <li>Payment is required at the time of booking</li>
                <li>We accept various payment methods including cards and digital wallets</li>
                <li>Refunds are processed according to our refund policy</li>
                <li>Prices are subject to change with notice</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Cancellation Policy</h2>
              <p className="text-gray-600 mb-4">
                You may cancel your appointment:
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2">
                <li>Up to 2 hours before scheduled time for full refund</li>
                <li>Less than 2 hours: 50% cancellation fee applies</li>
                <li>No-show appointments are non-refundable</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Limitation of Liability</h2>
              <p className="text-gray-600">
                Lynk Labs shall not be liable for any indirect, incidental, special, consequential, 
                or punitive damages resulting from your use of our services.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Contact Information</h2>
              <p className="text-gray-600">
                For questions about these Terms of Service, contact us at:
              </p>
              <div className="bg-gray-50 p-4 rounded-lg mt-4">
                <p className="text-gray-700">Email: legal@lynklabs.com</p>
                <p className="text-gray-700">Phone: +91 99999 99999</p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
} 