"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { authClient, useSession } from "@/lib/auth-client";
import { clearAccessToken } from "@/lib/auth-token";
import Brand from "./Brand";
import MobileNav from "./MobileNav";
import UserMenu from "./UserMenu";
import { useToast } from "@/components/ui/ToastProvider";
import { authRoutes, mainNavItems } from "./navigation";

function isActivePath(pathname, href) {
    if (!pathname) return false;
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(`${href}/`);
}

function NavLink({ item, isActive }) {
    return (
        <Link
            href={item.href}
            aria-current={isActive ? "page" : undefined}
            className={`group relative inline-flex items-center py-2 text-[11px] font-medium uppercase tracking-[0.2em] transition-colors duration-200 ${
                isActive ? "text-ink" : "text-ink-soft/75 hover:text-ink"
            }`}
        >
            {item.label}
            <span
                aria-hidden="true"
                className={`absolute inset-x-0 -bottom-0.5 h-px origin-left bg-champagne transition-transform duration-300 ease-out ${
                    isActive
                        ? "scale-x-100"
                        : "scale-x-0 group-hover:scale-x-100"
                }`}
            />
        </Link>
    );
}

export default function Navbar() {
    const { data: session, isPending } = useSession();
    const pathname = usePathname();
    const router = useRouter();

    const [isScrolled, setIsScrolled] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isSigningOut, setIsSigningOut] = useState(false);
    const { toast } = useToast();

    const menuButtonRef = useRef(null);
    const user = session?.user ?? null;

    useEffect(() => {
        function handleScroll() {
            setIsScrolled(window.scrollY > 8);
        }

        window.addEventListener("scroll", handleScroll, { passive: true });

        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const openMenu = useCallback(() => {
        setIsMenuOpen(true);
    }, []);

    const closeMenu = useCallback((restoreFocus = true) => {
        setIsMenuOpen(false);
        if (restoreFocus) menuButtonRef.current?.focus();
    }, []);

    async function handleSignOut({ restoreFocus = false } = {}) {
        if (isSigningOut) return false;

        setIsSigningOut(true);

        try {
            const { error } = await authClient.signOut();

            if (error) {
                throw new Error(
                    error.message || "Unable to sign out. Please try again.",
                );
            }

            // Clear the backend JWT after successful logout.
            clearAccessToken();

            toast({
                title: "Signed out",
                description: "You have been signed out successfully.",
                variant: "success",
            });

            setIsMenuOpen(false);

            if (restoreFocus) {
                menuButtonRef.current?.focus();
            }

            router.replace("/");

            return true;
        } catch (error) {
            toast({
                title: "Sign out failed",
                description:
                    error?.message || "Unable to sign out. Please try again.",
                variant: "error",
            });

            return false;
        } finally {
            setIsSigningOut(false);
        }
    }

    return (
        <>
            <header
                className={`sticky top-0 z-50 border-b backdrop-blur-xl transition-[background-color,border-color,box-shadow] duration-300 ${
                    isScrolled
                        ? "border-hairline bg-ivory/85 shadow-[0_20px_45px_-38px_rgba(35,31,28,0.65)]"
                        : "border-transparent bg-ivory/70"
                }`}
            >
                <div className="mx-auto grid h-16 w-full max-w-7xl grid-cols-[1fr_auto] items-center gap-4 px-5 md:h-20 md:grid-cols-[1fr_auto_1fr] md:px-8 lg:px-10">
                    <div className="min-w-0 md:justify-self-start">
                        <Brand />
                    </div>

                    <nav
                        aria-label="Main"
                        className="hidden items-center gap-9 md:flex md:justify-self-center"
                    >
                        {mainNavItems.map((item) => (
                            <NavLink
                                key={item.href}
                                item={item}
                                isActive={isActivePath(pathname, item.href)}
                            />
                        ))}
                    </nav>

                    <div className="flex items-center justify-end gap-1.5 md:justify-self-end md:gap-5">
                        <div className="hidden items-center gap-5 md:flex">
                            {isPending ? (
                                <div
                                    aria-hidden="true"
                                    className="flex items-center gap-3"
                                >
                                    <span className="h-8 w-16 animate-pulse rounded-full bg-ivory-deep" />
                                    <span className="h-9 w-20 animate-pulse rounded-full bg-ivory-deep" />
                                </div>
                            ) : user ? (
                                <UserMenu
                                    user={user}
                                    isSigningOut={isSigningOut}
                                    onSignOut={handleSignOut}
                                />
                            ) : (
                                <>
                                    <Link
                                        href={authRoutes.signIn}
                                        className="text-[11px] font-medium uppercase tracking-[0.2em] text-ink-soft transition-colors duration-200 hover:text-champagne"
                                    >
                                        Sign In
                                    </Link>

                                    <Link
                                        href={authRoutes.signUp}
                                        className="inline-flex items-center justify-center rounded-full bg-ink px-5 py-2.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-ivory transition-colors duration-200 hover:bg-champagne"
                                    >
                                        Sign Up
                                    </Link>
                                </>
                            )}
                        </div>

                        <button
                            ref={menuButtonRef}
                            type="button"
                            onClick={openMenu}
                            aria-expanded={isMenuOpen}
                            aria-controls="mobile-nav"
                            aria-label="Open menu"
                            className="inline-flex size-10 items-center justify-center rounded-full text-ink transition-colors duration-200 hover:bg-ivory-deep md:hidden"
                        >
                            <svg
                                aria-hidden="true"
                                viewBox="0 0 24 24"
                                fill="none"
                                className="h-5 w-5"
                            >
                                <path
                                    d="M4 8h16M4 16h11"
                                    stroke="currentColor"
                                    strokeWidth="1.4"
                                    strokeLinecap="round"
                                />
                            </svg>
                        </button>
                    </div>
                </div>
            </header>

            <MobileNav
                open={isMenuOpen}
                onClose={closeMenu}
                pathname={pathname}
                user={user}
                isPending={isPending}
                isSigningOut={isSigningOut}
                onSignOut={handleSignOut}
            />
        </>
    );
}
