
import Link from "next/link";

const navigationLinks = [
    { label: "Home", href: "/" },
    { label: "Browse Services", href: "/services" },
    { label: "Sign In", href: "/sign-in" },
    { label: "Sign Up", href: "/sign-up" },
];

export default function Footer() {
    return (
        <footer className="mt-auto bg-ink text-ivory">
            <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8 lg:px-10 lg:py-16">
                <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-12">
                    {/* Brand and Description */}
                    <div className="sm:col-span-2 lg:col-span-1">
                        <Link
                            href="/"
                            aria-label="WedPlan Home"
                            className="group inline-flex items-center gap-2.5"
                        >
                            <svg
                                aria-hidden="true"
                                viewBox="0 0 34 24"
                                fill="none"
                                className="h-6 w-8.5 shrink-0 text-champagne"
                            >
                                <circle
                                    cx="12"
                                    cy="12"
                                    r="9.25"
                                    stroke="currentColor"
                                    strokeWidth="1.1"
                                />
                                <circle
                                    cx="22"
                                    cy="12"
                                    r="9.25"
                                    stroke="currentColor"
                                    strokeWidth="1.1"
                                />
                            </svg>

                            <span className="font-display text-[25px] font-medium tracking-tight text-white">
                                Wed<span className="italic">Plan</span>
                            </span>
                        </Link>

                        <p className="mt-5 max-w-xs text-sm leading-7 text-ivory/65">
                            Thoughtful wedding planning starts here. Discover
                            trusted vendors and bring your dream celebration
                            to life with WedPlan.
                        </p>
                    </div>

                    {/* Navigation Links */}
                    <div>
                        <h3 className="font-display text-lg font-medium text-white">
                            Explore
                        </h3>

                        <ul className="mt-5 space-y-3">
                            {navigationLinks.map((link) => (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        className="text-sm text-ivory/65 transition-colors duration-200 hover:text-champagne"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>





                    <h1>14</h1>
                    <h1>15</h1>
                    <h1>16</h1>
                    <h1>17</h1>
                    <h1>18</h1>
                    <h1>19</h1>
                    <h1>20</h1>






                    {/* Contact Information */}
                    <div>
                        <h3 className="font-display text-lg font-medium text-white">
                            Get in Touch
                        </h3>

                        <p className="mt-5 text-sm text-ivory/65">
                            Have a question or need assistance? We would love
                            to hear from you.
                        </p>

                        <a
                            href="mailto:mdrimonkhan765@gmail.com"
                            className="mt-4 inline-block break-all text-sm text-champagne transition-colors duration-200 hover:text-white"
                        >
                            mdrimonkhan765@gmail.com
                        </a>
                    </div>

                    {/* Social Links */}
                    <div>
                        <h3 className="font-display text-lg font-medium text-white">
                            Follow Us
                        </h3>

                        <p className="mt-5 text-sm leading-7 text-ivory/65">
                            Stay connected and follow our journey.
                        </p>

                        <div className="mt-5 flex items-center gap-3">
                            <a
                                href="https://www.facebook.com/rimon.khan.512539/"
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="Visit WedPlan on Facebook"
                                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-ivory/75 transition-all duration-200 hover:border-champagne hover:bg-champagne hover:text-ink"
                            >
                                <svg
                                    aria-hidden="true"
                                    viewBox="0 0 24 24"
                                    fill="currentColor"
                                    className="h-5 w-5"
                                >
                                    <path d="M13.5 21v-8.2h2.75l.41-3.2H13.5V7.56c0-.93.26-1.56 1.6-1.56h1.7V3.14c-.3-.04-1.32-.14-2.5-.14-2.48 0-4.18 1.52-4.18 4.3V9.6H7.5v3.2h2.62V21h3.38Z" />
                                </svg>
                            </a>

                            <a
                                href="https://www.instagram.com/rimonnnnnnnnn/"
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="Visit WedPlan on Instagram"
                                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-ivory/75 transition-all duration-200 hover:border-champagne hover:bg-champagne hover:text-ink"
                            >
                                <svg
                                    aria-hidden="true"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="1.7"
                                    className="h-5 w-5"
                                >
                                    <rect
                                        x="3"
                                        y="3"
                                        width="18"
                                        height="18"
                                        rx="5"
                                    />
                                    <circle cx="12" cy="12" r="4" />
                                    <circle
                                        cx="17.5"
                                        cy="6.5"
                                        r="1"
                                        fill="currentColor"
                                        stroke="none"
                                    />
                                </svg>
                            </a>
                        </div>
                    </div>
                </div>

                {/* Copyright */}
                <div className="mt-12 border-t border-white/10 pt-6">
                    <p className="text-center text-xs leading-6 text-ivory/50">
                        © {new Date().getFullYear()} WedPlan. All rights
                        reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
}
