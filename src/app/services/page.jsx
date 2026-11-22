
import Link from "next/link";
import Reveal from "@/components/ui/Reveal";
import ServiceCard from "@/components/services/ServiceCard";
import {
    getBrowseServices,
    SERVICE_DATA_STATUS,
} from "@/lib/services";

const CATEGORIES = [
    "Photography & Videography",
    "Wedding Venues",
    "Decoration & Florist",
    "Catering Services",
    "Makeup & Styling",
    "Wedding Fashion",
];

export default async function BrowseServicesPage({ searchParams }) {
    const params = await searchParams;

    const filters = {
        search: typeof params?.search === "string" ? params.search : "",
        category: typeof params?.category === "string" ? params.category : "",
        location: typeof params?.location === "string" ? params.location : "",
        sort: typeof params?.sort === "string" ? params.sort : "",
    };

    const result = await getBrowseServices(filters);
    const services = result.services;

    return (
        <main className="min-h-screen bg-ivory">
            <section className="border-b border-hairline bg-white/40">
                <div className="mx-auto max-w-7xl px-6 py-16 md:py-20">
                    <Reveal>
                        <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-champagne">
                            Find your perfect match
                        </p>

                        <h1 className="mt-4 font-display text-4xl leading-tight text-ink md:text-6xl">
                            Browse Wedding Services
                        </h1>

                        <p className="mt-4 max-w-xl text-sm leading-7 text-ink-soft">
                            Discover trusted wedding professionals and find
                            everything you need to make your special day
                            unforgettable.
                        </p>
                    </Reveal>
                </div>
            </section>

            <section className="mx-auto max-w-7xl px-6 py-12 md:py-16">
                <form
                    action="/services"
                    method="GET"
                    className="mb-10 grid gap-4 rounded-2xl border border-hairline bg-white/70 p-5 md:grid-cols-2 lg:grid-cols-4"
                >
                    <div className="lg:col-span-2">
                        <label
                            htmlFor="search"
                            className="mb-2 block text-[10px] font-semibold uppercase tracking-widest text-ink-soft"
                        >
                            Search services
                        </label>

                        <input
                            id="search"
                            type="search"
                            name="search"
                            defaultValue={filters.search}
                            placeholder="Search by service name..."
                            className="w-full rounded-lg border border-hairline bg-white px-4 py-3 text-sm text-ink outline-none transition-colors focus:border-champagne"
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="category"
                            className="mb-2 block text-[10px] font-semibold uppercase tracking-widest text-ink-soft"
                        >
                            Category
                        </label>

                        <select
                            id="category"
                            name="category"
                            defaultValue={filters.category}
                            className="w-full rounded-lg border border-hairline bg-white px-4 py-3 text-sm text-ink outline-none focus:border-champagne"
                        >
                            <option value="">All Categories</option>

                            {CATEGORIES.map((category) => (
                                <option key={category} value={category}>
                                    {category}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label
                            htmlFor="location"
                            className="mb-2 block text-[10px] font-semibold uppercase tracking-widest text-ink-soft"
                        >
                            Location
                        </label>

                        <input
                            id="location"
                            type="text"
                            name="location"
                            defaultValue={filters.location}
                            placeholder="Enter location..."
                            className="w-full rounded-lg border border-hairline bg-white px-4 py-3 text-sm text-ink outline-none focus:border-champagne"
                        />
                    </div>

                    <div className="lg:col-span-4 flex flex-wrap items-center justify-between gap-4 border-t border-hairline pt-4">
                        <div>
                            <label
                                htmlFor="sort"
                                className="mr-3 text-[10px] font-semibold uppercase tracking-widest text-ink-soft"
                            >
                                Sort by price
                            </label>

                            <select
                                id="sort"
                                name="sort"
                                defaultValue={filters.sort}
                                className="rounded-lg border border-hairline bg-white px-3 py-2 text-sm text-ink outline-none focus:border-champagne"
                            >
                                <option value="">Newest</option>
                                <option value="asc">Price: Low to High</option>
                                <option value="desc">Price: High to Low</option>
                            </select>
                        </div>

                        <div className="flex items-center gap-3">
                            <Link
                                href="/services"
                                className="text-xs font-semibold text-ink-soft transition-colors hover:text-champagne"
                            >
                                Clear Filters
                            </Link>

                            <button
                                type="submit"
                                className="rounded-full bg-ink px-7 py-3 text-[10px] font-semibold uppercase tracking-widest text-white transition-colors hover:bg-champagne"
                            >
                                Apply Filters
                            </button>
                        </div>
                    </div>
                </form>

                <div className="mb-8 flex flex-wrap items-end justify-between gap-3">
                    <div>
                        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-champagne">
                            Our Collection
                        </p>

                        <h2 className="mt-2 font-display text-3xl text-ink">
                            Wedding Services
                        </h2>
                    </div>

                    <p className="text-xs text-ink-soft">
                        {result.status === SERVICE_DATA_STATUS.OK
                            ? `${services.length} services found`
                            : "Services unavailable"}
                    </p>
                </div>

                {result.status === SERVICE_DATA_STATUS.ERROR ? (
                    <div className="rounded-2xl border border-hairline bg-white/70 px-6 py-16 text-center">
                        <h3 className="font-display text-2xl text-ink">
                            Unable to load services
                        </h3>

                        <p className="mt-3 text-sm text-ink-soft">
                            Something went wrong while loading services.
                            Please try again.
                        </p>
                    </div>
                ) : services.length === 0 ? (
                    <div className="rounded-2xl border border-hairline bg-white/70 px-6 py-16 text-center">
                        <h3 className="font-display text-2xl text-ink">
                            No services found
                        </h3>

                        <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-ink-soft">
                            We couldnt find any services matching your
                            search. Try changing your filters or explore
                            all available categories.
                        </p>

                        <Link
                            href="/services"
                            className="mt-6 inline-flex rounded-full bg-ink px-7 py-3 text-[10px] font-semibold uppercase tracking-widest text-white transition-colors hover:bg-champagne"
                        >
                            View All Services
                        </Link>
                    </div>
                ) : (
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {services.map((service, index) => (
                            <Reveal key={service.id || index}>
                                <ServiceCard service={service} />
                            </Reveal>
                        ))}
                    </div>
                )}
            </section>
        </main>
    );
}
