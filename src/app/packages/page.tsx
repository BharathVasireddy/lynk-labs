import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Test Packages - Lynk Labs',
  description: 'Explore our comprehensive health test packages designed for different health needs.',
};

export default function PackagesPage() {
  const packages = [
    {
      name: 'Basic Health Checkup',
      price: 999,
      originalPrice: 1299,
      tests: ['Complete Blood Count (CBC)', 'Blood Sugar (Fasting)', 'Lipid Profile', 'Liver Function Test'],
      description: 'Essential tests for general health monitoring',
      popular: false,
    },
    {
      name: 'Comprehensive Health Package',
      price: 2499,
      originalPrice: 3199,
      tests: ['CBC', 'Diabetes Panel', 'Lipid Profile', 'LFT', 'KFT', 'Thyroid Profile', 'Vitamin D', 'Vitamin B12'],
      description: 'Complete health assessment with key vitamins',
      popular: true,
    },
    {
      name: 'Diabetes Monitoring Package',
      price: 799,
      originalPrice: 999,
      tests: ['HbA1c', 'Fasting Blood Sugar', 'Post Prandial Sugar', 'Urine Routine'],
      description: 'Specialized package for diabetes management',
      popular: false,
    },
    {
      name: 'Heart Health Package',
      price: 1299,
      originalPrice: 1699,
      tests: ['Lipid Profile', 'Troponin I', 'ECG', 'CBC'],
      description: 'Comprehensive cardiovascular health assessment',
      popular: false,
    },
    {
      name: 'Women\'s Health Package',
      price: 1899,
      originalPrice: 2399,
      tests: ['CBC', 'Thyroid Profile', 'Iron Studies', 'Vitamin D', 'CA 125', 'Pap Smear'],
      description: 'Specialized health screening for women',
      popular: false,
    },
    {
      name: 'Senior Citizen Package',
      price: 2999,
      originalPrice: 3899,
      tests: ['CBC', 'Diabetes Panel', 'Lipid Profile', 'LFT', 'KFT', 'Thyroid', 'PSA', 'Vitamin D', 'ECG'],
      description: 'Comprehensive health package for seniors',
      popular: false,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Health Test Packages</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Choose from our carefully curated health packages designed to meet your specific health needs
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {packages.map((pkg, index) => (
            <div
              key={index}
              className={`bg-white rounded-lg shadow-sm border-2 p-6 relative ${
                pkg.popular ? 'border-blue-500' : 'border-gray-200'
              }`}
            >
              {pkg.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{pkg.name}</h3>
                <p className="text-gray-600 text-sm mb-4">{pkg.description}</p>
                
                <div className="flex items-center justify-center space-x-2">
                  <span className="text-3xl font-bold text-blue-600">₹{pkg.price}</span>
                  <span className="text-lg text-gray-500 line-through">₹{pkg.originalPrice}</span>
                </div>
                <p className="text-green-600 text-sm font-medium">
                  Save ₹{pkg.originalPrice - pkg.price}
                </p>
              </div>

              <div className="mb-6">
                <h4 className="font-semibold text-gray-900 mb-3">Includes:</h4>
                <ul className="space-y-2">
                  {pkg.tests.map((test, testIndex) => (
                    <li key={testIndex} className="flex items-start">
                      <svg className="w-4 h-4 text-green-500 mt-0.5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span className="text-sm text-gray-600">{test}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <button className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors">
                Book Now
              </button>
            </div>
          ))}
        </div>

        <div className="mt-12 bg-white rounded-lg shadow-sm p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Why Choose Our Packages?</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Curated by Experts</h3>
              <p className="text-gray-600 text-sm">Packages designed by healthcare professionals</p>
            </div>
            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Cost Effective</h3>
              <p className="text-gray-600 text-sm">Save up to 30% compared to individual tests</p>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Comprehensive</h3>
              <p className="text-gray-600 text-sm">Complete health assessment in one package</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 