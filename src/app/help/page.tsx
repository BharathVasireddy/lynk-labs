import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Help & Support - Lynk Labs',
  description: 'Get help and support for your Lynk Labs diagnostic testing needs.',
};

export default function HelpPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Help & Support</h1>
          
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div className="bg-blue-50 p-6 rounded-lg">
              <h2 className="text-xl font-semibold text-blue-900 mb-4">Quick Help</h2>
              <div className="space-y-3">
                <a href="/track-order" className="block text-blue-700 hover:text-blue-800">
                  📦 Track Your Order
                </a>
                <a href="/contact" className="block text-blue-700 hover:text-blue-800">
                  📞 Contact Support
                </a>
                <a href="/login" className="block text-blue-700 hover:text-blue-800">
                  🔐 Login Issues
                </a>
                <a href="/reports" className="block text-blue-700 hover:text-blue-800">
                  📄 Download Reports
                </a>
              </div>
            </div>

            <div className="bg-green-50 p-6 rounded-lg">
              <h2 className="text-xl font-semibold text-green-900 mb-4">Emergency Contact</h2>
              <div className="space-y-2">
                <p className="text-green-800">
                  <strong>24/7 Helpline:</strong><br />
                  +91 99999 99999
                </p>
                <p className="text-green-800">
                  <strong>Email Support:</strong><br />
                  support@lynklabs.com
                </p>
                <p className="text-green-800">
                  <strong>WhatsApp:</strong><br />
                  +91 88888 88888
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Frequently Asked Questions</h2>
              <div className="space-y-4">
                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">How do I book a home collection?</h3>
                  <p className="text-gray-600">
                    You can book online through our website, call our helpline, or use our mobile app. 
                    Select your tests, choose a convenient time slot, and our certified phlebotomist will visit you.
                  </p>
                </div>

                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">When will I receive my reports?</h3>
                  <p className="text-gray-600">
                    Most reports are available within 24-48 hours of sample collection. 
                    You'll receive an SMS and email notification when your report is ready.
                  </p>
                </div>

                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Is home collection safe?</h3>
                  <p className="text-gray-600">
                    Yes, our certified professionals follow strict safety protocols including 
                    sanitization, use of sterile equipment, and proper disposal of medical waste.
                  </p>
                </div>

                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Can I reschedule my appointment?</h3>
                  <p className="text-gray-600">
                    Yes, you can reschedule up to 2 hours before your appointment time. 
                    Contact our support team or use the reschedule option in your account.
                  </p>
                </div>

                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">What payment methods do you accept?</h3>
                  <p className="text-gray-600">
                    We accept all major credit/debit cards, UPI, net banking, and digital wallets. 
                    Payment is secure and processed through encrypted channels.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Test Preparation Guidelines</h2>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                <h3 className="font-semibold text-yellow-900 mb-3">Fasting Tests</h3>
                <ul className="text-yellow-800 space-y-1 text-sm">
                  <li>• Fast for 8-12 hours before blood collection</li>
                  <li>• You can drink plain water</li>
                  <li>• Avoid smoking and alcohol</li>
                  <li>• Take regular medications unless advised otherwise</li>
                </ul>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
} 