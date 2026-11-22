
import FeaturedServices from "@/components/home/FeaturedServices";
import GoogleSignInCallback from "@/components/ui/GoogleSignInCallback";
import HeroSection from "@/components/home/HeroSection";
import HowWedPlanWorks from "@/components/home/HowWedPlanWorks";
import ServiceCategories from "@/components/home/ServiceCategories";
import WhyChooseWedPlan from "@/components/home/WhyChooseWedPlan";

export const metadata = {
    title: { absolute: "WedPlan — Modern Wedding Planning" },
    description:
        "Browse photographers, venues, florists, caterers, stylists and wedding fashion in one calm, considered place.",
};

export default async function Home() {
    return (
        <>
            <GoogleSignInCallback />

            <HeroSection />
            <FeaturedServices />
            <ServiceCategories />
            <WhyChooseWedPlan />
            <HowWedPlanWorks />
        </>
    );
}
