import Link from "next/link";

export default function Brand({ onNavigate, className = "" }) {
    return (
        <Link
            href="/"
            onClick={onNavigate}
            aria-label="WedPlan — Home"
            className={`group inline-flex items-center gap-2.5 rounded-full ${className}`}
        >
            <svg
                aria-hidden="true"
                viewBox="0 0 34 24"
                fill="none"
                className="h-6 w-[34px] shrink-0 text-champagne transition-transform duration-300 ease-out group-hover:-rotate-3"
            >
                <circle cx="12" cy="12" r="9.25" stroke="currentColor" strokeWidth="1.1" />
                <circle cx="22" cy="12" r="9.25" stroke="currentColor" strokeWidth="1.1" />
            </svg>
            <span className="font-display text-[25px] font-medium leading-none tracking-[-0.01em] text-ink">
                Wed<span className="italic">Plan</span>
            </span>
        </Link>
    );
}
