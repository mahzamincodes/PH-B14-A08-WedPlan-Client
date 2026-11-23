
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import BookingForm from "@/components/services/BookingForm";

const API_BASE_URL = (
    process.env.BACKEND_API_URL || "http://localhost:5000"
).replace(/\/+$/, "");

export default async function ServiceDetailsPage({ params }) {
    const { id } = await params;

    let service;

    try {
        const response = await fetch(
            `${API_BASE_URL}/api/services/${id}`,
            {
                cache: "no-store",
            },
        );

        if (!response.ok) {
            notFound();
        }

        const result = await response.json();

        if (!result.success || !result.service) {
            notFound();
        }

        service = result.service;
    } catch (error) {
        if (error?.digest?.startsWith("NEXT_HTTP_ERROR_FALLBACK")) {
            throw error;
        }

        console.error("Service details fetch failed:", error);
        notFound();
    }

    const session = await auth.api.getSession({
        headers: await headers(),
    });

    const userRole = session?.user?.role || null;
    const images = Array.isArray(service.images)
        ? service.images
        : [];

    const price = Number(service.price);
    const priceLabel = Number.isFinite(price)
        ? `৳${price.toLocaleString("en-BD")}`
        : "Price on request";

    return (
        <main className="min-h-screen bg-ivory">
            <section className="border-b border-hairline bg-white/40">
                <div className="mx-auto max-w-7xl px-6 py-10">
                    <Link
                        href="/services"
                        className="text-xs font-semibold uppercase tracking-widest text-ink-soft transition-colors hover:text-champagne"
                    >
                        ← Back to Services
                    </Link>

                    <p className="mt-8 text-[11px] font-semibold uppercase tracking-[0.25em] text-champagne">
                        {service.category || "Wedding Service"}
                    </p>

                    <h1 className="mt-3 max-w-3xl font-display text-4xl leading-tight text-ink md:text-5xl">
                        {service.serviceName}
                    </h1>

                    <p className="mt-4 text-base text-ink-soft">
                        {service.location || "Location on request"}
                    </p>
                </div>
            </section>

            <section className="mx-auto grid max-w-7xl gap-10 px-6 py-12 lg:grid-cols-[1.5fr_1fr] lg:py-16">
                <div>
                    <div className="grid gap-4 sm:grid-cols-2">
                        {images.length > 0 ? (
                            images.map((image, index) => (
                                <div
                                    key={`${image}-${index}`}
                                    className={`relative aspect-4/3 overflow-hidden rounded-2xl bg-ivory-deep ${
                                        index === 0
                                            ? "sm:col-span-2"
                                            : ""
                                    }`}
                                >
                                    <Image
                                        src={image}
                                        alt={`${service.serviceName} - Image ${index + 1}`}
                                        fill
                                        priority={index === 0}
                                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 80vw, 900px"
                                        className="object-cover"
                                    />
                                </div>
                            ))
                        ) : (
                            <div className="grid aspect-4/3 place-items-center rounded-2xl bg-ivory-deep sm:col-span-2">
                                <p className="text-sm text-ink-soft">
                                    No service images available
                                </p>
                            </div>
                        )}
                    </div>

                    <div className="mt-10">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-champagne">
                            About This Service
                        </p>

                        <h2 className="mt-3 font-display text-3xl text-ink">
                            Service Description
                        </h2>

                        <p className="mt-5 whitespace-pre-line text-base leading-8 text-ink-soft">
                            {service.description ||
                                "No description available."}
                        </p>
                    </div>

                    <div className="mt-10 rounded-2xl border border-hairline bg-white/60 p-6">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-champagne">
                            Service Provider
                        </p>

                        <div className="mt-5 flex items-center gap-4">
                            {service.vendor?.image ? (
                                <Image
                                    src={service.vendor.image}
                                    alt={service.vendor.name || "Vendor"}
                                    width={56}
                                    height={56}
                                    className="size-14 rounded-full object-cover"
                                />
                            ) : (
                                <div className="grid size-14 place-items-center rounded-full bg-ivory-deep font-display text-xl text-champagne">
                                    {service.vendor?.name?.charAt(0) || "V"}
                                </div>
                            )}

                            <div>
                                <h3 className="font-semibold text-ink">
                                    {service.vendor?.name ||
                                        "Vendor details unavailable"}
                                </h3>

                                <p className="mt-1 text-xs text-ink-soft">
                                    Wedding Service Provider
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <aside className="h-fit rounded-2xl border border-hairline bg-white/70 p-6 md:p-8">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-champagne">
                        Service Pricing
                    </p>

                    <p className="mt-3 font-display text-4xl text-ink">
                        {priceLabel}
                    </p>

                    <p className="mt-2 text-sm text-ink-soft">
                        Contact the vendor through a booking request.
                    </p>

                    <div className="my-7 border-t border-hairline" />

                    {userRole === "Customer" ? (
                        <BookingForm serviceId={id} />
                    ) : !session?.user ? (
                        <div>
                            <h2 className="font-display text-2xl text-ink">
                                Interested in this service?
                            </h2>

                            <p className="mt-3 text-base leading-7 text-ink-soft">
                                Sign in with your customer account to submit
                                a booking request.
                            </p>

                            <Link
                                href="/sign-in"
                                className="mt-6 inline-flex w-full justify-center rounded-full bg-ink px-6 py-4 text-[11px] font-semibold uppercase tracking-widest text-white transition-colors hover:bg-champagne"
                            >
                                Sign In to Book
                            </Link>
                        </div>
                    ) : (
                        <div>
                            <h2 className="font-display text-2xl text-ink">
                                Booking Unavailable
                            </h2>

                            <p className="mt-3 text-base leading-7 text-ink-soft">
                                Only customers can submit booking requests.
                            </p>
                        </div>
                    )}
                </aside>
            </section>
        </main>
    );
}
