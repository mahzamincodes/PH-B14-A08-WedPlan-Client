
"use client";

import { useCallback, useEffect, useState } from "react";
import { getAccessToken } from "@/lib/auth-token";
import Image from "next/image";

const STATUS_STYLES = {
    Pending: "bg-amber-50 text-amber-700",
    Approved: "bg-emerald-50 text-emerald-700",
    Rejected: "bg-red-50 text-red-700",
};

const FILTERS = ["All", "Pending", "Approved", "Rejected"];

export default function ManageServicesList() {
    const [services, setServices] = useState([]);
    const [search, setSearch] = useState("");
    const [status, setStatus] = useState("All");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [actionError, setActionError] = useState("");
    const [processingId, setProcessingId] = useState(null);
    const [confirmDeleteId, setConfirmDeleteId] = useState(null);

    const fetchServices = useCallback(async () => {
        try {
            const token = await getAccessToken();

            setLoading(true);
            setError("");

            if (!token) {
                throw new Error("Please sign in again.");
            }

            const params = new URLSearchParams();

            if (search.trim()) {
                params.set("search", search.trim());
            }

            if (status !== "All") {
                params.set("status", status);
            }

            const response = await fetch(
                `/api/admin/services?${params.toString()}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    cache: "no-store",
                },
            );

            const result = await response.json();

            if (!response.ok || !result.success) {
                throw new Error(
                    result.message || "Unable to load services.",
                );
            }

            setServices(
                Array.isArray(result.services) ? result.services : [],
            );
        } catch (err) {
            setError(err.message || "Something went wrong.");
        } finally {
            setLoading(false);
        }
    }, [search, status]);

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchServices();
        }, 0);

        return () => clearTimeout(timer);
    }, [fetchServices]);

    async function handleReview(serviceId, nextStatus) {
        try {
            setProcessingId(serviceId);
            setActionError("");

            const token = await getAccessToken();

            if (!token) {
                throw new Error("Please sign in again.");
            }

            const response = await fetch(
                `/api/admin/services/${encodeURIComponent(serviceId)}/review`,
                {
                    method: "PATCH",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ status: nextStatus }),
                },
            );

            const result = await response.json();

            if (!response.ok || !result.success) {
                throw new Error(
                    result.message || "Unable to review service.",
                );
            }

            await fetchServices();
        } catch (err) {
            setActionError(err.message || "Something went wrong.");
        } finally {
            setProcessingId(null);
        }
    }

    async function handleDelete(serviceId) {
        try {
            setProcessingId(serviceId);
            setActionError("");

            const token = await getAccessToken();

            if (!token) {
                throw new Error("Please sign in again.");
            }

            const response = await fetch(
                `/api/admin/services/${encodeURIComponent(serviceId)}`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                },
            );

            const result = await response.json();

            if (!response.ok || !result.success) {
                throw new Error(
                    result.message || "Unable to delete service.",
                );
            }

            setConfirmDeleteId(null);
            await fetchServices();
        } catch (err) {
            setActionError(err.message || "Something went wrong.");
        } finally {
            setProcessingId(null);
        }
    }

    return (
        <section>
            <div className="mb-6 grid gap-4 sm:grid-cols-2">
                <div>
                    <label
                        htmlFor="service-search"
                        className="mb-2 block text-sm font-medium text-[#51483e]"
                    >
                        Search Services
                    </label>

                    <input
                        id="service-search"
                        type="search"
                        value={search}
                        onChange={(event) => setSearch(event.target.value)}
                        placeholder="Search by name, category or location..."
                        className="w-full rounded-lg border border-[#e9e2d9] bg-white px-4 py-3 text-sm text-[#29251f] outline-none transition focus:border-[#a17b52] focus:ring-2 focus:ring-[#a17b52]/15"
                    />
                </div>

                <div>
                    <label
                        htmlFor="service-status"
                        className="mb-2 block text-sm font-medium text-[#51483e]"
                    >
                        Filter by Status
                    </label>

                    <select
                        id="service-status"
                        value={status}
                        onChange={(event) => setStatus(event.target.value)}
                        className="w-full rounded-lg border border-[#e9e2d9] bg-white px-4 py-3 text-sm text-[#29251f] outline-none focus:border-[#a17b52]"
                    >
                        {FILTERS.map((filter) => (
                            <option key={filter} value={filter}>
                                {filter === "All" ? "All Statuses" : filter}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="mb-5 flex items-center justify-between">
                <p className="text-sm text-[#77716a]">
                    {loading
                        ? "Loading services..."
                        : `${services.length} services found`}
                </p>

                <button
                    type="button"
                    onClick={fetchServices}
                    disabled={loading}
                    className="text-sm font-semibold text-[#967047] hover:text-[#725337] disabled:opacity-50"
                >
                    Refresh
                </button>
            </div>

            {actionError && (
                <p
                    role="alert"
                    className="mb-5 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700"
                >
                    {actionError}
                </p>
            )}

            {loading ? (
                <div className="grid items-stretch gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {[1, 2, 3].map((item) => (
                        <div
                            key={item}
                            className="animate-pulse rounded-xl border border-[#e9e2d9] bg-white p-6"
                        >
                            <div className="h-40 rounded-lg bg-[#eee9e2]" />
                            <div className="mt-4 h-5 w-2/3 rounded bg-[#eee9e2]" />
                            <div className="mt-3 h-4 w-1/2 rounded bg-[#eee9e2]" />
                        </div>
                    ))}
                </div>
            ) : error ? (
                <div className="rounded-xl border border-red-200 bg-white p-8 text-center">
                    <p className="text-sm font-medium text-red-600">
                        {error}
                    </p>

                    <button
                        type="button"
                        onClick={fetchServices}
                        className="mt-4 text-sm font-semibold text-[#967047]"
                    >
                        Try Again
                    </button>
                </div>
            ) : services.length === 0 ? (
                <div className="rounded-xl border border-dashed border-[#d8cbbd] bg-white px-6 py-16 text-center">
                    <h2 className="text-xl font-semibold text-[#29251f]">
                        No Services Found
                    </h2>

                    <p className="mt-3 text-sm text-[#77716a]">
                        No services match your current search or filter.
                    </p>
                </div>
            ) : (
                <div className="grid items-stretch gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {services.map((service) => {
                        const id = String(service._id);
                        const isProcessing = processingId === id;

                        return (
                            <article
                                key={id}
                                className="flex h-full flex-col overflow-hidden rounded-xl border border-[#e9e2d9] bg-white transition-shadow hover:shadow-md"
                            >
                                {service.images?.[0] ? (
                                    <Image
                                        src={service.images[0]}
                                        alt={
                                            service.serviceName ||
                                            "Wedding service"
                                        }
                                        width={600}
                                        height={400}
                                        className="h-48 w-full object-cover"
                                    />
                                ) : (
                                    <div className="flex h-48 items-center justify-center bg-[#f1ece5] text-sm text-[#77716a]">
                                        No Image Available
                                    </div>
                                )}

                                <div className="flex flex-1 flex-col p-5">
                                    <div className="flex items-start justify-between gap-3">
                                        <h2 className="text-lg font-semibold text-[#29251f]">
                                            {service.serviceName}
                                        </h2>

                                        <span
                                            className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${
                                                STATUS_STYLES[service.status] ||
                                                "bg-gray-100 text-gray-700"
                                            }`}
                                        >
                                            {service.status || "Unknown"}
                                        </span>
                                    </div>

                                    <p className="mt-3 text-sm text-[#77716a]">
                                        {service.category}
                                    </p>

                                    <p className="mt-1 text-sm text-[#77716a]">
                                        {service.location}
                                    </p>

                                    <p className="mt-3 text-lg font-semibold text-[#967047]">
                                        ৳
                                        {Number(
                                            service.price,
                                        ).toLocaleString("en-BD")}
                                    </p>

                                    <p className="mt-2 text-xs text-[#77716a]">
                                        Availability:{" "}
                                        {service.isActive === false
                                            ? "Unavailable"
                                            : "Available"}
                                    </p>

                                    <div className="mt-auto pt-5">
                                        {service.status === "Pending" && (
                                            <div className="grid grid-cols-2 gap-3">
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        handleReview(
                                                            id,
                                                            "Approved",
                                                        )
                                                    }
                                                    disabled={
                                                        processingId !== null ||
                                                        confirmDeleteId !== null
                                                    }
                                                    className="rounded-lg bg-emerald-600 px-3 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:opacity-50"
                                                >
                                                    {isProcessing
                                                        ? "Processing..."
                                                        : "Approve"}
                                                </button>

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        handleReview(
                                                            id,
                                                            "Rejected",
                                                        )
                                                    }
                                                    disabled={
                                                        processingId !== null ||
                                                        confirmDeleteId !== null
                                                    }
                                                    className="rounded-lg border border-red-200 px-3 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:opacity-50"
                                                >
                                                    Reject
                                                </button>
                                            </div>
                                        )}

                                        <div className="mt-3">
                                            {confirmDeleteId === id ? (
                                                <div className="rounded-lg border border-red-200 bg-red-50 p-3">
                                                    <p className="text-sm font-medium text-red-800">
                                                        Delete this service
                                                        permanently?
                                                    </p>

                                                    <div className="mt-3 flex gap-2">
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                handleDelete(id)
                                                            }
                                                            disabled={
                                                                processingId !==
                                                                null
                                                            }
                                                            className="rounded-md bg-red-600 px-3 py-2 text-xs font-semibold text-white hover:bg-red-700 disabled:opacity-50"
                                                        >
                                                            {isProcessing
                                                                ? "Deleting..."
                                                                : "Confirm Delete"}
                                                        </button>

                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                setConfirmDeleteId(
                                                                    null,
                                                                )
                                                            }
                                                            disabled={
                                                                processingId !==
                                                                null
                                                            }
                                                            className="rounded-md border border-[#e5ddd3] bg-white px-3 py-2 text-xs font-semibold text-[#51483e]"
                                                        >
                                                            Cancel
                                                        </button>
                                                    </div>
                                                </div>
                                            ) : (
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        setConfirmDeleteId(id)
                                                    }
                                                    disabled={
                                                        processingId !== null
                                                    }
                                                    className="w-full rounded-lg border border-red-200 px-3 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:opacity-50"
                                                >
                                                    Delete Service
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </article>
                        );
                    })}
                </div>
            )}
        </section>
    );
}
