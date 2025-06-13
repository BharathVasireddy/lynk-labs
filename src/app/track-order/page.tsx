import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Track Order - Lynk Labs',
  description: 'Track your test order status and get real-time updates on your diagnostic tests.',
};

export default function TrackOrderPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Track Your Order</h1>
          
          <div className="mb-8">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-blue-800">
                Enter your order number or phone number to track your test order status.
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Track by Order Number</h2>
              <form className="space-y-4">
                <div>
                  <label htmlFor="orderNumber" className="block text-sm font-medium text-gray-700">
                    Order Number
                  </label>
                  <input
                    type="text"
                    id="orderNumber"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    placeholder="e.g., LNK001"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Track Order
                </button>
              </form>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Track by Phone Number</h2>
              <form className="space-y-4">
                <div>
                  <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phoneNumber"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    placeholder="+91 99999 99999"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                >
                  Track by Phone
                </button>
              </form>
            </div>
          </div>

          <div className="mt-12">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Order Status Guide</h2>
            <div className="space-y-4">
              <div className="flex items-center space-x-4 p-4 bg-yellow-50 rounded-lg">
                <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold text-sm">1</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Order Confirmed</h3>
                  <p className="text-gray-600 text-sm">Your order has been received and confirmed</p>
                </div>
              </div>

              <div className="flex items-center space-x-4 p-4 bg-blue-50 rounded-lg">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold text-sm">2</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Home Visit Scheduled</h3>
                  <p className="text-gray-600 text-sm">Our agent will visit you at the scheduled time</p>
                </div>
              </div>

              <div className="flex items-center space-x-4 p-4 bg-purple-50 rounded-lg">
                <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold text-sm">3</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Sample Collected</h3>
                  <p className="text-gray-600 text-sm">Your sample has been collected and sent to lab</p>
                </div>
              </div>

              <div className="flex items-center space-x-4 p-4 bg-orange-50 rounded-lg">
                <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold text-sm">4</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Under Processing</h3>
                  <p className="text-gray-600 text-sm">Your sample is being analyzed in our laboratory</p>
                </div>
              </div>

              <div className="flex items-center space-x-4 p-4 bg-green-50 rounded-lg">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold text-sm">5</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Report Ready</h3>
                  <p className="text-gray-600 text-sm">Your test report is ready and will be delivered soon</p>
                </div>
              </div>

              <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                <div className="w-8 h-8 bg-gray-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold text-sm">✓</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Completed</h3>
                  <p className="text-gray-600 text-sm">Your report has been delivered successfully</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 bg-gray-50 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Need Help?</h3>
            <p className="text-gray-600 mb-4">
              If you're having trouble tracking your order or have any questions, our customer support team is here to help.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href="/contact"
                className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 text-center"
              >
                Contact Support
              </a>
              <a
                href="tel:+919999999999"
                className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 text-center"
              >
                Call +91 99999 99999
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 