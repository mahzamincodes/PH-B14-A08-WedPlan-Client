/**
 * Original, locally authored wedding illustration for the home page hero.
 *
 * Pure vector: no external references, no raster images and no licensed assets.
 * Marked as decorative so assistive technology reads the hero copy only.
 */
export default function HeroIllustration({ className = "" }) {
    return (
        <svg
            viewBox="0 0 720 900"
            aria-hidden="true"
            focusable="false"
            className={className}
        >
            <defs>
                <linearGradient id="wedplan-hero-arch" x1="0.5" y1="0" x2="0.5" y2="1">
                    <stop
                        offset="0%"
                        style={{ stopColor: "var(--color-champagne)", stopOpacity: 0.24 }}
                    />
                    <stop
                        offset="100%"
                        style={{ stopColor: "var(--color-ivory)", stopOpacity: 0.95 }}
                    />
                </linearGradient>
            </defs>

            {/* Outer arch */}
            <path
                d="M72 840V330a288 288 0 0 1 576 0v510Z"
                className="fill-ivory-deep"
            />

            {/* Inner arch, light entering from above */}
            <path
                d="M106 840V330a254 254 0 0 1 508 0v510Z"
                fill="url(#wedplan-hero-arch)"
            />
            <path
                d="M106 840V330a254 254 0 0 1 508 0v510"
                fill="none"
                strokeWidth="1.5"
                className="stroke-hairline"
            />

            {/* Light disc */}
            <circle cx="360" cy="236" r="58" className="fill-champagne" fillOpacity="0.14" />

            {/* Interlocking rings */}
            <circle
                cx="322"
                cy="470"
                r="76"
                fill="none"
                strokeWidth="2.4"
                className="stroke-champagne"
            />
            <circle
                cx="398"
                cy="470"
                r="76"
                fill="none"
                strokeWidth="2.4"
                className="stroke-champagne"
            />
            <path
                d="M322 376l9 10-9 10-9-10Z"
                className="fill-champagne"
                fillOpacity="0.85"
            />

            {/* Botanical stems */}
            <g
                fill="none"
                strokeWidth="2"
                className="stroke-champagne"
                strokeOpacity="0.5"
                strokeLinecap="round"
            >
                <path d="M168 840c28-64-12-114 22-172" />
                <path d="M552 840c-28-64 12-114-22-172" />
            </g>

            <g className="fill-champagne" fillOpacity="0.18">
                <ellipse cx="188" cy="762" rx="5" ry="15" transform="rotate(35 188 762)" />
                <ellipse cx="166" cy="726" rx="5" ry="14" transform="rotate(-30 166 726)" />
                <ellipse cx="186" cy="690" rx="4.5" ry="13" transform="rotate(40 186 690)" />
                <ellipse cx="532" cy="762" rx="5" ry="15" transform="rotate(-35 532 762)" />
                <ellipse cx="554" cy="726" rx="5" ry="14" transform="rotate(30 554 726)" />
                <ellipse cx="534" cy="690" rx="4.5" ry="13" transform="rotate(-40 534 690)" />
            </g>

            {/* Fine details */}
            <g className="fill-champagne" fillOpacity="0.55">
                <path d="M215 420v16M207 428h16" strokeWidth="1" className="stroke-champagne" />
                <path d="M505 380v12M499 386h12" strokeWidth="1" className="stroke-champagne" />
                <path d="M215 690v12M209 696h12" strokeWidth="1" className="stroke-champagne" />
                <path d="M505 726v12M499 732h12" strokeWidth="1" className="stroke-champagne" />
            </g>

            <g className="fill-champagne" fillOpacity="0.4">
                <circle cx="48" cy="800" r="3" />
                <circle cx="672" cy="760" r="2.5" />
                <circle cx="672" cy="196" r="2" />
                <circle cx="48" cy="236" r="2" />
            </g>

            {/* Baseline */}
            <path
                d="M300 868h120"
                strokeWidth="1.5"
                className="stroke-hairline"
                fill="none"
            />
        </svg>
    );
}
