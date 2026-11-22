"use client";

import { useEffect, useState } from "react";
import { getAccessToken } from "@/lib/auth-token";
import { useToast } from "@/components/ui/ToastProvider";

const STATS = [
    { key: "totalUsers", label: "Total Registered Users" },
    { key: "totalVendors", label: "Total Vendors" },
    { key: "totalCustomers", label: "Total Customers" },
    { key: "totalServices", label: "Total Services" },
    { key: "pendingServices", label: "Pending Services" },
    { key: "totalTransactions", label: "Total Transactions" },
];

export default function StatsCards() {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const { toast } = useToast();

    useEffect(() => {
        let mounted = true;

        async function fetchStats() {
            try {
                const token = await getAccessToken();

                if (!token) {
                    throw new Error("Authentication token unavailable.");
                }

                const response = await fetch("/api/admin/stats", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    cache: "no-store",
                });

                const data = await response.json();

                if (!response.ok || !data.success) {
                    throw new Error(data.message || "Failed to load stats.");
                }

                if (mounted) {
                    setStats(data.stats);
                }
            } catch (err) {
                if (mounted) {
                    setError(err.message || "Something went wrong.");
                    toast({
                        title: "Failed to load statistics",
                        description:
                            err.message || "Please try again.",
                        variant: "error",
                    });
                }
            } finally {
                if (mounted) {
                    setLoading(false);
                }
            }
        }

        fetchStats();

        return () => {
            mounted = false;
        };
    }, [toast]);

    if (loading) {
        return (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {[1, 2, 3, 4, 5, 6].map((index) => (
                    <div
                        key={index}
                        className="rounded-xl border border-[#e9e2d9] bg-white p-6 animate-pulse"
                    >
                        <div className="h-4 w-24 bg-[#eee9e2] rounded" />
                        <div className="mt-4 h-8 w-32 bg-[#eee9e2] rounded" />
                    </div>
                ))}
            </div>
        );
    }

    if (error || !stats) {
        return (
            <div className="rounded-xl border border-[#e9e2d9] bg-white p-6 text-center">
                <p className="text-sm text-[#77716a]">
                    {error || "Unable to load statistics"}
                </p>
            </div>
        );
    }

    return (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {STATS.map((stat) => (
                <div
                    key={stat.key}
                    className="rounded-xl border border-[#e9e2d9] bg-white p-6"
                >
                    <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#a17b52]">
                        {stat.label}
                    </p>
                    <p className="mt-2 text-3xl font-semibold text-[#29251f]">
                        {stats[stat.key] ?? 0}
                    </p>
                </div>
            ))}
        </div>
    );
}
