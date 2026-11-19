import Link from "next/link";

const exploreLinks = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Browse Services" },
  { href: "/sign-in", label: "Sign In" },
  { href: "/sign-up", label: "Sign Up" },
];

const socialLinks = [
  { href: "https://facebook.com", label: "Facebook" },
  { href: "https://instagram.com", label: "Instagram" },
  { href: "https://youtube.com", label: "YouTube" },
];

export default function Footer() {
  return (
    <footer className="bg-[#2b2326] text-[#f3eae4]">
      <div className="mx-auto max-w-6xl px-6 py-14">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-3">
            <p className="font-display text-3xl font-bold leading-none">
              Wed<span className="text-[#e9b7c2]">Plan</span>
            </p>
            <p className="text-sm text-[#d6c9c9]">
              A wedding planning platform that connects couples with trusted
              wedding vendors.
            </p>
          </div>

          <div>
            <p className="mb-3 font-semibold">Explore</p>
            <ul className="space-y-2 text-sm text-[#d6c9c9]">
              {exploreLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="hover:text-white">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="mb-3 font-semibold">Contact</p>
            <ul className="space-y-2 text-sm text-[#d6c9c9]">
              <li>hello@wedplan.example</li>
              <li>+880 1XXX-XXXXXX</li>
              <li>Dhaka, Bangladesh</li>
            </ul>
          </div>

          <div>
            <p className="mb-3 font-semibold">Follow us</p>
            <ul className="space-y-2 text-sm text-[#d6c9c9]">
              {socialLinks.map((link) => (
                <li key={link.label}>
                  <a href={link.href} target="_blank" rel="noreferrer" className="hover:text-white">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-[#4a3f43] pt-6 text-sm text-[#d6c9c9]">
          &copy; {new Date().getFullYear()} WedPlan. All rights reserved.
        </div>
      </div>
    </footer>
  );
}