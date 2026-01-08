import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service - Lynk Labs',
  description: 'Read the terms and conditions for using Lynk Labs diagnostic services, home collection, and digital reports.',
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-slate-50 py-16 lg:py-24">
      <div className="container-padding max-w-5xl mx-auto">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 lg:p-12">
          <div className="border-b border-slate-100 pb-8 mb-8">
            <h1 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">Terms of Service</h1>
            <p className="text-slate-500">Last updated: January 2026</p>
          </div>

          <div className="prose prose-slate prose-lg max-w-none">
            <p className="lead text-xl text-slate-600 mb-8">
              Welcome to Lynk Labs. By accessing our website, mobile application, or availing our diagnostic services "Services", you agree to be bound by these Terms of Service. Please read them carefully. If you do not agree with any part of these terms, you must not use our Services.
            </p>

            <section className="mb-10">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">1. Medical Disclaimer</h2>
              <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-r-lg mb-4">
                <p className="text-amber-900 font-medium">
                  Important: Our Services are for diagnostic purposes only and do not constitute medical advice, diagnosis, or treatment.
                </p>
              </div>
              <p>
                The contents of our reports are purely analytical findings based on the samples provided. These reports should always be interpreted by a qualified registered medical practitioner. Do not ignore professional medical advice or delay seeking treatment based on information obtained from our Services. In case of a medical emergency, please visit the nearest hospital immediately.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">2. Services and Eligibility</h2>
              <p className="mb-4">
                Lynk Labs provides pathology and diagnostic testing services, including home sample collection and online report delivery.
              </p>
              <ul className="list-disc pl-6 space-y-2 text-slate-700">
                <li>You must be at least 18 years of age to use our Services independently. Services for minors must be booked by a legal guardian.</li>
                <li>You agree to provide accurate, current, and complete information about yourself (and the patient, if different) as prompted by our booking forms.</li>
                <li>We reserve the right to refuse service if we suspect fraud, misuse, or violation of these terms.</li>
              </ul>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">3. Booking and Sample Collection</h2>
              <ul className="list-disc pl-6 space-y-2 text-slate-700">
                <li><strong>Home Collection:</strong> Slots are subject to availability. Our phlebotomists will make reasonable efforts to reach your location on time, but delays due to traffic or unforeseen circumstances may occur.</li>
                <li><strong>Patient Preparation:</strong> It is your responsibility to follow specific test instructions (e.g., fasting for 10-12 hours) provided during booking. Failure to do so may result in inaccurate results or refusal of sample collection.</li>
                <li><strong>Right to Refuse:</strong> Our phlebotomists reserve the right to refuse sample collection if the environment is unsafe, if the patient is abusive, or if clinical conditions for collection are not met.</li>
              </ul>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">4. Reports and Turnaround Time</h2>
              <p>
                The turnaround times (TAT) mentioned for tests are indicative and estimated from the time the sample reaches the laboratory. While we strive to deliver reports within the promised time, delays may occur due to technical reasons, re-testing requirements for accuracy, or logistical issues. Lynk Labs shall not be liable for any consequences arising from such delays.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">5. Payment, Pricing, and Taxes</h2>
              <ul className="list-disc pl-6 space-y-2 text-slate-700">
                <li>All prices listed are in Indian Rupees (INR) and are inclusive of applicable taxes unless stated otherwise.</li>
                <li>Payment must be made in full at the time of booking via available online payment modes or at the time of collection (if Cash on Collection is available).</li>
                <li>Prices are subject to change without prior notice. The price applicable at the time of booking will be charged.</li>
              </ul>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">6. Cancellation and Refund Policy</h2>
              <ul className="list-disc pl-6 space-y-2 text-slate-700">
                <li><strong>Cancellation by User:</strong> You may cancel your booking up to 2 hours before the scheduled slot for a full refund. Cancellations made within 2 hours of the slot may attract a cancellation fee.</li>
                <li><strong>Cancellation by Us:</strong> If we cancel a booking due to operational reasons, a full refund will be processed.</li>
                <li><strong>Refund Processing:</strong> Refunds are typically processed within 5-7 business days to the original source of payment.</li>
              </ul>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">7. Limitation of Liability</h2>
              <p>
                To the fullest extent permitted by law, Lynk Labs' liability shall be limited to the cost of the test/service paid by the user. We shall not be liable for any indirect, incidental, special, or consequential damages resulting from the use or inability to use our services, including but not limited to damages for loss of profits, data, or other intangibles.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">8. Governing Law and Jurisdiction</h2>
              <p>
                These Terms shall be governed by and construed in accordance with the laws of India. Any disputes arising out of these terms shall be subject to the exclusive jurisdiction of the courts in Hyderabad, Telangana.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">9. Contact Information</h2>
              <p className="mb-4">
                If you have questions regarding these Terms, please contact us at:
              </p>
              <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
                <p className="text-slate-900 font-semibold mb-1">Legal Team - Lynk Labs</p>
                <p className="text-slate-600">Email: legal@lynklabs.in</p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}