
"use client";

import { Suspense, useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { getAccessToken } from "@/lib/auth-token";
import { useToast } from "@/components/ui/ToastProvider";

function SubscriptionContent() {
    const [subscription, setSubscription] = useState(null);
    const [loading, setLoading] = useState(true);
    const [checkoutLoading, setCheckoutLoading] = useState(false);
    const [error, setError] = useState("");

    const { toast } = useToast();
    const searchParams = useSearchParams();

    const paymentStatus = searchParams.get("subscription");

    const notice =
        paymentStatus === "success"
            ? "Checkout completed. Your Premium status will update after payment verification."
            : paymentStatus === "canceled"
              ? "Checkout was canceled. Your current plan is unchanged."
              : "";

    const fetchSubscription = useCallback(async () => {
        try {
            const token = await getAccessToken();

            if (!token) {
                throw new Error("Authentication token unavailable.");
            }

            const response = await fetch("/api/subscriptions/me", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                cache: "no-store",
            });

            const data = await response.json();

            if (!response.ok || !data.success) {
                throw new Error(
                    data.message || "Failed to load subscription."
                );
            }

            setSubscription(data.subscription);
            setError("");
        } catch (err) {
            const message = err.message || "Something went wrong.";

            setError(message);

            toast({
                title: "Subscription error",
                description: message,
                variant: "error",
            });
        } finally {
            setLoading(false);
        }
    }, [toast]);

    useEffect(() => {
        let active = true;

        async function loadSubscription() {
            try {
                const token = await getAccessToken();

                if (!token) {
                    throw new Error("Authentication token unavailable.");
                }

                const response = await fetch("/api/subscriptions/me", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    cache: "no-store",
                });

                const data = await response.json();

                if (!response.ok || !data.success) {
                    throw new Error(
                        data.message || "Failed to load subscription."
                    );
                }

                if (active) {
                    setSubscription(data.subscription);
                    setError("");
                }
            } catch (err) {
                if (active) {
                    const message =
                        err.message || "Something went wrong.";

                    setError(message);

                    toast({
                        title: "Subscription error",
                        description: message,
                        variant: "error",
                    });
                }
            } finally {
                if (active) {
                    setLoading(false);
                }
            }
        }

        loadSubscription();

        return () => {
            active = false;
        };
    }, [toast]);

    async function handleUpgrade() {
        try {
            setCheckoutLoading(true);

            const token = await getAccessToken();

            if (!token) {
                throw new Error("Authentication token unavailable.");
            }

            const response = await fetch("/api/subscriptions/checkout", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = await response.json();

            if (!response.ok || !data.success || !data.url) {
                throw new Error(
                    data.message || "Unable to start checkout."
                );
            }

            window.location.assign(data.url);
        } catch (err) {
            toast({
                title: "Upgrade unavailable",
                description: err.message || "Please try again.",
                variant: "error",
            });

            setCheckoutLoading(false);
        }
    }

    const isPremium =
        subscription?.plan === "premium" &&
        ["active", "trialing"].includes(subscription?.status);

    return (
        <main className="min-h-screen bg-[#faf8f5] px-4 py-12 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-5xl">
                <Link
                    href="/dashboard"
                    className="text-sm font-medium text-[#967047] transition-colors hover:text-[#725337]"
                >
                    ← Back to Dashboard
                </Link>

                <div className="mb-10 mt-7">
                    <p className="text-sm font-medium uppercase tracking-[0.2em] text-[#a17b52]">
                        Vendor Account
                    </p>

                    <h1 className="mt-2 text-3xl font-semibold tracking-tight text-[#29251f] sm:text-4xl">
                        Subscription Plan
                    </h1>

                    <p className="mt-3 max-w-2xl text-sm leading-7 text-[#77716a] sm:text-base">
                        Manage your plan and unlock more opportunities to grow
                        your wedding business.
                    </p>
                </div>

                {notice && (
                    <div className="mb-6 rounded-xl border border-[#e9e2d9] bg-white p-4 text-sm leading-6 text-[#725337]">
                        {notice}
                    </div>
                )}

                {loading ? (
                    <div className="animate-pulse rounded-2xl border border-[#e9e2d9] bg-white p-8">
                        <div className="h-5 w-32 rounded bg-[#eee9e2]" />
                        <div className="mt-5 h-10 w-48 rounded bg-[#eee9e2]" />
                        <div className="mt-5 h-4 w-full max-w-md rounded bg-[#eee9e2]" />
                    </div>
                ) : error ? (
                    <div className="rounded-2xl border border-[#e9e2d9] bg-white p-8 text-center">
                        <p className="text-sm text-red-600">{error}</p>

                        <button
                            onClick={fetchSubscription}
                            className="mt-5 rounded-lg bg-[#967047] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-[#725337]"
                        >
                            Try Again
                        </button>
                    </div>
                ) : (
                    <div className="grid gap-6 lg:grid-cols-2">
                        <section className="rounded-2xl border border-[#e9e2d9] bg-white p-7 transition-shadow duration-300 hover:shadow-md sm:p-9">
                            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#a17b52]">
                                Your Current Plan
                            </p>

                            <h2 className="mt-5 text-3xl font-semibold capitalize text-[#29251f]">
                                {subscription?.plan || "Free"}
                            </h2>

                            <p className="mt-2 text-sm capitalize text-[#77716a]">
                                Status: {subscription?.status || "inactive"}
                            </p>

                            <div className="my-7 h-px bg-[#eee8df]" />

                            <ul className="space-y-4 text-sm text-[#625b52]">
                                <li>
                                    <span className="mr-2 text-[#a17b52]">✓</span>
                                    {isPremium
                                        ? "Unlimited active service listings"
                                        : "Up to 3 active service listings"}
                                </li>

                                <li>
                                    <span className="mr-2 text-[#a17b52]">✓</span>
                                    Manage your wedding service business
                                </li>

                                <li>
                                    <span className="mr-2 text-[#a17b52]">✓</span>
                                    Access your vendor dashboard
                                </li>
                            </ul>

                            {isPremium && (
                                <div className="mt-7 rounded-lg bg-green-50 p-4 text-sm text-green-700">
                                    Your Premium subscription is active.
                                </div>
                            )}
                        </section>

                        <section className="rounded-2xl border border-[#d9c7b2] bg-[#f5efe7] p-7 transition-shadow duration-300 hover:shadow-md sm:p-9">
                            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#967047]">
                                Grow Your Business
                            </p>

                            <h2 className="mt-5 text-3xl font-semibold text-[#29251f]">
                                Premium
                            </h2>

                            <p className="mt-3 text-sm leading-7 text-[#77716a]">
                                Unlock unlimited active service listings and
                                expand your presence on WedPlan.
                            </p>

                            <div className="my-7 h-px bg-[#e5d8c9]" />

                            <ul className="space-y-4 text-sm text-[#625b52]">
                                <li>
                                    <span className="mr-2 text-[#967047]">✓</span>
                                    Unlimited active services
                                </li>

                                <li>
                                    <span className="mr-2 text-[#967047]">✓</span>
                                    More opportunities to reach customers
                                </li>

                                <li>
                                    <span className="mr-2 text-[#967047]">✓</span>
                                    Manage all your service listings
                                </li>
                            </ul>

                            <button
                                onClick={handleUpgrade}
                                disabled={isPremium || checkoutLoading}
                                className="mt-8 w-full rounded-lg bg-[#967047] px-6 py-3.5 text-sm font-semibold text-white transition duration-300 hover:bg-[#725337] disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {isPremium
                                    ? "Premium Activated"
                                    : checkoutLoading
                                      ? "Redirecting to Checkout..."
                                      : "Upgrade to Premium"}
                            </button>

                            <p className="mt-4 text-center text-xs leading-5 text-[#77716a]">
                                Secure subscription checkout powered by Stripe.
                            </p>
                        </section>
                    </div>
                )}
            </div>
        </main>
    );
}

export default function SubscriptionPage() {
    return (
        <Suspense
            fallback={
                <main className="min-h-screen bg-[#faf8f5] px-4 py-12 sm:px-6 lg:px-8">
                    <div className="mx-auto max-w-5xl animate-pulse rounded-2xl border border-[#e9e2d9] bg-white p-8">
                        <div className="h-5 w-32 rounded bg-[#eee9e2]" />
                        <div className="mt-5 h-10 w-48 rounded bg-[#eee9e2]" />
                    </div>
                </main>
            }
        >
            <SubscriptionContent />
        </Suspense>
    );
}
