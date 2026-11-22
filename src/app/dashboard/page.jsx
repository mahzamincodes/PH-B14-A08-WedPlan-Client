
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/auth";
import StatsCards from "@/components/admin/StatsCards";
import RoleStatsCards from "@/components/dashboard/RoleStatsCards";

const dashboardContent = {
    Vendor: {
        title: "Vendor Dashboard",
        description: "Manage your wedding services and grow your business.",
        sections: [
            {
                title: "My Services",
                description: "Manage the services you offer.",
                href: "/dashboard/my-services",
            },
            {
                title: "Add Service",
                description: "Create a new wedding service listing.",
                href: "/dashboard/add-service",
            },
            {
                title: "Booking Requests",
                description: "Review and manage customer bookings.",
                href: "/dashboard/booking-requests",
            },
            {
                title: "Subscription",
                description: "Manage your subscription plan.",
                href: "/dashboard/subscription",
            },
        ],
    },
    Customer: {
        title: "Customer Dashboard",
        description: "Manage your wedding plans and bookings.",
        sections: [
            {
                title: "My Bookings",
                description: "View and manage your service bookings.",
                href: "/dashboard/my-bookings",
            },
        ],
    },
    Admin: {
        title: "Admin Dashboard",
        description: "Oversee users, services, and platform activity.",
        sections: [
            {
                title: "Manage Users",
                description: "Review and manage platform users.",
                href: "/dashboard/manage-users",
            },
            {
                title: "Manage Services",
                description: "Review and manage wedding services.",
                href: "/dashboard/manage-services",
            },
            {
                title: "Transactions",
                description: "Monitor platform transactions.",
                href: "/dashboard/transactions",
            },
        ],
    },
};

export default async function DashboardPage() {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session?.user) {
        redirect("/sign-in");
    }

    const role = session.user.role;
    const dashboard = dashboardContent[role];

    if (!dashboard) {
        redirect("/");
    }

    return (
        <main className="min-h-screen bg-[#faf8f5] px-4 py-12 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-7xl">
                <div className="mb-10">
                    <p className="text-sm font-medium uppercase tracking-[0.2em] text-[#a17b52]">
                        Welcome back
                    </p>

                    <h1 className="mt-2 text-3xl font-semibold tracking-tight text-[#29251f] sm:text-4xl">
                        {dashboard.title}
                    </h1>

                    <p className="mt-3 text-sm leading-7 text-[#77716a] sm:text-base">
                        {dashboard.description}
                    </p>

                    <p className="mt-2 text-sm text-[#77716a]">
                        Signed in as{" "}
                        <span className="font-semibold text-[#29251f]">
                            {session.user.name}
                        </span>
                    </p>
                </div>

                <section className="mb-10">
                    <h2 className="mb-5 text-xl font-semibold text-[#29251f]">
                        Overview
                    </h2>

                    {role === "Admin" ? (
                        <StatsCards />
                    ) : (
                        <RoleStatsCards role={role} />
                    )}
                </section>

                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {dashboard.sections.map((section) => (
                        <Link
                            key={section.href}
                            href={section.href}
                            className="group rounded-xl border border-[#e9e2d9] bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:border-[#d9c7b2] hover:shadow-md"
                        >
                            <h2 className="text-lg font-semibold text-[#29251f] transition-colors group-hover:text-[#967047]">
                                {section.title}
                            </h2>

                            <p className="mt-2 text-sm leading-6 text-[#77716a]">
                                {section.description}
                            </p>

                            <span className="mt-5 inline-flex items-center text-sm font-semibold text-[#967047]">
                                Open Section
                                <span className="ml-2 transition-transform group-hover:translate-x-1">
                                    →
                                </span>
                            </span>
                        </Link>
                    ))}
                </div>
            </div>
        </main>
    );
}
