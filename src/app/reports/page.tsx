import { Metadata } from 'next';
import Link from 'next/link';
import { FileText, ArrowRight, Lock } from 'lucide-react';

export const metadata: Metadata = {
  title: 'My Reports - Lynk Labs',
  description: 'Access and download your test reports from Lynk Labs.',
};


export default function ReportsPage() {
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
              <FileText className="w-4 h-4 text-white" />
              <span className="text-sm font-medium text-white">Download Reports</span>
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
              My Test Reports
            </h1>
            <p className="text-lg text-white/80 max-w-xl mx-auto">
              Access and download your diagnostic test reports securely
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="container-padding -mt-8 relative z-10 pb-20">
        <div className="max-w-3xl mx-auto">
          {/* Login Prompt Card */}
          <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-8 mb-10">
            <div className="text-center py-8">
              <div className="w-20 h-20 bg-gradient-to-br from-primary/10 to-teal-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Lock className="w-10 h-10 text-primary" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-3">Login to View Reports</h2>
              <p className="text-slate-600 mb-8 max-w-md mx-auto">
                Please log in to your account to access and download your test reports. All reports are delivered digitally and stored securely.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/auth/login"
                  className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-primary to-teal-600 hover:from-primary/90 hover:to-teal-600/90 text-white py-4 px-8 rounded-xl font-semibold shadow-lg shadow-primary/25 transition-all"
                >
                  Login to Account
                  <ArrowRight className="h-5 w-5" />
                </Link>
                <Link
                  href="/tests"
                  className="inline-flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 py-4 px-8 rounded-xl font-semibold transition-all"
                >
                  Browse Tests
                </Link>
              </div>
            </div>
          </div>


        </div>
      </div>
    </div>
  );
}