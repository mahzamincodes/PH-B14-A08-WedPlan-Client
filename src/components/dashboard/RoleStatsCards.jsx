
"use client";

import { useCallback, useEffect, useState } from "react";
import { getAccessToken } from "@/lib/auth-token";

const CUSTOMER_STATS = [
    { key: "totalBookings", label: "Total Booking Requests" },
    { key: "pendingBookings", label: "Pending Bookings" },
    { key: "acceptedBookings", label: "Accepted Bookings" },
    { key: "rejectedBookings", label: "Rejected Bookings" },
];

const VENDOR_STATS = [
    { key: "totalServices", label: "Total Services" },
    { key: "activeServices", label: "Active Services" },
    { key: "pendingBookings", label: "Pending Booking Requests" },
    { key: "acceptedBookings", label: "Accepted Bookings" },
    { key: "subscriptionPlan", label: "Current Subscription Plan" },
];

export default function RoleStatsCards({ role }) {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchStats = useCallback(async () => {
        const token = await getAccessToken();

        if (!token) {
            throw new Error("Authentication token unavailable.");
        }

        const headers = {
            Authorization: `Bearer ${token}`,
        };

        const isVendor = role === "Vendor";

        const requests = isVendor
            ? [
                  fetch("/api/services/mine", {
                      headers,
                      cache: "no-store",
                  }),
                  fetch("/api/bookings/vendor", {
                      headers,
                      cache: "no-store",
                  }),
                  fetch("/api/subscriptions/me", {
                      headers,
                      cache: "no-store",
                  }),
              ]
            : [
                  fetch("/api/bookings/mine", {
                      headers,
                      cache: "no-store",
                  }),
              ];

        const responses = await Promise.all(requests);

        const results = await Promise.all(
            responses.map(async (response) => {
                const data = await response.json();

                if (!response.ok || !data.success) {
                    throw new Error(
                        data.message ||
                            "Failed to load dashboard statistics.",
                    );
                }

                return data;
            }),
        );

        if (isVendor) {
            const services = Array.isArray(results[0].services)
                ? results[0].services
                : [];

            const bookings = Array.isArray(results[1].bookings)
                ? results[1].bookings
                : [];

            const subscription = results[2].subscription;

            const isPremium =
                subscription?.plan === "premium" &&
                ["active", "trialing"].includes(subscription?.status);

            return {
                totalServices: services.length,
                activeServices: services.filter(
                    (service) => service.isActive !== false,
                ).length,
                pendingBookings: bookings.filter(
                    (booking) => booking.status === "Pending",
                ).length,
                acceptedBookings: bookings.filter(
                    (booking) => booking.status === "Accepted",
                ).length,
                subscriptionPlan: isPremium ? "Premium" : "Free",
            };
        }

        const bookings = Array.isArray(results[0].bookings)
            ? results[0].bookings
            : [];

        return {
            totalBookings: bookings.length,
            pendingBookings: bookings.filter(
                (booking) => booking.status === "Pending",
            ).length,
            acceptedBookings: bookings.filter(
                (booking) => booking.status === "Accepted",
            ).length,
            rejectedBookings: bookings.filter(
                (booking) => booking.status === "Rejected",
            ).length,
        };
    }, [role]);

    useEffect(() => {
        let ignore = false;

        fetchStats()
            .then((calculatedStats) => {
                if (!ignore) {
                    setStats(calculatedStats);
                    setError("");
                }
            })
            .catch((err) => {
                if (!ignore) {
                    setError(
                        err.message ||
                            "Unable to load dashboard statistics.",
                    );
                }
            })
            .finally(() => {
                if (!ignore) {
                    setLoading(false);
                }
            });

        return () => {
            ignore = true;
        };
    }, [fetchStats]);

    const handleRetry = async () => {
        setLoading(true);
        setError("");

        try {
            const calculatedStats = await fetchStats();
            setStats(calculatedStats);
        } catch (err) {
            setError(
                err.message || "Unable to load dashboard statistics.",
            );
        } finally {
            setLoading(false);
        }
    };

    const statItems =
        role === "Vendor" ? VENDOR_STATS : CUSTOMER_STATS;

    if (loading) {
        return (
            <div
                className={`grid gap-5 sm:grid-cols-2 ${
                    role === "Vendor"
                        ? "lg:grid-cols-3"
                        : "lg:grid-cols-4"
                }`}
            >
                {statItems.map((item) => (
                    <div
                        key={item.key}
                        className="animate-pulse rounded-xl border border-[#e9e2d9] bg-white p-6"
                    >
                        <div className="h-4 w-32 rounded bg-[#eee9e2]" />
                        <div className="mt-4 h-8 w-20 rounded bg-[#eee9e2]" />
                    </div>
                ))}
            </div>
        );
    }

    if (error || !stats) {
        return (
            <div className="rounded-xl border border-[#e9e2d9] bg-white p-6 text-center">
                <p className="text-sm text-red-600">
                    {error || "Unable to load dashboard statistics."}
                </p>

                <button
                    type="button"
                    onClick={handleRetry}
                    className="mt-4 rounded-lg bg-[#967047] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#725337]"
                >
                    Try Again
                </button>
            </div>
        );
    }

    return (
        <div
            className={`grid gap-5 sm:grid-cols-2 ${
                role === "Vendor"
                    ? "lg:grid-cols-3"
                    : "lg:grid-cols-4"
            }`}
        >
            {statItems.map((item) => (
                <div
                    key={item.key}
                    className="rounded-xl border border-[#e9e2d9] bg-white p-6"
                >
                    <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#a17b52]">
                        {item.label}
                    </p>

                    <p className="mt-2 text-3xl font-semibold capitalize text-[#29251f]">
                        {stats[item.key] ?? 0}
                    </p>
                </div>
            ))}
        </div>
    );
}
