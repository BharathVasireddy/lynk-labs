import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy - Lynk Labs',
  description: 'Learn how Lynk Labs protects your privacy and handles your personal and medical information.',
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-slate-50 py-16 lg:py-24">
      <div className="container-padding max-w-5xl mx-auto">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 lg:p-12">
          <div className="border-b border-slate-100 pb-8 mb-8">
            <h1 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">Privacy Policy</h1>
            <p className="text-slate-500">Last updated: January 2026</p>
          </div>

          <div className="prose prose-slate prose-lg max-w-none">
            <p className="lead text-xl text-slate-600 mb-8">
              At Lynk Labs Private Limited ("Lynk Labs", "we", "us", or "our"), we are deeply committed to protecting your privacy and ensuring the security of your personal and medical information. This Privacy Policy outlines our practices concerning the collection, use, and disclosure of your information when you use our website, mobile application, and diagnostic services.
            </p>

            <section className="mb-10">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">1. Scope and Consent</h2>
              <p>
                By accessing our services, booking tests, or providing your information, you expressly consent to the collection, storage, and use of your Personal Information and Sensitive Personal Data or Information (SPDI) in accordance with this Privacy Policy and the Information Technology (Reasonable Security Practices and Procedures and Sensitive Personal Data or Information) Rules, 2011.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">2. Information We Collect</h2>
              <p className="mb-4">We collect various types of information to provide accurate diagnostic services:</p>
              <ul className="list-disc pl-6 space-y-2 text-slate-700">
                <li><strong>Personal Identity Information:</strong> Name, age, gender, date of birth.</li>
                <li><strong>Contact Information:</strong> Phone number, email address, physical address for sample collection.</li>
                <li><strong>Health Information (SPDI):</strong> Medical history, doctor prescriptions, test results, diagnostic reports, and other health-related data necessary for processing your tests.</li>
                <li><strong>Technical Data:</strong> IP address, browser type, device identifiers, and usage patterns when you visit our digital platforms.</li>
                <li><strong>Payment Information:</strong> Transaction details. Note: We do not store your full credit/debit card details. Payments are processed by PCI-DSS compliant third-party payment gateways.</li>
              </ul>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">3. How We Use Your Information</h2>
              <ul className="list-disc pl-6 space-y-2 text-slate-700">
                <li>To schedule and perform home sample collections.</li>
                <li>To process samples in our NABL accredited laboratories.</li>
                <li>To generate and deliver diagnostic reports to you.</li>
                <li>To communicate with you regarding appointments, report availability, and service updates.</li>
                <li>To comply with regulatory requirements laid down by medical authorities and the government.</li>
                <li>To improve our services, website functionality, and user experience.</li>
              </ul>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">4. Disclosure of Information</h2>
              <p className="mb-4">
                We maintain strict confidentiality of your information. We do not sell or rent your personal data. However, we may share information in the following limited circumstances:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-slate-700">
                <li><strong>Partner Laboratories:</strong> With our accredited network labs strictly for the purpose of processing your specific tests.</li>
                <li><strong>Service Providers:</strong> With trusted vendors who assist partially in service delivery (e.g., IT support, logistics), bound by strict confidentiality agreements.</li>
                <li><strong>Legal Compliance:</strong> When required by law, court order, or government authority (e.g., notifying communicable diseases to health authorities).</li>
              </ul>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">5. Data Security</h2>
              <p>
                We implement industry-standard technical and organizational security measures to protect your data. This includes encryption of data in transit and at rest, secure access controls, and regular security audits. Our platforms are designed to comply with applicable data protection laws. However, no digital transmission is completely secure, and we urge you to protect your account credentials.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">6. Data Retention</h2>
              <p>
                We retain your personal and medical information for as long as necessary to fulfill the purposes outlined in this policy or as required by medical laws and regulations (e.g., maintaining records for a statutory period).
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">7. Your Rights</h2>
              <p className="mb-4">You have the right to:</p>
              <ul className="list-disc pl-6 space-y-2 text-slate-700">
                <li>Review and access your personal information held by us.</li>
                <li>Request correction of inaccurate or incomplete data.</li>
                <li>Withdraw consent for future data processing (which may result in inability to provide services).</li>
              </ul>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">8. Grievance Officer</h2>
              <p className="mb-4">
                In accordance with the Information Technology Act, 2000 and rules made there under, if you have any grievances regarding your data privacy, please contact our Grievance Officer:
              </p>
              <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
                <p className="font-semibold text-slate-900">Mr. Privacy Officer</p>
                <p className="text-slate-600">Lynk Labs Private Limited</p>
                <p className="text-slate-600">Hyderabad, Telangana, India</p>
                <p className="text-slate-600 mt-2"><strong>Email:</strong> privacy@lynklabs.in</p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">9. Updates to Policy</h2>
              <p>
                We may update this Privacy Policy from time to time to reflect changes in our practices or legal requirements. The updated policy will be posted on this page with the effective date.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}