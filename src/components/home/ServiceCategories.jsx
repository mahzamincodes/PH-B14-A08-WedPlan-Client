import Link from "next/link";
import Reveal from "@/components/ui/Reveal";

const serviceCategories = [
    {
        slug: "photography-videography",
        name: "Photography & Videography",
        description: "Photographers and filmmakers who capture the day as it felt.",
        icon: "camera",
    },
    {
        slug: "wedding-venues",
        name: "Wedding Venues",
        description: "Gardens, halls and intimate spaces for ceremony and reception.",
        icon: "venue",
    },
    {
        slug: "decoration-florist",
        name: "Decoration & Florist",
        description: "Florals, styling and décor that set the tone of the celebration.",
        icon: "flower",
    },
    {
        slug: "catering-services",
        name: "Catering Services",
        description: "Menus and catering teams for every guest count and palate.",
        icon: "catering",
    },
    {
        slug: "makeup-styling",
        name: "Makeup & Styling",
        description: "Bridal makeup and hair styling for the couple and the party.",
        icon: "styling",
    },
    {
        slug: "wedding-fashion",
        name: "Wedding Fashion",
        description: "Bridal wear, suits and accessories for the wedding day.",
        icon: "fashion",
    },
];

export default function ServiceCategories() {
    return (
        <section
            id="categories"
            aria-labelledby="categories-heading"
            className="scroll-mt-20 border-t border-hairline bg-ivory-deep/50 md:scroll-mt-24"
        >
            <div className="mx-auto w-full max-w-7xl px-5 py-16 md:px-8 md:py-20 lg:px-10 lg:py-24">
                <header className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between md:gap-10">
                    <div className="max-w-xl">
                        <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-champagne">
                            Browse by category
                        </p>
                        <h2
                            id="categories-heading"
                            className="mt-4 font-display text-[clamp(2rem,3.6vw,3rem)] leading-[1.05] tracking-[-0.015em] text-ink"
                        >
                            Every detail, in its place.
                        </h2>
                        <p className="mt-4 text-[15px] leading-relaxed text-ink-soft">
                            Six categories, one considered place to start.
                        </p>
                    </div>

                    <Link
                        href="/services"
                        className="group inline-flex shrink-0 items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-ink transition-colors duration-200 hover:text-champagne"
                    >
                        View all services
                        <ArrowIcon />
                    </Link>
                </header>

                <ul className="mt-10 grid gap-3 sm:grid-cols-2 lg:mt-14 lg:grid-cols-3 lg:gap-4">
                    {serviceCategories.map((category, index) => (
                        <Reveal as="li" key={category.slug} delay={index * 0.05} className="h-full">
                            <Link
                                href={{
                                    pathname: "/services",
                                    query: { category: category.name },
                                }}
                                className="group flex h-full items-start gap-4 rounded-2xl border border-hairline bg-ivory/70 p-5 transition-colors duration-300 hover:border-champagne/45 hover:bg-ivory"
                            >
                                <span
                                    aria-hidden="true"
                                    className="grid size-11 shrink-0 place-items-center rounded-full border border-champagne/35 text-champagne"
                                >
                                    <CategoryIcon name={category.icon} />
                                </span>

                                <span className="min-w-0 flex-1">
                                    <span className="block font-display text-[21px] leading-snug text-ink">
                                        {category.name}
                                    </span>
                                    <span className="mt-1 block text-[14px] leading-relaxed text-muted">
                                        {category.description}
                                    </span>
                                </span>

                                <ChevronIcon className="mt-1 h-4 w-4 shrink-0 text-muted transition-transform duration-300 group-hover:translate-x-0.5 group-hover:text-champagne" />
                            </Link>
                        </Reveal>
                    ))}
                </ul>
            </div>
        </section>
    );
}

function CategoryIcon({ name }) {
    const shared = {
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: 1.2,
        strokeLinecap: "round",
        strokeLinejoin: "round",
        "aria-hidden": true,
        className: "h-5 w-5",
    };

    switch (name) {
        case "camera":
            return (
                <svg {...shared}>
                    <rect x="3" y="7" width="18" height="12" rx="2.5" />
                    <path d="M8.5 7 10 4.5h4L15.5 7" />
                    <circle cx="12" cy="13" r="3.2" />
                </svg>
            );
        case "venue":
            return (
                <svg {...shared}>
                    <path d="M4 20V10a8 8 0 0 1 16 0v10" />
                    <path d="M8.5 20v-9.5a3.5 3.5 0 0 1 7 0V20" />
                    <path d="M2.5 20h19" />
                </svg>
            );
        case "flower":
            return (
                <svg {...shared}>
                    <circle cx="12" cy="9" r="2.2" />
                    <path d="M12 6.8c0-1.6 1-2.8 2.4-2.8s2.4 1.3 2.4 3c0 1.4-1 2.2-2.2 2.2M12 11.2c0 1.6-1 2.8-2.4 2.8S7.2 12.7 7.2 11c0-1.4 1-2.2 2.2-2.2" />
                    <path d="M12 14v6.5" />
                    <path d="M12 17.5c-1.8 0-3-1-3-2.4 1.1-.9 3-.6 3 2.4ZM12 19.5c1.8 0 3-1 3-2.4-1.1-.9-3-.6-3 2.4Z" />
                </svg>
            );
        case "catering":
            return (
                <svg {...shared}>
                    <circle cx="12" cy="13" r="6.5" />
                    <circle cx="12" cy="13" r="2.8" />
                    <path d="M7 4v5M10 4v5M8.5 4v9" />
                </svg>
            );
        case "styling":
            return (
                <svg {...shared}>
                    <path d="M9 20V9.5l3-4 3 4V20" />
                    <path d="M9 13.5h6" />
                    <path d="M7 20h10" />
                </svg>
            );
        case "fashion":
            return (
                <svg {...shared}>
                    <path d="M10 4.5 12 7l2-2.5" />
                    <path d="M9.5 6.5 6 9l1.5 4L10 12l-1 8h6l-1-8 2.5 1L18 9l-3.5-2.5" />
                </svg>
            );
        default:
            return null;
    }
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

function ChevronIcon({ className = "" }) {
    return (
        <svg aria-hidden="true" viewBox="0 0 16 16" fill="none" className={className}>
            <path
                d="M6 3.5 10.5 8 6 12.5"
                stroke="currentColor"
                strokeWidth="1.3"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}
