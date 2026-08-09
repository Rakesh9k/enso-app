import Link from 'next/link';

const footerSections = [
  {
    title: 'Product',
    links: [
      { href: '/download', label: 'Download' },
      { href: '/about', label: 'About' },
      { href: '/changelog', label: 'Changelog' },
      { href: '/blog', label: 'Blog' },
    ],
  },
  {
    title: 'Community',
    links: [
      { href: '/partners', label: 'Partner Program' },
      { href: '/partners/apply', label: 'Become a Partner' },
      { href: '/partners/faq', label: 'FAQ' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { href: '/privacy', label: 'Privacy Policy' },
      { href: '/terms', label: 'Terms of Service' },
      { href: '/contact', label: 'Contact' },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-border bg-surface">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <span className="text-lg font-editorial font-semibold text-text-primary">Enso</span>
            <p className="mt-2 text-sm text-text-secondary">
              Your quiet space for self-understanding.
            </p>
          </div>
          {footerSections.map((section) => (
            <div key={section.title}>
              <h3 className="text-sm font-medium text-text-primary mb-3">{section.title}</h3>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-sm text-text-secondary hover:text-text-primary transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-8 pt-8 border-t border-border text-center text-xs text-text-disabled">
          &copy; {new Date().getFullYear()} Enso. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
