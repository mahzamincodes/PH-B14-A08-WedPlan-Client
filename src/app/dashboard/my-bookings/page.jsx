
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import MyBookingsList from "@/components/bookings/MyBookingsList";

export default async function MyBookingsPage() {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session?.user) {
        redirect("/sign-in");
    }

    if (session.user.role !== "Customer") {
        redirect("/dashboard");
    }

    return (
        <main className="min-h-screen bg-[#faf9f6] px-4 py-10 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-6xl">
                <div className="mb-8">
                    <p className="text-sm font-semibold uppercase tracking-wider text-[#9b8064]">
                        Customer Dashboard
                    </p>

                    <h1 className="mt-2 text-3xl font-semibold text-gray-900">
                        My Bookings
                    </h1>

                    <p className="mt-2 text-sm leading-relaxed text-gray-600">
                        View your booking requests and manage your upcoming
                        wedding services.
                    </p>
                </div>

                <MyBookingsList />
            </div>
        </main>
    );
}
