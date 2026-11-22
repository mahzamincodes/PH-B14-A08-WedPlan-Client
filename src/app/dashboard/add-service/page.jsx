
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import AddServiceForm from "@/components/services/AddServiceForm";

export default async function AddServicePage() {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session?.user) {
        redirect("/sign-in");
    }

    if (session.user.role !== "Vendor") {
        redirect("/dashboard");
    }

    return (
        <main className="min-h-screen bg-[#faf8f5] px-4 py-12 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-4xl">
                <div className="mb-8">
                    <p className="mb-3 text-sm font-medium uppercase tracking-[0.2em] text-[#a17b52]">
                        Vendor Dashboard
                    </p>

                    <h1 className="text-3xl font-semibold tracking-tight text-[#29251f] sm:text-4xl">
                        Add a New Service
                    </h1>

                    <p className="mt-3 text-sm leading-7 text-[#77716a] sm:text-base">
                        Share your wedding service with couples planning their
                        special day.
                    </p>
                </div>

                <AddServiceForm />
            </div>
        </main>
    );
}
