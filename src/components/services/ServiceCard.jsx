
import Image from "next/image";
import Link from "next/link";

export default function ServiceCard({ service }) {
    const {
        id,
        name,
        category,
        priceLabel,
        location,
        vendor,
        image,
    } = service;

    const href = id ? `/services/${id}` : "/services";
    const vendorName = vendor?.name?.trim();

    return (
        <article className="group flex h-full flex-col overflow-hidden rounded-[20px] border border-hairline bg-white/50 transition-colors duration-300 hover:border-champagne/40 hover:bg-white/80">
            <div className="relative aspect-4/5 w-full overflow-hidden bg-ivory-deep">
                {image ? (
                    <Image
                        src={image}
                        alt={name || "Wedding service"}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                ) : (
                    <div
                        aria-hidden="true"
                        className="absolute inset-0 grid place-items-center"
                    >
                        <RingsMotif />
                    </div>
                )}

                <div
                    aria-hidden="true"
                    className="absolute inset-0 bg-[radial-gradient(120%_100%_at_50%_0%,rgba(176,141,87,0.16),transparent_72%)]"
                />

                {category?.name ? (
                    <span className="absolute left-4 top-4 rounded-full bg-ivory/85 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-champagne backdrop-blur-sm">
                        {category.name}
                    </span>
                ) : null}
            </div>

            <div className="flex flex-1 flex-col p-5">
                <h3 className="font-display text-[22px] leading-snug text-ink">
                    {name || "Wedding service"}
                </h3>

                <dl className="mt-4 space-y-2 text-[14px] leading-relaxed text-ink-soft">
                    <div className="flex items-start gap-2">
                        <dt className="sr-only">Location</dt>
                        <PinIcon />
                        <dd>{location || "Location on request"}</dd>
                    </div>

                    <div className="flex items-center gap-2">
                        <dt className="sr-only">Vendor</dt>

                        {vendor?.image ? (
                            <Image
                                src={vendor.image}
                                alt={vendorName || "Vendor"}
                                width={24}
                                height={24}
                                className="size-6 shrink-0 rounded-full object-cover"
                            />
                        ) : (
                            <span
                                aria-hidden="true"
                                className="grid size-6 shrink-0 place-items-center rounded-full border border-champagne/40 text-[10px] font-semibold uppercase text-champagne"
                            >
                                {vendorName ? vendorName.charAt(0) : "·"}
                            </span>
                        )}

                        <dd>
                            {vendorName || "Vendor details unavailable"}
                        </dd>
                    </div>
                </dl>

                <div className="mt-auto pt-6">
                    <div className="flex items-end justify-between gap-4 border-t border-hairline pt-4">
                        <div>
                            <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-muted">
                                Price
                            </p>

                            <p className="mt-1 font-display text-[19px] leading-none text-ink">
                                {priceLabel || "Price on request"}
                            </p>
                        </div>

                        <Link
                            href={href}
                            className="group/link inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-ink transition-colors duration-200 hover:text-champagne"
                        >
                            View Details
                            <ArrowIcon />
                        </Link>
                    </div>
                </div>
            </div>
        </article>
    );
}

function RingsMotif() {
    return (
        <svg
            viewBox="0 0 64 44"
            fill="none"
            className="h-10 w-14 text-champagne/45"
        >
            <circle cx="24" cy="22" r="16" stroke="currentColor" strokeWidth="1.2" />
            <circle cx="40" cy="22" r="16" stroke="currentColor" strokeWidth="1.2" />
        </svg>
    );
}

function PinIcon() {
    return (
        <svg
            aria-hidden="true"
            viewBox="0 0 16 16"
            fill="none"
            className="mt-px h-4 w-4 shrink-0 text-champagne"
        >
            <path
                d="M8 14s4.5-4.2 4.5-7.5a4.5 4.5 0 1 0-9 0C3.5 9.8 8 14 8 14Z"
                stroke="currentColor"
                strokeWidth="1.1"
                strokeLinejoin="round"
            />
            <circle
                cx="8"
                cy="6.5"
                r="1.6"
                stroke="currentColor"
                strokeWidth="1.1"
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
            className="h-3 w-3 transition-transform duration-300 group-hover/link:translate-x-0.5"
        >
            <path
                d="M3 8h9.5M9 4l4 4-4 4"
                stroke="currentColor"
                strokeWidth="1.3"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}