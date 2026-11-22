import { Suspense } from "react";
import Link from "next/link";
import Reveal from "@/components/ui/Reveal";
import ServiceCard from "@/components/services/ServiceCard";
import { getFeaturedServices, SERVICE_DATA_STATUS } from "@/lib/services";

export default function FeaturedServices() {
    return (
        <section
            id="featured-services"
            aria-labelledby="featured-services-heading"
            className="scroll-mt-20 border-t border-hairline bg-ivory md:scroll-mt-24"
        >
            <div className="mx-auto w-full max-w-7xl px-5 py-16 md:px-8 md:py-20 lg:px-10 lg:py-24">
                <header className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between md:gap-10">
                    <div className="max-w-xl">
                        <p className="text-[10px] font-medium uppercase tracking-[0.28em] text-champagne">
                            Featured services
                        </p>
                        <h2
                            id="featured-services-heading"
                            className="mt-4 font-display text-[clamp(2rem,3.6vw,3rem)] leading-[1.05] tracking-[-0.015em] text-ink"
                        >
                            Wedding services worth exploring.
                        </h2>
                        <p className="mt-4 text-[15px] leading-relaxed text-ink-soft">
                            A place to explore wedding services, with the details you
                            need to compare at a glance.
                        </p>
                    </div>

                    <Link
                        href="/services"
                        className="group inline-flex shrink-0 items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-ink transition-colors duration-200 hover:text-champagne"
                    >
                        View all services
                        <ArrowIcon />
                    </Link>
                </header>

                <div className="mt-10 lg:mt-14">
                    <Suspense fallback={<FeaturedServicesSkeleton />}>
                        <FeaturedServicesGrid />
                    </Suspense>
                </div>
            </div>
        </section>
    );
}

async function FeaturedServicesGrid() {
    const { services, status } = await getFeaturedServices();

    if (status === SERVICE_DATA_STATUS.UNAVAILABLE) {
        return (
            <FeaturedServicesNotice
                tone="waiting"
                title="Featured services are on the way"
                description="Vendor listings will appear here as soon as the service catalogue is connected. You can still browse the categories above."
                action={
                    <Link
                        href="/services"
                        className="inline-flex h-11 items-center justify-center rounded-full bg-ink px-6 text-[10px] font-semibold uppercase tracking-[0.18em] text-ivory transition-colors duration-200 hover:bg-champagne"
                    >
                        Browse all services
                    </Link>
                }
            />
        );
    }

    if (status === SERVICE_DATA_STATUS.ERROR) {
        return (
            <FeaturedServicesNotice
                tone="error"
                title="We couldn't load featured services"
                description="The service catalogue didn't respond. Browse all services instead."
                action={
                    <Link
                        href="/services"
                        className="inline-flex h-11 items-center justify-center rounded-full border border-hairline px-6 text-[10px] font-semibold uppercase tracking-[0.18em] text-ink transition-colors duration-200 hover:border-champagne hover:text-champagne"
                    >
                        Browse all services
                    </Link>
                }
            />
        );
    }

    if (services.length === 0) {
        return (
            <FeaturedServicesNotice
                tone="waiting"
                title="No featured services yet"
                description="There are no approved services to show right now. Check back soon, or browse the categories above."
                action={
                    <Link
                        href="/services"
                        className="inline-flex h-11 items-center justify-center rounded-full border border-hairline px-6 text-[10px] font-semibold uppercase tracking-[0.18em] text-ink transition-colors duration-200 hover:border-champagne hover:text-champagne"
                    >
                        Browse all services
                    </Link>
                }
            />
        );
    }

    return (
        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
            {services.map((service, index) => (
                <Reveal as="li" key={service.id} delay={index * 0.06} className="h-full">
                    <ServiceCard service={service} />
                </Reveal>
            ))}
        </ul>
    );
}

function FeaturedServicesSkeleton() {
    return (
        <div>
            <p className="sr-only">Loading featured services…</p>
            <div
                aria-hidden="true"
                className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6"
            >
                {Array.from({ length: 6 }).map((_, index) => (
                    <div
                        key={index}
                        className="flex h-full flex-col overflow-hidden rounded-[20px] border border-hairline bg-white/40"
                    >
                        <div className="aspect-[4/5] w-full animate-pulse bg-ivory-deep" />
                        <div className="flex flex-1 flex-col p-5">
                            <div className="h-5 w-3/4 animate-pulse rounded-full bg-ivory-deep" />
                            <div className="mt-4 h-3 w-1/2 animate-pulse rounded-full bg-ivory-deep" />
                            <div className="mt-2 h-3 w-2/5 animate-pulse rounded-full bg-ivory-deep" />
                            <div className="mt-auto pt-6">
                                <div className="border-t border-hairline pt-4">
                                    <div className="h-3 w-1/3 animate-pulse rounded-full bg-ivory-deep" />
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

function FeaturedServicesNotice({ tone, title, description, action }) {
    const isError = tone === "error";

    return (
        <div className="rounded-[20px] border border-hairline bg-white/50 px-6 py-12 text-center md:px-10 md:py-16">
            <span
                aria-hidden="true"
                className={`mx-auto grid size-12 place-items-center rounded-full border ${
                    isError
                        ? "border-[#a4553f]/30 text-[#a4553f]"
                        : "border-champagne/35 text-champagne"
                }`}
            >
                {isError ? <AlertIcon /> : <RingsIcon />}
            </span>

            <h3 className="mt-5 font-display text-[24px] leading-snug text-ink">
                {title}
            </h3>
            <p className="mx-auto mt-2 max-w-[46ch] text-[13px] leading-relaxed text-muted">
                {description}
            </p>

            {action ? <div className="mt-7 flex justify-center">{action}</div> : null}
        </div>
    );
}

function RingsIcon() {
    return (
        <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
            <circle cx="9.5" cy="12" r="6" stroke="currentColor" strokeWidth="1.2" />
            <circle cx="14.5" cy="12" r="6" stroke="currentColor" strokeWidth="1.2" />
        </svg>
    );
}

function AlertIcon() {
    return (
        <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
            <circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="1.2" />
            <path
                d="M12 8v4.5M12 15.5v.5"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="round"
            />
        </svg>
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
