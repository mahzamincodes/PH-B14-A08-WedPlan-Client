
"use client";

import { useEffect, useState } from "react";
import { getAccessToken } from "@/lib/auth-token";
import Image from "next/image";
import Link from "next/link";

const STATUS_STYLES = {
    Pending: "bg-amber-50 text-amber-700",
    Approved: "bg-emerald-50 text-emerald-700",
    Rejected: "bg-red-50 text-red-700",
};

export default function MyServicesList() {
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [confirmDeleteId, setConfirmDeleteId] = useState(null);
    const [deletingId, setDeletingId] = useState(null);
    const [deleteError, setDeleteError] = useState("");
    const [updatingAvailabilityId, setUpdatingAvailabilityId] =
        useState(null);
    const [availabilityError, setAvailabilityError] = useState("");

    useEffect(() => {
        let isMounted = true;

        async function fetchMyServices() {
            try {
                setLoading(true);
                setError("");

                const token = await getAccessToken();

                if (!token) {
                    throw new Error(
                        "Unable to verify your session. Please sign in again.",
                    );
                }

                const response = await fetch("/api/services/mine", {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    cache: "no-store",
                });

                const result = await response.json();

                if (!response.ok || !result.success) {
                    throw new Error(
                        result.message || "Unable to load your services.",
                    );
                }

                if (isMounted) {
                    setServices(
                        Array.isArray(result.services) ? result.services : [],
                    );
                }
            } catch (err) {
                if (isMounted) {
                    setError(
                        err.message ||
                            "Something went wrong. Please try again.",
                    );
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        }

        fetchMyServices();

        return () => {
            isMounted = false;
        };
    }, []);

    async function handleDelete(serviceId) {
        setDeletingId(serviceId);
        setDeleteError("");

        try {
            const token = await getAccessToken();

            if (!token) {
                throw new Error(
                    "Unable to verify your session. Please sign in again.",
                );
            }

            const response = await fetch(
                `/api/services/${encodeURIComponent(serviceId)}`,
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
                    result.message || "Unable to delete this service.",
                );
            }

            setServices((previous) =>
                previous.filter(
                    (service) => String(service._id) !== String(serviceId),
                ),
            );

            setConfirmDeleteId(null);
        } catch (err) {
            setDeleteError(
                err.message || "Something went wrong. Please try again.",
            );
        } finally {
            setDeletingId(null);
        }
    }

    async function handleAvailabilityToggle(service) {
        const serviceId = service._id;
        const nextAvailability = service.isActive === false;

        setUpdatingAvailabilityId(serviceId);
        setAvailabilityError("");

        try {
            const token = await getAccessToken();

            if (!token) {
                throw new Error(
                    "Unable to verify your session. Please sign in again.",
                );
            }

            const response = await fetch(
                `/api/services/${encodeURIComponent(serviceId)}`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        isActive: nextAvailability,
                    }),
                },
            );

            const result = await response.json();

            if (!response.ok || !result.success) {
                throw new Error(
                    result.message ||
                        "Unable to update service availability.",
                );
            }

            setServices((previous) =>
                previous.map((item) =>
                    String(item._id) === String(serviceId)
                        ? { ...item, isActive: nextAvailability }
                        : item,
                ),
            );
        } catch (err) {
            setAvailabilityError(
                err.message || "Something went wrong. Please try again.",
            );
        } finally {
            setUpdatingAvailabilityId(null);
        }
    }

    if (loading) {
        return (
            <div className="grid items-stretch gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {[1, 2, 3].map((item) => (
                    <div
                        key={item}
                        className="animate-pulse rounded-xl border border-[#e9e2d9] bg-white p-6"
                    >
                        <div className="h-5 w-2/3 rounded bg-[#eee9e2]" />
                        <div className="mt-4 h-4 w-1/2 rounded bg-[#eee9e2]" />
                        <div className="mt-6 h-4 w-1/3 rounded bg-[#eee9e2]" />
                    </div>
                ))}
            </div>
        );
    }

    if (error) {
        return (
            <div className="rounded-xl border border-red-200 bg-white p-8 text-center">
                <p className="font-medium text-red-600">{error}</p>

                <button
                    type="button"
                    onClick={() => window.location.reload()}
                    className="mt-4 text-sm font-semibold text-[#967047] hover:text-[#725337]"
                >
                    Try Again
                </button>
            </div>
        );
    }

    if (services.length === 0) {
        return (
            <div className="rounded-xl border border-dashed border-[#d8cbbd] bg-white px-6 py-16 text-center">
                <h2 className="text-xl font-semibold text-[#29251f]">
                    No Services Yet
                </h2>

                <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-[#77716a]">
                    You have not added any wedding services yet. Create your
                    first service to get started.
                </p>

                <Link
                    href="/dashboard/add-service"
                    className="mt-6 inline-flex rounded-lg bg-[#967047] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#725337]"
                >
                    Add Your First Service
                </Link>
            </div>
        );
    }

    return (
        <div className="grid items-stretch gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => {
                const isAvailable = service.isActive !== false;
                const isUpdating =
                    updatingAvailabilityId === service._id;

                return (
                    <article
                        key={service._id}
                        className="flex h-full flex-col overflow-hidden rounded-xl border border-[#e9e2d9] bg-white transition-shadow hover:shadow-md"
                    >
                        {service.images?.[0] ? (
                            <Image
                                src={service.images[0]}
                                alt={service.serviceName || "Wedding service"}
                                width={600}
                                height={400}
                                className="h-52 w-full object-cover"
                            />
                        ) : (
                            <div className="flex h-52 items-center justify-center bg-[#f1ece5] text-sm text-[#77716a]">
                                No Image Available
                            </div>
                        )}

                        <div className="flex flex-1 flex-col p-6">
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

                            <div className="mt-3 flex flex-wrap items-center gap-2">
                                <span
                                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                                        isAvailable
                                            ? "bg-emerald-50 text-emerald-700"
                                            : "bg-gray-100 text-gray-600"
                                    }`}
                                >
                                    {isAvailable
                                        ? "Available"
                                        : "Unavailable"}
                                </span>

                                <span className="text-xs text-[#77716a]">
                                    Availability
                                </span>
                            </div>

                            <p className="mt-3 text-sm text-[#77716a]">
                                {service.category}
                            </p>

                            <p className="mt-2 text-sm text-[#77716a]">
                                {service.location}
                            </p>

                            <p className="mt-4 text-lg font-semibold text-[#967047]">
                                ৳{Number(service.price).toLocaleString("en-BD")}
                            </p>

                            {availabilityError && (
                                <p
                                    role="alert"
                                    className="mt-3 text-xs font-medium text-red-600"
                                >
                                    {availabilityError}
                                </p>
                            )}

                            <div className="mt-auto pt-5">
                                <button
                                    type="button"
                                    onClick={() =>
                                        handleAvailabilityToggle(service)
                                    }
                                    disabled={
                                        updatingAvailabilityId !== null ||
                                        deletingId !== null ||
                                        confirmDeleteId !== null
                                    }
                                    className={`w-full rounded-lg border px-3 py-2.5 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 ${
                                        isAvailable
                                            ? "border-amber-200 text-amber-700 hover:bg-amber-50"
                                            : "border-emerald-200 text-emerald-700 hover:bg-emerald-50"
                                    }`}
                                >
                                    {isUpdating
                                        ? "Updating..."
                                        : isAvailable
                                          ? "Mark Unavailable"
                                          : "Make Available"}
                                </button>

                                <div className="mt-3 grid grid-cols-2 gap-3">
                                    <Link
                                        href={`/dashboard/my-services/${service._id}/edit`}
                                        className="inline-flex items-center justify-center rounded-lg border border-[#967047] px-3 py-2.5 text-sm font-semibold text-[#967047] transition hover:bg-[#967047] hover:text-white"
                                    >
                                        Edit Service
                                    </Link>

                                    <button
                                        type="button"
                                        onClick={() => {
                                            setConfirmDeleteId(service._id);
                                            setDeleteError("");
                                        }}
                                        disabled={
                                            deletingId !== null ||
                                            confirmDeleteId !== null ||
                                            updatingAvailabilityId !== null
                                        }
                                        className="rounded-lg border border-red-200 px-3 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        Delete
                                    </button>
                                </div>

                                {confirmDeleteId === service._id && (
                                    <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-4">
                                        <p className="text-sm font-semibold text-red-800">
                                            Are you sure you want to delete this
                                            service?
                                        </p>

                                        <p className="mt-1 text-xs leading-5 text-red-700">
                                            This action cannot be undone.
                                        </p>

                                        {deleteError && (
                                            <p
                                                role="alert"
                                                className="mt-3 text-xs font-medium text-red-700"
                                            >
                                                {deleteError}
                                            </p>
                                        )}

                                        <div className="mt-4 flex gap-3">
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    handleDelete(service._id)
                                                }
                                                disabled={deletingId !== null}
                                                className="rounded-md bg-red-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                                            >
                                                {deletingId === service._id
                                                    ? "Deleting..."
                                                    : "Yes, Delete"}
                                            </button>

                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setConfirmDeleteId(null);
                                                    setDeleteError("");
                                                }}
                                                disabled={deletingId !== null}
                                                className="rounded-md border border-[#e5ddd3] bg-white px-4 py-2 text-xs font-semibold text-[#51483e] transition hover:bg-[#faf8f5] disabled:opacity-60"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </article>
                );
            })}
        </div>
    );
}
