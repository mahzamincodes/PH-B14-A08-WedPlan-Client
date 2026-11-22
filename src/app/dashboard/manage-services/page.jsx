
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/auth";
import ManageServicesList from "@/components/admin/ManageServicesList";

export default async function ManageServicesPage() {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session?.user) {
        redirect("/sign-in");
    }

    if (session.user.role !== "Admin") {
        redirect("/dashboard");
    }

    return (
        <main className="min-h-screen bg-[#faf8f5] px-4 py-12 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-7xl">
                <div className="mb-8">
                    <Link
                        href="/dashboard"
                        className="text-sm font-medium text-[#967047] transition-colors hover:text-[#725337]"
                    >
                        ← Back to Dashboard
                    </Link>

                    <p className="mb-3 mt-6 text-sm font-medium uppercase tracking-[0.2em] text-[#a17b52]">
                        Administration
                    </p>

                    <h1 className="text-3xl font-semibold tracking-tight text-[#29251f] sm:text-4xl">
                        Manage Services
                    </h1>

                    <p className="mt-3 text-sm leading-7 text-[#77716a] sm:text-base">
                        Review submitted wedding services, manage approvals,
                        and remove inappropriate listings.
                    </p>
                </div>

                <ManageServicesList />
            </div>
        </main>
    );
}
