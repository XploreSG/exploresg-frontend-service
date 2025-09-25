import { APP_CONFIG } from "../../config/constants";

interface FooterLink {
  label: string;
  href: string;
}

const footerLinks: FooterLink[] = [
  { label: "Privacy", href: "/privacy" },
  { label: "Terms", href: "/terms" },
];

const Footer = () => {
  return (
    <footer className="mt-auto bg-gray-900 px-6 py-4 text-sm text-white">
      <div className="flex items-center justify-between">
        <span>{APP_CONFIG.copyright}</span>
        <nav className="space-x-2">
          {footerLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="transition-colors hover:text-orange-500"
            >
              {link.label}
            </a>
          ))}
        </nav>
      </div>
    </footer>
  );
};

export default Footer;
