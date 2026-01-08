import Link from "next/link";

export function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = [
    { name: "Lab Tests", href: "/tests" },
    { name: "Health Packages", href: "/packages" },
    { name: "Track Order", href: "/track-order" },
    { name: "Download Reports", href: "/reports" },
    { name: "Contact Us", href: "/contact" },
    { name: "About Us", href: "/about" },
    { name: "Privacy Policy", href: "/privacy" },
    { name: "Terms of Service", href: "/terms" },
  ];

  return (
    <footer className="bg-gradient-to-r from-primary via-primary/95 to-teal-600 text-white relative overflow-hidden">
      {/* Decorative pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }} />
      </div>

      <div className="container-padding py-10 relative">
        {/* Links Row */}
        <div className="flex flex-wrap justify-center gap-x-8 gap-y-3 mb-8">
          {footerLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="text-white/80 hover:text-white transition-colors text-sm font-medium"
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Trust Indicators */}
        <div className="flex flex-wrap justify-center items-center gap-6 lg:gap-10 mb-8 pb-8 border-b border-white/20">
          <div className="flex items-center space-x-2">
            <div className="w-7 h-7 bg-white/10 rounded-full flex items-center justify-center">
              <span className="text-white text-xs">✓</span>
            </div>
            <span className="text-white/80 text-sm">NABL Accredited</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-7 h-7 bg-white/10 rounded-full flex items-center justify-center">
              <span className="text-white text-xs">🔒</span>
            </div>
            <span className="text-white/80 text-sm">100% Secure</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-7 h-7 bg-white/10 rounded-full flex items-center justify-center">
              <span className="text-white text-xs">⚡</span>
            </div>
            <span className="text-white/80 text-sm">Fast Reports</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-7 h-7 bg-white/10 rounded-full flex items-center justify-center">
              <span className="text-white text-xs">🏠</span>
            </div>
            <span className="text-white/80 text-sm">Home Collection</span>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="text-center mb-6">
          <p className="text-white/60 text-xs leading-relaxed max-w-4xl mx-auto">
            <strong className="text-white/80">Disclaimer:</strong> The information provided on this website is for general informational purposes only and should not be considered as medical advice.
            Test results should be interpreted by a qualified healthcare professional. Lynk Labs is a NABL accredited diagnostic laboratory.
            All sample collection is performed by trained and certified phlebotomists following standard safety protocols.
            For medical emergencies, please consult your physician or visit the nearest hospital immediately.
          </p>
        </div>

        {/* Copyright */}
        <div className="text-center pt-6 border-t border-white/10">
          <p className="text-white/60 text-sm">
            © {currentYear} Lynk Labs. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}