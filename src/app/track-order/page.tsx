import { Metadata } from 'next';
import Link from 'next/link';
import { Search, Package, Mail, ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Track Order - Lynk Labs',
  description: 'Track your test order status and get real-time updates on your diagnostic tests.',
};



export default function TrackOrderPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Hero Section */}
      <section className="relative py-16 lg:py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/95 to-teal-600" />
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
            backgroundSize: '40px 40px'
          }} />
        </div>

        <div className="container-padding relative">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full mb-6">
              <Search className="w-4 h-4 text-white" />
              <span className="text-sm font-medium text-white">Order Tracking</span>
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
              Track Your Order
            </h1>
            <p className="text-lg text-white/80 max-w-xl mx-auto">
              Enter your order number to get real-time updates on your diagnostic tests
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="container-padding -mt-8 relative z-10 pb-20">
        <div className="max-w-4xl mx-auto">
          {/* Track Order Card */}
          <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-8 mb-12">
            <div className="max-w-md mx-auto">
              <h2 className="text-xl font-bold text-slate-900 mb-6 text-center">Enter Your Order Number</h2>
              <form className="space-y-4">
                <div>
                  <label htmlFor="orderNumber" className="block text-sm font-medium text-slate-700 mb-2">
                    Order Number
                  </label>
                  <div className="relative">
                    <Package className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
                    <input
                      type="text"
                      id="orderNumber"
                      className="w-full pl-12 pr-4 py-4 rounded-xl border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-lg"
                      placeholder="e.g., LNK001"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-primary to-teal-600 hover:from-primary/90 hover:to-teal-600/90 text-white py-4 px-6 rounded-xl font-semibold text-lg shadow-lg shadow-primary/25 transition-all flex items-center justify-center gap-2"
                >
                  Track Order
                  <ArrowRight className="h-5 w-5" />
                </button>
              </form>

              <p className="text-center text-sm text-slate-500 mt-4">
                You can find your order number in the confirmation email
              </p>
            </div>
          </div>



          {/* Need Help Section */}
          <div className="bg-gradient-to-r from-primary/5 to-teal-500/5 rounded-2xl p-8 border border-primary/10">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="flex-1 text-center md:text-left">
                <h3 className="text-xl font-bold text-slate-900 mb-2">Need Help?</h3>
                <p className="text-slate-600">
                  If you&apos;re having trouble tracking your order or have any questions, our support team is here to help.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-primary to-teal-600 text-white py-3 px-6 rounded-xl font-semibold shadow-lg shadow-primary/25 hover:shadow-xl transition-all"
                >
                  <Mail className="h-5 w-5" />
                  Contact Support
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}