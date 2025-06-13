import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'My Reports - Lynk Labs',
  description: 'Access and download your test reports from Lynk Labs.',
};

export default function ReportsPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">My Test Reports</h1>
          
          <div className="mb-8">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-blue-800">
                Please log in to view your test reports. All reports are delivered digitally and securely.
              </p>
            </div>
          </div>

          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No reports available</h3>
            <p className="mt-1 text-sm text-gray-500">
              Log in to view your test reports or book a new test.
            </p>
            <div className="mt-6 flex justify-center space-x-4">
              <a
                href="/login"
                className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
              >
                Login
              </a>
              <a
                href="/tests"
                className="bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700"
              >
                Browse Tests
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 