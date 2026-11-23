import Reveal from "@/components/ui/Reveal";

const steps = [
    {
        title: "Browse by category",
        description:
            "Pick from six wedding categories and open the services that suit your celebration.",
    },
    {
        title: "Compare the essentials",
        description:
            "Price, location, category and vendor are shown where available, so options stay comparable.",
    },
    {
        title: "View the full service",
        description:
            "Open a listing to read the available details before you decide.",
    },
];

export default function HowWedPlanWorks() {
    return (
        <section
            id="how-it-works"
            aria-labelledby="how-it-works-heading"
            className="scroll-mt-20 bg-[#F7F2EB] md:scroll-mt-24"
        >
            <div className="mx-auto w-full max-w-7xl px-5 py-16 md:px-8 md:py-20 lg:px-10 lg:py-24">
                <div className="max-w-2xl">
                    <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-champagne">
                        How WedPlan works
                    </p>
                    <h2
                        id="how-it-works-heading"
                        className="mt-4 font-display text-[clamp(2rem,3.6vw,3rem)] leading-[1.05] tracking-[-0.015em] text-ink"
                    >
                        Three steps, in your own time.
                    </h2>
                    <p className="mt-4 max-w-[58ch] text-[15px] leading-relaxed text-ink-soft">
                        Start with a category, then compare the services that suit your
                        day.
                    </p>
                </div>

                <ol className="mt-12 grid gap-x-8 gap-y-10 lg:mt-16 lg:grid-cols-3">
                    {steps.map((step, index) => (
                        <Reveal as="li" key={step.title} delay={index * 0.08}>
                            <div className="relative border-t border-ivory/15 pt-7">
                                <span
                                    aria-hidden="true"
                                    className="absolute -top-px left-0 h-px w-10 bg-champagne"
                                />
                                <p className="font-display text-[34px] leading-none text-champagne">
                                    0{index + 1}
                                </p>
                                <h3 className="mt-4 font-display text-[22px] leading-snug text-ink">
                                    {step.title}
                                </h3>
                                <p className="mt-2 text-[14px] leading-relaxed text-muted">
                                    {step.description}
                                </p>
                            </div>
                        </Reveal>
                    ))}
                </ol>
            </div>
        </section>
    );
}
