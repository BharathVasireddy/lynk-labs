import Link from "next/link";
import { Phone, Mail, MapPin, Facebook, Twitter, Instagram, Linkedin } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  const footerSections = [
    {
      title: "Services",
      links: [
        { name: "Lab Tests", href: "/tests" },
        { name: "Health Packages", href: "/packages" },
        { name: "Home Collection", href: "/home-collection" },
        { name: "Corporate Health", href: "/corporate" },
      ],
    },
    {
      title: "Support",
      links: [
        { name: "Track Order", href: "/track-order" },
        { name: "Download Reports", href: "/reports" },
        { name: "Help Center", href: "/help" },
        { name: "Contact Us", href: "/contact" },
      ],
    },
    {
      title: "Company",
      links: [
        { name: "About Us", href: "/about" },
        { name: "Careers", href: "/careers" },
        { name: "Press", href: "/press" },
        { name: "Blog", href: "/blog" },
      ],
    },
    {
      title: "Legal",
      links: [
        { name: "Privacy Policy", href: "/privacy" },
        { name: "Terms of Service", href: "/terms" },
        { name: "Refund Policy", href: "/refund" },
        { name: "NABL Accreditation", href: "/accreditation" },
      ],
    },
  ];

  const socialLinks = [
    { name: "Facebook", href: "#", icon: Facebook },
    { name: "Twitter", href: "#", icon: Twitter },
    { name: "Instagram", href: "#", icon: Instagram },
    { name: "LinkedIn", href: "#", icon: Linkedin },
  ];

  return (
    <footer className="bg-muted/50 border-t">
      <div className="container-padding py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center space-x-2 mb-4">
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-lg">L</span>
              </div>
              <span className="font-bold text-xl">Lynk Labs</span>
            </Link>
            <p className="text-muted-foreground mb-4 max-w-sm">
              Your trusted partner for comprehensive diagnostic testing services. 
              Accurate results, convenient home collection, and expert care.
            </p>
            
            {/* Contact Info */}
            <div className="space-y-2 text-sm">
              <div className="flex items-center space-x-2 text-muted-foreground">
                <Phone className="h-4 w-4" />
                <span>+91 1800-123-4567</span>
              </div>
              <div className="flex items-center space-x-2 text-muted-foreground">
                <Mail className="h-4 w-4" />
                <span>support@lynklabs.com</span>
              </div>
              <div className="flex items-center space-x-2 text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>Available in 100+ cities across India</span>
              </div>
            </div>
          </div>

          {/* Footer Links */}
          {footerSections.map((section) => (
            <div key={section.title}>
              <h3 className="font-semibold mb-4">{section.title}</h3>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Section */}
        <div className="border-t mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <div className="text-sm text-muted-foreground mb-4 md:mb-0">
            © {currentYear} Lynk Labs. All rights reserved. | NABL Accredited Lab
          </div>
          
          {/* Social Links */}
          <div className="flex items-center space-x-4">
            {socialLinks.map((social) => {
              const Icon = social.icon;
              return (
                <Link
                  key={social.name}
                  href={social.href}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                  aria-label={social.name}
                >
                  <Icon className="h-5 w-5" />
                </Link>
              );
            })}
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="border-t mt-8 pt-8">
          <div className="flex flex-wrap justify-center items-center gap-8 text-sm text-muted-foreground">
            <div className="flex items-center space-x-2">
              <div className="h-6 w-6 rounded-full bg-green-500 flex items-center justify-center">
                <span className="text-white text-xs">✓</span>
              </div>
              <span>NABL Accredited</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="h-6 w-6 rounded-full bg-blue-500 flex items-center justify-center">
                <span className="text-white text-xs">🔒</span>
              </div>
              <span>100% Secure</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="h-6 w-6 rounded-full bg-purple-500 flex items-center justify-center">
                <span className="text-white text-xs">⚡</span>
              </div>
              <span>Fast Reports</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="h-6 w-6 rounded-full bg-orange-500 flex items-center justify-center">
                <span className="text-white text-xs">🏠</span>
              </div>
              <span>Home Collection</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
} 