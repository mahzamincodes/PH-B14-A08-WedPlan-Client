"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import UserAvatar from "./UserAvatar";
import { profileMenuItems } from "./navigation";

const PROFILE_ICONS = {
    dashboard: DashboardIcon,
    settings: SettingsIcon,
};

export default function UserMenu({ user, isSigningOut, onSignOut }) {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef(null);
    const triggerRef = useRef(null);
    const panelId = useId();

    const displayName = user?.name?.trim() || "Account";

    useEffect(() => {
        if (!isOpen) return;

        function handlePointerDown(event) {
            if (!containerRef.current?.contains(event.target)) {
                setIsOpen(false);
            }
        }

        function handleKeyDown(event) {
            if (event.key === "Escape") {
                setIsOpen(false);
                triggerRef.current?.focus();
            }
        }

        document.addEventListener("pointerdown", handlePointerDown);
        document.addEventListener("keydown", handleKeyDown);

        return () => {
            document.removeEventListener("pointerdown", handlePointerDown);
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [isOpen]);

    async function handleLogout() {
        const didSignOut = await onSignOut();
        if (didSignOut) setIsOpen(false);
    }

    return (
        <div ref={containerRef} className="relative">
            <button
                ref={triggerRef}
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                aria-label={`Open profile menu for ${displayName}`}
                onClick={() => setIsOpen((open) => !open)}
                className={`flex items-center gap-2 rounded-full border py-1 pl-1 pr-2.5 transition-colors duration-200 ${
                    isOpen
                        ? "border-champagne/45 bg-white/70"
                        : "border-transparent hover:border-hairline hover:bg-white/60"
                }`}
            >
                <UserAvatar user={user} size="sm" />
                <span className="hidden max-w-28 truncate text-[12px] font-medium text-ink xl:block">
                    {displayName}
                </span>
                <ChevronIcon
                    className={`h-3.5 w-3.5 text-muted transition-transform duration-200 ${
                        isOpen ? "rotate-180" : ""
                    }`}
                />
            </button>

            <div
                id={panelId}
                aria-hidden={!isOpen}
                inert={!isOpen}
                className={`absolute right-0 top-[calc(100%+0.6rem)] z-50 w-[17rem] origin-top-right overflow-hidden rounded-2xl border border-hairline bg-ivory shadow-[0_28px_60px_-30px_rgba(35,31,28,0.45)] transition duration-200 ease-out ${
                    isOpen
                        ? "visible translate-y-0 scale-100 opacity-100"
                        : "invisible -translate-y-1 scale-[0.98] opacity-0"
                }`}
            >
                <div className="flex items-center gap-3 px-4 py-4">
                    <UserAvatar user={user} size="md" />
                    <div className="min-w-0">
                        <p className="truncate font-display text-lg leading-snug text-ink">
                            {displayName}
                        </p>
                        <p className="mt-0.5 text-[10px] uppercase tracking-[0.2em] text-muted">
                            Signed in
                        </p>
                    </div>
                </div>

                <div className="h-px bg-hairline" />

                <ul className="p-2">
                    {profileMenuItems.map((item) => {
                        const Icon = PROFILE_ICONS[item.icon];

                        return (
                            <li key={item.href}>
                                <Link
                                    href={item.href}
                                    onClick={() => setIsOpen(false)}
                                    className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-medium text-ink-soft transition-colors duration-150 hover:bg-ivory-deep hover:text-ink"
                                >
                                    {Icon ? <Icon /> : null}
                                    {item.label}
                                </Link>
                            </li>
                        );
                    })}
                </ul>

                <div className="h-px bg-hairline" />

                <div className="p-2">
                    <button
                        type="button"
                        onClick={handleLogout}
                        disabled={isSigningOut}
                        className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-[13px] font-medium text-ink-soft transition-colors duration-150 hover:bg-[#f6e8e2] hover:text-[#a4553f] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        <LogoutIcon />
                        {isSigningOut ? "Signing out…" : "Logout"}
                    </button>
                </div>
            </div>
        </div>
    );
}

function ChevronIcon({ className = "h-4 w-4" }) {
    return (
        <svg aria-hidden="true" viewBox="0 0 16 16" fill="none" className={className}>
            <path
                d="m4 6 4 4 4-4"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}

function DashboardIcon() {
    return (
        <svg
            aria-hidden="true"
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.2"
            className="h-4 w-4 shrink-0 text-muted"
        >
            <rect x="2" y="2" width="5" height="5" rx="1" />
            <rect x="9" y="2" width="5" height="5" rx="1" />
            <rect x="2" y="9" width="5" height="5" rx="1" />
            <rect x="9" y="9" width="5" height="5" rx="1" />
        </svg>
    );
}

function SettingsIcon() {
    return (
        <svg
            aria-hidden="true"
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinecap="round"
            className="h-4 w-4 shrink-0 text-muted"
        >
            <path d="M3 5.5h4.5M11.5 5.5H13M3 10.5h4.5M11.5 10.5H13" />
            <circle cx="9.5" cy="5.5" r="1.7" />
            <circle cx="7.5" cy="10.5" r="1.7" />
        </svg>
    );
}

function LogoutIcon() {
    return (
        <svg
            aria-hidden="true"
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-4 w-4 shrink-0 text-muted"
        >
            <path d="M9.5 4.5h-4c-.83 0-1.5.67-1.5 1.5v4c0 .83.67 1.5 1.5 1.5h4" />
            <path d="M7 8h6.5M11 5.5 13.5 8 11 10.5" />
        </svg>
    );
}
