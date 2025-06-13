import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Us - Lynk Labs',
  description: 'Learn about Lynk Labs - Your trusted partner for home-based diagnostic testing services.',
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">About Lynk Labs</h1>
          
          <div className="prose prose-lg max-w-none">
            <p className="text-lg text-gray-600 mb-6">
              Lynk Labs is a leading provider of home-based diagnostic testing services, 
              committed to making healthcare accessible and convenient for everyone.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Our Mission</h2>
            <p className="text-gray-600 mb-6">
              To revolutionize healthcare by bringing laboratory-quality diagnostic testing 
              directly to your doorstep, ensuring accurate results with maximum convenience.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Why Choose Lynk Labs?</h2>
            <ul className="list-disc list-inside text-gray-600 space-y-2 mb-6">
              <li>Home sample collection by certified professionals</li>
              <li>State-of-the-art laboratory facilities</li>
              <li>Quick and accurate test results</li>
              <li>Affordable pricing with transparent billing</li>
              <li>Digital reports delivered securely</li>
              <li>24/7 customer support</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Our Services</h2>
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold text-blue-900 mb-2">Preventive Health Checkups</h3>
                <p className="text-blue-700 text-sm">Comprehensive health packages for early detection</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="font-semibold text-green-900 mb-2">Chronic Disease Monitoring</h3>
                <p className="text-green-700 text-sm">Regular monitoring for diabetes, heart conditions, and more</p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <h3 className="font-semibold text-purple-900 mb-2">Specialized Testing</h3>
                <p className="text-purple-700 text-sm">Advanced tests for specific health concerns</p>
              </div>
              <div className="bg-orange-50 p-4 rounded-lg">
                <h3 className="font-semibold text-orange-900 mb-2">Corporate Wellness</h3>
                <p className="text-orange-700 text-sm">Health screening programs for organizations</p>
              </div>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Contact Us</h3>
              <p className="text-gray-600">
                Have questions? We're here to help! Reach out to our customer support team 
                for any assistance with your health testing needs.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 