import Reveal from "@/components/ui/Reveal";

const reasons = [
    {
        title: "Six clear categories",
        description:
            "Photography, venues, florals, catering, styling and fashion — each in one place.",
    },
    {
        title: "Comparable at a glance",
        description:
            "Category, price, location and vendor sit in the same place on every service card.",
    },
    {
        title: "Vendor details where available",
        description:
            "Vendor details appear on service listings where available.",
    },
    {
        title: "A calmer way to plan",
        description:
            "An editorial, uncluttered interface that keeps the focus on decisions, not noise.",
    },
];

export default function WhyChooseWedPlan() {
    return (
        <section
            id="why-wedplan"
            aria-labelledby="why-wedplan-heading"
            className="scroll-mt-20 border-t border-hairline bg-ivory md:scroll-mt-24"
        >
            <div className="mx-auto w-full max-w-7xl px-5 py-16 md:px-8 md:py-20 lg:px-10 lg:py-24">
                <div className="max-w-2xl">
                    <p className="text-[10px] font-medium uppercase tracking-[0.28em] text-champagne">
                        Why choose WedPlan
                    </p>
                    <h2
                        id="why-wedplan-heading"
                        className="mt-4 font-display text-[clamp(2rem,3.6vw,3rem)] leading-[1.05] tracking-[-0.015em] text-ink"
                    >
                        Fewer places to look, more to notice.
                    </h2>
                    <p className="mt-4 max-w-[58ch] text-[15px] leading-relaxed text-ink-soft">
                        WedPlan is designed to keep wedding services in one considered
                        place, so comparing them takes minutes rather than evenings.
                    </p>
                </div>

                <ul className="mt-12 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:mt-16 lg:grid-cols-4">
                    {reasons.map((reason, index) => (
                        <Reveal as="li" key={reason.title} delay={index * 0.06}>
                            <div className="relative border-t border-hairline pt-7">
                                <span
                                    aria-hidden="true"
                                    className="absolute -top-px left-0 h-px w-10 bg-champagne"
                                />
                                <p className="font-display text-[34px] leading-none text-champagne/60">
                                    0{index + 1}
                                </p>
                                <h3 className="mt-4 font-display text-[22px] leading-snug text-ink">
                                    {reason.title}
                                </h3>
                                <p className="mt-2 text-[13px] leading-relaxed text-muted">
                                    {reason.description}
                                </p>
                            </div>
                        </Reveal>
                    ))}
                </ul>
            </div>
        </section>
    );
}
