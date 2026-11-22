
"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { getAccessToken } from "@/lib/auth-token";

function formatDate(value) {
    if (!value) return "Not available";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) return "Not available";

    return date.toLocaleDateString("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
        timeZone: "Asia/Dhaka",
    });
}

export default function ManageUsersList() {
    const [users, setUsers] = useState([]);
    const [search, setSearch] = useState("");
    const [role, setRole] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [processingId, setProcessingId] = useState("");

    const fetchUsers = useCallback(async () => {
        setLoading(true);
        setError("");

        try {
            const token = await getAccessToken();

            if (!token) {
                throw new Error("Authentication token unavailable.");
            }

            const params = new URLSearchParams();

            if (search.trim()) params.set("search", search.trim());
            if (role) params.set("role", role);

            const response = await fetch(
                `/api/admin/users?${params.toString()}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    cache: "no-store",
                }
            );

            const data = await response.json();

            if (!response.ok || !data.success) {
                throw new Error(data.message || "Failed to load users.");
            }

            setUsers(data.users || []);
        } catch (err) {
            setError(err.message || "Something went wrong.");
        } finally {
            setLoading(false);
        }
    }, [search, role]);

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchUsers();
        }, 0);

        return () => clearTimeout(timer);
    }, [fetchUsers]);

    async function handleBlockToggle(user) {
        const nextStatus = !user.isBlocked;

        setProcessingId(user._id);
        setError("");

        try {
            const token = await getAccessToken();

            if (!token) {
                throw new Error("Authentication token unavailable.");
            }

            const response = await fetch(
                `/api/admin/users/${encodeURIComponent(user._id)}/block`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        isBlocked: nextStatus,
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok || !data.success) {
                throw new Error(data.message || "Failed to update user.");
            }

            setUsers((currentUsers) =>
                currentUsers.map((item) =>
                    item._id === user._id
                        ? { ...item, isBlocked: nextStatus }
                        : item
                )
            );
        } catch (err) {
            setError(err.message || "Failed to update user.");
        } finally {
            setProcessingId("");
        }
    }

    return (
        <section className="space-y-6">
            <div>
                <h1 className="text-2xl font-semibold text-slate-900">
                    Manage Users
                </h1>
                <p className="mt-1 text-sm text-slate-500">
                    View, search, and manage registered users.
                </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-[1fr_200px]">
                <input
                    type="search"
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Search by name or email..."
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-rose-400"
                />

                <select
                    value={role}
                    onChange={(event) => setRole(event.target.value)}
                    className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-rose-400"
                >
                    <option value="">All Roles</option>
                    <option value="Admin">Admin</option>
                    <option value="Vendor">Vendor</option>
                    <option value="Customer">Customer</option>
                </select>
            </div>

            <div className="flex items-center justify-between">
                <p className="text-sm text-slate-500">
                    {loading ? "Loading users..." : `${users.length} users found`}
                </p>

                <button
                    type="button"
                    onClick={fetchUsers}
                    disabled={loading}
                    className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
                >
                    Refresh
                </button>
            </div>

            {error && (
                <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                    <p>{error}</p>
                    <button
                        type="button"
                        onClick={fetchUsers}
                        className="mt-2 font-semibold underline"
                    >
                        Try again
                    </button>
                </div>
            )}

            {loading ? (
                <div className="rounded-xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-500">
                    Loading registered users...
                </div>
            ) : !error && users.length === 0 ? (
                <div className="rounded-xl border border-slate-200 bg-white p-10 text-center">
                    <h3 className="font-semibold text-slate-800">
                        No users found
                    </h3>
                    <p className="mt-1 text-sm text-slate-500">
                        Try changing your search or role filter.
                    </p>
                </div>
            ) : (
                <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
                    <div className="divide-y divide-slate-100">
                        {users.map((user) => (
                            <article
                                key={user._id}
                                className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between"
                            >
                                <div className="flex min-w-0 items-center gap-4">
                                    <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full bg-rose-50">
                                        {user.image ? (
                                            <Image
                                                src={user.image}
                                                alt={user.name || "User"}
                                                fill
                                                sizes="48px"
                                                className="object-cover"
                                            />
                                        ) : (
                                            <div className="flex h-full w-full items-center justify-center text-lg font-semibold text-rose-500">
                                                {(user.name || "U")
                                                    .charAt(0)
                                                    .toUpperCase()}
                                            </div>
                                        )}
                                    </div>

                                    <div className="min-w-0">
                                        <h3 className="truncate font-semibold text-slate-900">
                                            {user.name || "Unnamed User"}
                                        </h3>
                                        <p className="truncate text-sm text-slate-500">
                                            {user.email}
                                        </p>
                                        <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
                                            <span className="rounded-full bg-slate-100 px-2.5 py-1 font-medium text-slate-700">
                                                {user.role}
                                            </span>
                                            <span className="text-slate-400">
                                                Joined {formatDate(user.createdAt)}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex shrink-0 items-center gap-3">
                                    <span
                                        className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
                                            user.isBlocked
                                                ? "bg-red-50 text-red-600"
                                                : "bg-emerald-50 text-emerald-700"
                                        }`}
                                    >
                                        {user.isBlocked ? "Blocked" : "Active"}
                                    </span>

                                    <button
                                        type="button"
                                        onClick={() => handleBlockToggle(user)}
                                        disabled={
                                            processingId === user._id ||
                                            user.role === "Admin"
                                        }
                                        title={
                                            user.role === "Admin"
                                                ? "Admin accounts cannot be blocked here."
                                                : ""
                                        }
                                        className={`rounded-lg px-4 py-2 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 ${
                                            user.isBlocked
                                                ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                                                : "bg-red-50 text-red-600 hover:bg-red-100"
                                        }`}
                                    >
                                        {processingId === user._id
                                            ? "Updating..."
                                            : user.isBlocked
                                              ? "Unblock"
                                              : "Block"}
                                    </button>
                                </div>
                            </article>
                        ))}
                    </div>
                </div>
            )}
        </section>
    );
}
