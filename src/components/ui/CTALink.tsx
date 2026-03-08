import Link from "next/link";

type CTAVariant = "dark" | "light" | "amber";

interface CTALinkProps {
  href: string;
  children: string;
  variant?: CTAVariant;
  className?: string;
}

export default function CTALink({
  href,
  children,
  variant = "dark",
  className = "",
}: CTALinkProps) {
  return (
    <Link
      href={href}
      className={`cta-link cta-link--${variant} ${className}`.trim()}
    >
      <span className="cta-link__text">{children}</span>
      <svg className="cta-link__symbol" width="5" height="9" viewBox="0 0 7 12" fill="none" aria-hidden="true">
        <path d="M1 1L6 6L1 11" stroke="currentColor" strokeWidth="0.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </Link>
  );
}
