import Link from "next/link";
import HeroIllustration from "./HeroIllustration";

export default function HeroSection() {
    return (
        <section aria-labelledby="hero-heading" className="relative overflow-hidden">
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_90%_at_85%_-10%,rgba(176,141,87,0.16),transparent_62%)]"
            />

            <div className="relative mx-auto grid w-full max-w-7xl gap-12 px-5 py-14 md:px-8 md:py-20 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-16 lg:px-10 lg:py-24">
                <div className="max-w-xl">
                    <p className="flex items-center gap-3 text-[11px] font-medium uppercase tracking-[0.28em] text-champagne">
                        <span aria-hidden="true" className="h-px w-8 bg-champagne/50" />
                        Wedding planning, considered
                    </p>

                    <h1
                        id="hero-heading"
                        className="mt-6 font-display text-[clamp(2.6rem,6vw,4.5rem)] leading-[0.98] tracking-[-0.02em] text-ink"
                    >
                        A beautiful wedding,{" "}
                        <span className="italic text-champagne">planned</span> with care.
                    </h1>

                    <p className="mt-6 max-w-[54ch] text-[15px] leading-relaxed text-ink-soft md:text-base">
                        WedPlan is designed to bring photographers, venues, florists and
                        stylists together in one calm place — so you can compare the
                        details that matter and plan at your own pace.
                    </p>

                    <div className="mt-9 flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-7">
                        <Link
                            href="/services"
                            className="group inline-flex h-12 items-center justify-center gap-3 rounded-full bg-ink px-7 text-xs font-semibold uppercase tracking-[0.18em] text-ivory transition-colors duration-300 hover:bg-champagne"
                        >
                            Explore Wedding Services
                            <ArrowIcon />
                        </Link>

                        <Link
                            href="#featured-services"
                            className="inline-flex h-12 items-center text-xs font-medium uppercase tracking-[0.18em] text-ink-soft transition-colors duration-200 hover:text-champagne"
                        >
                            Featured services
                        </Link>
                    </div>
                </div>

                <div className="relative">
                    <span
                        aria-hidden="true"
                        className="absolute inset-x-8 top-10 bottom-0 rounded-t-[999px] border border-hairline"
                    />
                    <HeroIllustration className="relative mx-auto h-auto w-full max-w-[400px] lg:max-w-[440px]" />
                </div>
            </div>
        </section>
    );
}

function ArrowIcon() {
    return (
        <svg
            aria-hidden="true"
            viewBox="0 0 16 16"
            fill="none"
            className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1"
        >
            <path
                d="M2.5 8h11M9 3.5 13.5 8 9 12.5"
                stroke="currentColor"
                strokeWidth="1.3"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}
