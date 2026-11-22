import SignUpForm from "./SignUpForm";

export const metadata = {
    title: { absolute: "Create your WedPlan account" },
    description:
        "Join WedPlan and start planning your wedding. Sign up as a customer or a vendor.",
};

export default function SignUpPage() {
    return (
        <section
            aria-labelledby="signup-heading"
            className="mx-auto min-h-[calc(100vh-4rem)] w-full px-5 py-12 md:py-16 lg:py-20 flex items-center justify-center bg-ivory"
        >
            <SignUpForm />
        </section>
    );
}
