
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getAccessToken } from "@/lib/auth-token";
import { useToast } from "@/components/ui/ToastProvider";

function formatAmount(amount, currency) {
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: (currency || "usd").toUpperCase(),
    }).format((amount || 0) / 100);
}

function formatDate(date) {
    if (!date) return "N/A";

    return new Date(date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
    });
}

function getStatusStyle(status) {
    const normalizedStatus = (status || "").toLowerCase();

    if (normalizedStatus === "completed" || normalizedStatus === "active") {
        return "bg-green-50 text-green-700";
    }

    if (normalizedStatus === "canceled" || normalizedStatus === "cancelled") {
        return "bg-red-50 text-red-700";
    }

    return "bg-amber-50 text-amber-700";
}

export default function TransactionsPage() {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const { toast } = useToast();

    useEffect(() => {
        let mounted = true;

        async function fetchTransactions() {
            try {
                const token = await getAccessToken();

                if (!token) {
                    throw new Error("Authentication token unavailable.");
                }

                const response = await fetch("/api/admin/transactions", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    cache: "no-store",
                });

                const data = await response.json();

                if (!response.ok || !data.success) {
                    throw new Error(
                        data.message || "Failed to load transactions."
                    );
                }

                if (mounted) {
                    setTransactions(data.transactions || []);
                }
            } catch (err) {
                if (mounted) {
                    setError(
                        err.message || "Something went wrong."
                    );

                    toast({
                        title: "Failed to load transactions",
                        description: err.message || "Please try again.",
                        variant: "error",
                    });
                }
            } finally {
                if (mounted) {
                    setLoading(false);
                }
            }
        }

        fetchTransactions();

        return () => {
            mounted = false;
        };
    }, [toast]);

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

                    <p className="mt-6 text-sm font-medium uppercase tracking-[0.2em] text-[#a17b52]">
                        Platform Management
                    </p>

                    <h1 className="mt-2 text-3xl font-semibold tracking-tight text-[#29251f] sm:text-4xl">
                        Transactions
                    </h1>

                    <p className="mt-3 text-sm leading-7 text-[#77716a] sm:text-base">
                        Monitor vendor subscription payments and transaction
                        history.
                    </p>
                </div>

                <div className="mb-6 rounded-xl border border-[#e9e2d9] bg-white p-6">
                    <p className="text-sm text-[#77716a]">
                        Total Transactions
                    </p>

                    <p className="mt-2 text-3xl font-semibold text-[#29251f]">
                        {loading ? "..." : transactions.length}
                    </p>
                </div>

                <section className="overflow-hidden rounded-xl border border-[#e9e2d9] bg-white">
                    <div className="border-b border-[#e9e2d9] px-6 py-5">
                        <h2 className="text-lg font-semibold text-[#29251f]">
                            Transaction History
                        </h2>

                        <p className="mt-1 text-sm text-[#77716a]">
                            All recorded vendor subscription transactions.
                        </p>
                    </div>

                    {loading ? (
                        <div className="space-y-4 p-6">
                            {[1, 2, 3].map((item) => (
                                <div
                                    key={item}
                                    className="h-14 animate-pulse rounded-lg bg-[#f3efe9]"
                                />
                            ))}
                        </div>
                    ) : error ? (
                        <div className="p-10 text-center">
                            <p className="text-sm text-red-600">{error}</p>
                        </div>
                    ) : transactions.length === 0 ? (
                        <div className="px-6 py-16 text-center">
                            <h3 className="text-lg font-semibold text-[#29251f]">
                                No transactions yet
                            </h3>

                            <p className="mt-2 text-sm text-[#77716a]">
                                Vendor subscription transactions will appear
                                here once payments are completed.
                            </p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-212.5 text-left">
                                <thead className="bg-[#faf8f5]">
                                    <tr>
                                        {[
                                            "Vendor",
                                            "Amount",
                                            "Status",
                                            "Transaction ID",
                                            "Date",
                                        ].map((heading) => (
                                            <th
                                                key={heading}
                                                className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-[#77716a]"
                                            >
                                                {heading}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>

                                <tbody className="divide-y divide-[#eee8df]">
                                    {transactions.map((transaction) => (
                                        <tr
                                            key={transaction.stripeSessionId}
                                            className="transition-colors hover:bg-[#faf8f5]"
                                        >
                                            <td className="px-6 py-5">
                                                <p className="font-medium text-[#29251f]">
                                                    {transaction.vendor?.name ||
                                                        "Unknown Vendor"}
                                                </p>

                                                <p className="mt-1 text-xs text-[#77716a]">
                                                    {transaction.vendor?.email ||
                                                        "N/A"}
                                                </p>
                                            </td>

                                            <td className="px-6 py-5 font-medium text-[#29251f]">
                                                {formatAmount(
                                                    transaction.amount,
                                                    transaction.currency
                                                )}
                                            </td>

                                            <td className="px-6 py-5">
                                                <span
                                                    className={`inline-flex rounded-full px-3 py-1 text-xs font-medium capitalize ${getStatusStyle(transaction.status)}`}
                                                >
                                                    {transaction.status ||
                                                        "Unknown"}
                                                </span>
                                            </td>

                                            <td className="px-6 py-5">
                                                <span
                                                    className="font-mono text-xs text-[#77716a]"
                                                    title={
                                                        transaction.stripeSessionId
                                                    }
                                                >
                                                    {transaction.stripeSessionId
                                                        ? `${transaction.stripeSessionId.slice(0, 18)}...`
                                                        : "N/A"}
                                                </span>
                                            </td>

                                            <td className="px-6 py-5 text-sm text-[#77716a]">
                                                {formatDate(
                                                    transaction.createdAt
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </section>
            </div>
        </main>
    );
}
