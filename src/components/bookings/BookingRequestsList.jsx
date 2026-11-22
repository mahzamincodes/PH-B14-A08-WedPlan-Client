
"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { getAccessToken } from "@/lib/auth-token";

const STATUS_STYLES = {
    Pending: "bg-amber-100 text-amber-700",
    Accepted: "bg-green-100 text-green-700",
    Rejected: "bg-red-100 text-red-700",
    Cancelled: "bg-gray-100 text-gray-600",
};

function formatDate(value) {
    if (!value) return "Not provided";

    const date = value.includes("T")
        ? new Date(value)
        : new Date(`${value}T00:00:00`);

    if (Number.isNaN(date.getTime())) return value;

    return date.toLocaleDateString("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
        timeZone: "Asia/Dhaka",
    });
}

export default function BookingRequestsList() {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [actionError, setActionError] = useState("");
    const [processingId, setProcessingId] = useState("");

    const fetchBookings = useCallback(async () => {
        try {
            setLoading(true);
            setError("");

            const token = await getAccessToken();

            if (!token) {
                throw new Error("Authentication required. Please sign in again.");
            }

            const response = await fetch("/api/bookings/vendor", {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                cache: "no-store",
            });

            const result = await response.json();

            if (!response.ok || !result.success) {
                throw new Error(
                    result.message || "Failed to load booking requests."
                );
            }

            setBookings(
                Array.isArray(result.bookings) ? result.bookings : []
            );
        } catch (err) {
            setError(err.message || "Something went wrong.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchBookings();
        }, 0);

        return () => clearTimeout(timer);
    }, [fetchBookings]);

    const handleStatusUpdate = async (bookingId, status) => {
        try {
            setProcessingId(bookingId);
            setActionError("");

            const token = await getAccessToken();

            if (!token) {
                throw new Error("Authentication required. Please sign in again.");
            }

            const response = await fetch(
                `/api/bookings/${encodeURIComponent(bookingId)}/status`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({ status }),
                }
            );

            const result = await response.json();

            if (!response.ok || !result.success) {
                throw new Error(
                    result.message || `Failed to ${status.toLowerCase()} booking.`
                );
            }

            setBookings((previousBookings) =>
                previousBookings.map((booking) =>
                    booking._id === bookingId
                        ? { ...booking, status }
                        : booking
                )
            );
        } catch (err) {
            setActionError(err.message || "Something went wrong.");
        } finally {
            setProcessingId("");
        }
    };

    if (loading) {
        return (
            <div className="grid gap-5">
                {[1, 2].map((item) => (
                    <div
                        key={item}
                        className="animate-pulse rounded-2xl border border-gray-200 bg-white p-6"
                    >
                        <div className="mb-4 h-6 w-2/3 rounded bg-gray-200" />
                        <div className="mb-3 h-4 w-1/2 rounded bg-gray-200" />
                        <div className="h-4 w-1/3 rounded bg-gray-200" />
                    </div>
                ))}
            </div>
        );
    }

    if (error) {
        return (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center">
                <p className="mb-4 text-sm text-red-600">{error}</p>

                <button
                    type="button"
                    onClick={fetchBookings}
                    className="rounded-lg bg-red-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-red-700"
                >
                    Try Again
                </button>
            </div>
        );
    }

    return (
        <section className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
                <p className="text-sm text-gray-600">
                    <span className="font-semibold text-gray-900">
                        {bookings.length}
                    </span>{" "}
                    booking requests found
                </p>

                <button
                    type="button"
                    onClick={fetchBookings}
                    disabled={loading}
                    className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:border-gray-500 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    Refresh
                </button>
            </div>

            {actionError && (
                <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                    {actionError}
                </div>
            )}

            {bookings.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-16 text-center">
                    <h2 className="text-lg font-semibold text-gray-900">
                        No Booking Requests Yet
                    </h2>

                    <p className="mt-2 text-sm text-gray-500">
                        Customer booking requests will appear here.
                    </p>
                </div>
            ) : (
                <div className="grid gap-5">
                    {bookings.map((booking) => (
                        <article
                            key={booking._id}
                            className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm"
                        >
                            <div className="flex flex-col gap-5 p-5 sm:flex-row sm:p-6">
                                <div className="relative h-48 w-full shrink-0 overflow-hidden rounded-xl bg-gray-100 sm:h-36 sm:w-44">
                                    {booking.serviceImage ? (
                                        <Image
                                            src={booking.serviceImage}
                                            alt={booking.serviceName || "Service"}
                                            fill
                                            sizes="(max-width: 640px) 100vw, 176px"
                                            className="object-cover"
                                        />
                                    ) : (
                                        <div className="flex h-full items-center justify-center text-sm text-gray-400">
                                            No Image
                                        </div>
                                    )}
                                </div>

                                <div className="min-w-0 flex-1">
                                    <div className="flex flex-wrap items-start justify-between gap-3">
                                        <div>
                                            <h2 className="text-lg font-semibold text-gray-900">
                                                {booking.serviceName}
                                            </h2>

                                            <p className="mt-1 text-sm text-gray-500">
                                                {booking.serviceCategory}
                                            </p>
                                        </div>

                                        <span
                                            className={`rounded-full px-3 py-1 text-xs font-semibold ${
                                                STATUS_STYLES[booking.status] ||
                                                STATUS_STYLES.Cancelled
                                            }`}
                                        >
                                            {booking.status}
                                        </span>
                                    </div>

                                    <div className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
                                        <div>
                                            <p className="text-gray-500">
                                                Customer
                                            </p>
                                            <p className="font-medium text-gray-900">
                                                {booking.customer?.name ||
                                                    "Unknown Customer"}
                                            </p>
                                        </div>

                                        <div>
                                            <p className="text-gray-500">
                                                Email
                                            </p>
                                            <p className="break-all font-medium text-gray-900">
                                                {booking.customer?.email ||
                                                    "Not available"}
                                            </p>
                                        </div>

                                        <div>
                                            <p className="text-gray-500">
                                                Event Date
                                            </p>
                                            <p className="font-medium text-gray-900">
                                                {formatDate(booking.eventDate)}
                                            </p>
                                        </div>

                                        <div>
                                            <p className="text-gray-500">
                                                Event Location
                                            </p>
                                            <p className="font-medium text-gray-900">
                                                {booking.eventLocation}
                                            </p>
                                        </div>

                                        <div>
                                            <p className="text-gray-500">
                                                Service Price
                                            </p>
                                            <p className="font-semibold text-gray-900">
                                                ৳
                                                {Number(
                                                    booking.servicePrice || 0
                                                ).toLocaleString("en-US")}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="mt-4 rounded-lg bg-gray-50 p-4">
                                        <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-gray-500">
                                            Customer Message
                                        </p>

                                        <p className="text-sm leading-relaxed text-gray-700">
                                            {booking.message ||
                                                "No message provided."}
                                        </p>
                                    </div>

                                    {booking.status === "Pending" ? (
                                        <div className="mt-5 flex flex-wrap gap-3">
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    handleStatusUpdate(
                                                        booking._id,
                                                        "Accepted"
                                                    )
                                                }
                                                disabled={processingId === booking._id}
                                                className="rounded-lg bg-green-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
                                            >
                                                {processingId === booking._id
                                                    ? "Processing..."
                                                    : "Accept"}
                                            </button>

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    handleStatusUpdate(
                                                        booking._id,
                                                        "Rejected"
                                                    )
                                                }
                                                disabled={processingId === booking._id}
                                                className="rounded-lg border border-red-200 px-5 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                                            >
                                                {processingId === booking._id
                                                    ? "Processing..."
                                                    : "Reject"}
                                            </button>
                                        </div>
                                    ) : (
                                        <p className="mt-5 text-sm font-medium text-gray-500">
                                            This booking request has already been processed.
                                        </p>
                                    )}
                                </div>
                            </div>
                        </article>
                    ))}
                </div>
            )}
        </section>
    );
}
