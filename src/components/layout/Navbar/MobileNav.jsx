"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import Brand from "./Brand";
import UserAvatar from "./UserAvatar";
import { authRoutes, mainNavItems, profileMenuItems } from "./navigation";

function isActivePath(pathname, href) {
    if (!pathname) return false;
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(`${href}/`);
}

export default function MobileNav({
    open,
    onClose,
    pathname,
    user,
    isPending,
    isSigningOut,
    onSignOut,
}) {
    const panelRef = useRef(null);
    const closeButtonRef = useRef(null);

    useEffect(() => {
        if (!open) return;

        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";

        return () => {
            document.body.style.overflow = previousOverflow;
        };
    }, [open]);

    useEffect(() => {
        if (!open) return;

        const focusTimer = window.setTimeout(() => closeButtonRef.current?.focus(), 80);

        function handleKeyDown(event) {
            if (event.key === "Escape") {
                onClose();
                return;
            }

            if (event.key !== "Tab") return;

            const focusable = panelRef.current?.querySelectorAll(
                'a[href], button:not([disabled])'
            );
            if (!focusable || focusable.length === 0) return;

            const first = focusable[0];
            const last = focusable[focusable.length - 1];

            if (event.shiftKey && document.activeElement === first) {
                event.preventDefault();
                last.focus();
            } else if (!event.shiftKey && document.activeElement === last) {
                event.preventDefault();
                first.focus();
            }
        }

        document.addEventListener("keydown", handleKeyDown);

        return () => {
            window.clearTimeout(focusTimer);
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [open, onClose]);

    useEffect(() => {
        if (!open) return;

        const query = window.matchMedia("(min-width: 768px)");

        function handleChange(event) {
            if (event.matches) onClose(false);
        }

        query.addEventListener("change", handleChange);

        return () => query.removeEventListener("change", handleChange);
    }, [open, onClose]);

    const displayName = user?.name?.trim() || "Account";

    return (
        <div
            id="mobile-nav"
            aria-hidden={!open}
            className={`fixed inset-0 z-[60] overflow-hidden md:hidden ${
                open ? "" : "pointer-events-none"
            }`}
        >
            <div
                aria-hidden="true"
                onClick={() => onClose()}
                className={`absolute inset-0 bg-ink/35 backdrop-blur-sm transition-opacity duration-300 ${
                    open ? "opacity-100" : "opacity-0"
                }`}
            />

            <div
                ref={panelRef}
                role="dialog"
                aria-modal={open ? "true" : undefined}
                aria-label="Site menu"
                inert={!open}
                className={`absolute inset-y-0 right-0 flex h-full w-full max-w-[24rem] flex-col bg-ivory shadow-[-24px_0_60px_-40px_rgba(35,31,28,0.5)] transition-transform duration-300 ease-out ${
                    open ? "translate-x-0" : "translate-x-full"
                }`}
            >
                <div className="flex items-center justify-between border-b border-hairline px-5 py-4">
                    <Brand onNavigate={() => onClose(false)} />
                    <button
                        ref={closeButtonRef}
                        type="button"
                        onClick={() => onClose()}
                        aria-label="Close menu"
                        className="inline-flex size-10 items-center justify-center rounded-full text-ink-soft transition-colors duration-200 hover:bg-ivory-deep hover:text-ink"
                    >
                        <CloseIcon />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto overscroll-contain px-5 pb-8 pt-7">
                    <p className="text-[11px] font-medium uppercase tracking-[0.24em] text-muted">
                        Menu
                    </p>

                    <nav aria-label="Mobile navigation" className="mt-5">
                        <ul>
                            {mainNavItems.map((item, index) => {
                                const active = isActivePath(pathname, item.href);

                                return (
                                    <li key={item.href}>
                                        <Link
                                            href={item.href}
                                            onClick={() => onClose(false)}
                                            aria-current={active ? "page" : undefined}
                                            className="group flex items-center justify-between gap-4 border-b border-hairline py-5"
                                        >
                                            <span className="flex items-baseline gap-4">
                                                <span className="text-[11px] font-medium tracking-[0.2em] text-champagne">
                                                    0{index + 1}
                                                </span>
                                                <span
                                                    className={`font-display text-[30px] leading-none transition-colors duration-200 ${
                                                        active
                                                            ? "text-ink"
                                                            : "text-ink-soft group-hover:text-ink"
                                                    }`}
                                                >
                                                    {item.label}
                                                </span>
                                            </span>
                                            <ArrowIcon active={active} />
                                        </Link>
                                    </li>
                                );
                            })}
                        </ul>
                    </nav>
                </div>

                <div className="border-t border-hairline px-5 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-5">
                    {isPending ? (
                        <div aria-hidden="true" className="space-y-3">
                            <div className="h-12 animate-pulse rounded-full bg-ivory-deep" />
                            <div className="h-12 animate-pulse rounded-full bg-ivory-deep" />
                        </div>
                    ) : user ? (
                        <div className="space-y-4">
                            <div className="flex items-center gap-3 rounded-2xl border border-hairline bg-white/55 p-4">
                                <UserAvatar user={user} size="md" />
                                <div className="min-w-0">
                                    <p className="truncate font-display text-xl leading-tight text-ink">
                                        {displayName}
                                    </p>
                                    <p className="mt-1 text-[11px] uppercase tracking-[0.2em] text-muted">
                                        Signed in
                                    </p>
                                </div>
                            </div>

                            <nav
                                aria-label="Profile"
                                className="overflow-hidden rounded-2xl border border-hairline"
                            >
                                {profileMenuItems.map((item, index) => (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        onClick={() => onClose(false)}
                                        className={`flex items-center justify-between px-4 py-3.5 text-[13px] font-medium text-ink-soft transition-colors duration-150 hover:bg-white/60 hover:text-ink ${
                                            index > 0 ? "border-t border-hairline" : ""
                                        }`}
                                    >
                                        {item.label}
                                        <ChevronRightIcon />
                                    </Link>
                                ))}
                            </nav>

                            <button
                                type="button"
                                onClick={() => onSignOut({ restoreFocus: true })}
                                disabled={isSigningOut}
                                className="flex w-full items-center justify-center rounded-full border border-hairline px-5 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-[#a4553f] transition-colors duration-200 hover:border-[#a4553f]/40 hover:bg-[#f6e8e2] disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {isSigningOut ? "Signing out…" : "Logout"}
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            <Link
                                href={authRoutes.signIn}
                                onClick={() => onClose(false)}
                                className="flex w-full items-center justify-center rounded-full border border-ink/15 px-5 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-ink transition-colors duration-200 hover:border-champagne hover:text-champagne"
                            >
                                Sign In
                            </Link>
                            <Link
                                href={authRoutes.signUp}
                                onClick={() => onClose(false)}
                                className="flex w-full items-center justify-center rounded-full bg-ink px-5 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-ivory transition-colors duration-200 hover:bg-champagne"
                            >
                                Sign Up
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

function CloseIcon() {
    return (
        <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className="h-5 w-5">
            <path
                d="M6 6l12 12M18 6 6 18"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="round"
            />
        </svg>
    );
}

function ArrowIcon({ active }) {
    return (
        <svg
            aria-hidden="true"
            viewBox="0 0 16 16"
            fill="none"
            className={`h-4 w-4 shrink-0 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 ${
                active ? "text-champagne" : "text-muted"
            }`}
        >
            <path
                d="M4.5 11.5 11.5 4.5M6 4.5h5.5V10"
                stroke="currentColor"
                strokeWidth="1.2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}

function ChevronRightIcon() {
    return (
        <svg aria-hidden="true" viewBox="0 0 16 16" fill="none" className="h-3.5 w-3.5 text-muted">
            <path
                d="m6 3.5 4.5 4.5L6 12.5"
                stroke="currentColor"
                strokeWidth="1.3"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}
