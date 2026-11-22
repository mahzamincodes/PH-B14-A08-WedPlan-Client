
"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { getAccessToken, clearAccessToken } from "@/lib/auth-token";
import { authRoutes } from "@/components/layout/Navbar/navigation";
import { useToast } from "@/components/ui/ToastProvider";

const ROLE_ROUTES = {
    Customer: "/",
    Vendor: "/",
    Admin: "/",
};

function PasswordToggle({ visible, onToggle }) {
    return (
        <button
            type="button"
            onClick={onToggle}
            aria-label={visible ? "Hide password" : "Show password"}
            aria-pressed={visible}
            className="absolute inset-y-0 right-0 flex w-12 items-center justify-center text-ink-soft transition-colors hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-champagne"
        >
            {visible ? (
                <svg
                    aria-hidden="true"
                    viewBox="0 0 24 24"
                    fill="none"
                    className="h-5 w-5"
                    stroke="currentColor"
                    strokeWidth="1.6"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3 3l18 18M10.6 10.6a2 2 0 0 0 2.8 2.8M9.9 5.2A11.2 11.2 0 0 1 12 5c5 0 8.5 4.5 9.5 7-.4 1.1-1.3 2.5-2.7 3.7M6.2 6.2C4.3 7.5 3 9.4 2.5 12c.5 1.4 2.1 4 5.5 5.8A10.8 10.8 0 0 0 12 19c1 0 2-.1 2.9-.4"
                    />
                </svg>
            ) : (
                <svg
                    aria-hidden="true"
                    viewBox="0 0 24 24"
                    fill="none"
                    className="h-5 w-5"
                    stroke="currentColor"
                    strokeWidth="1.6"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M2.5 12S6 5 12 5s9.5 7 9.5 7-3.5 7-9.5 7-9.5-7-9.5-7Z"
                    />
                    <circle cx="12" cy="12" r="3" />
                </svg>
            )}
        </button>
    );
}

export default function SignInForm() {
    const router = useRouter();
    const prefersReducedMotion = useReducedMotion();
    const { toast } = useToast();

    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const [errors, setErrors] = useState({
        email: "",
        password: "",
    });

    const [showPassword, setShowPassword] = useState(false);

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isGoogleLoading, setIsGoogleLoading] = useState(false);

    const updateField = (name, value) => {
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));

        setErrors((prev) => ({
            ...prev,
            [name]: "",
        }));
    };

    const validate = () => {
        const nextErrors = {
            email: "",
            password: "",
        };

        let isValid = true;

        if (!formData.email.trim()) {
            nextErrors.email = "Email address is required.";
            isValid = false;
        } else if (
            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())
        ) {
            nextErrors.email = "Please enter a valid email address.";
            isValid = false;
        }

        if (!formData.password) {
            nextErrors.password = "Password is required.";
            isValid = false;
        }

        setErrors(nextErrors);
        return isValid;
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (isSubmitting || isGoogleLoading) return;

        if (!validate()) return;

        setIsSubmitting(true);

        try {
            const { error } = await authClient.signIn.email({
                email: formData.email.trim(),
                password: formData.password,
            });

            if (error) {
                throw new Error(error.message || "Invalid email or password.");
            }

            const token = await getAccessToken();

            if (!token) {
                throw new Error(
                    "Unable to establish secure API authentication.",
                );
            }

            const sessionResult = await authClient.getSession();

            if (sessionResult.error || !sessionResult.data?.user) {
                clearAccessToken();

                throw new Error(
                    "Unable to verify your account session. Please try again.",
                );
            }

            const role = sessionResult.data.user.role;
            const destination = ROLE_ROUTES[role] || "/";

            toast({
                title: "Welcome Back!",
                description:
                    "You have successfully signed in.",
                variant: "success",
            });

            router.refresh();
            router.replace(destination);
        } catch (error) {
            toast({
                title: "Sign In Failed",
                description:
                    error?.message || "Something went wrong. Please try again.",
                variant: "error",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleGoogleSignIn = async () => {
        if (isSubmitting || isGoogleLoading) return;

        setIsGoogleLoading(true);

        try {
            const { error } = await authClient.signIn.social({
                provider: "google",
                callbackURL: "/?googleSignIn=success",
            });

            if (error) {
                throw new Error(
                    error.message || "Google sign in failed. Please try again.",
                );
            }
        } catch (error) {
            toast({
                title: "Google Sign In Failed",
                description:
                    error?.message || "Unable to sign in with Google.",
                variant: "error",
            });
            setIsGoogleLoading(false);
        }
    };

    return (
        <motion.main
            initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
            animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
            transition={
                prefersReducedMotion
                    ? undefined
                    : { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
            }
            className="w-full px-4 py-12 sm:px-6 sm:py-16 lg:px-8"
        >
            <div className="mx-auto grid w-full max-w-6xl overflow-hidden border border-hairline bg-white shadow-[0_24px_80px_rgba(38,32,27,0.08)] md:grid-cols-2">
                {/* Wedding Introduction */}
                <section className="relative flex min-h-105 flex-col justify-between overflow-hidden bg-ink px-7 py-10 text-ivory sm:px-10 sm:py-12 lg:px-14 lg:py-16">
                    <div
                        aria-hidden="true"
                        className="pointer-events-none absolute -right-28 -top-28 h-80 w-80 rounded-full border border-champagne/20"
                    />
                    <div
                        aria-hidden="true"
                        className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full border border-champagne/20"
                    />
                    <div
                        aria-hidden="true"
                        className="pointer-events-none absolute -bottom-32 -left-20 h-72 w-72 rounded-full border border-champagne/15"
                    />

                    <div className="relative z-10">
                        <p className="text-xs font-medium uppercase tracking-[0.3em] text-champagne">
                            Your day, beautifully planned
                        </p>

                        <div className="mt-16 sm:mt-20">
                            <p className="mb-5 text-sm tracking-[0.2em] text-champagne/80">
                                WELCOME TO
                            </p>

                            <h1 className="font-display text-5xl leading-tight tracking-tight sm:text-6xl lg:text-7xl">
                                WedPlan<span className="text-champagne">.</span>
                            </h1>

                            <div className="mt-7 h-px w-16 bg-champagne" />

                            <p className="mt-7 max-w-md text-sm leading-8 text-ivory/75 sm:text-base">
                                Every beautiful celebration begins with a
                                thoughtful plan. Discover trusted wedding
                                professionals and bring your dream day to life
                                with WedPlan.
                            </p>
                        </div>
                    </div>

                    <div className="relative z-10 mt-16 border-t border-white/15 pt-6">
                        <p className="font-display text-xl italic text-ivory/90 sm:text-2xl">
                            Made for moments that last forever.
                        </p>

                        <p className="mt-3 text-[10px] uppercase tracking-[0.25em] text-champagne/80">
                            Plan with confidence · Celebrate with joy
                        </p>
                    </div>
                </section>

                {/* Sign In Form */}
                <section className="flex items-center justify-center px-6 py-12 sm:px-10 sm:py-14 lg:px-14 lg:py-16">
                    <div className="w-full max-w-md">
                        <div className="mb-9">
                            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-champagne">
                                Welcome back
                            </p>

                            <h2 className="mt-3 font-display text-3xl text-ink sm:text-4xl">
                                Sign in to your account
                            </h2>

                            <p className="mt-3 text-sm leading-7 text-ink-soft">
                                Continue your wedding planning journey. Sign in
                                to explore your WedPlan account.
                            </p>
                        </div>

                        <form
                            onSubmit={handleSubmit}
                            noValidate
                            className="space-y-6"
                        >
                            {/* Email */}
                            <div>
                                <label
                                    htmlFor="email"
                                    className="mb-2 block text-sm font-medium text-ink"
                                >
                                    Email address
                                </label>

                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    placeholder="you@example.com"
                                    value={formData.email}
                                    onChange={(event) =>
                                        updateField("email", event.target.value)
                                    }
                                    disabled={isSubmitting || isGoogleLoading}
                                    aria-invalid={Boolean(errors.email)}
                                    aria-describedby={
                                        errors.email ? "email-error" : undefined
                                    }
                                    className={`w-full border bg-ivory/40 px-4 py-3.5 text-sm text-ink outline-none transition-colors placeholder:text-ink-soft/50 focus:border-champagne focus:bg-white ${
                                        errors.email
                                            ? "border-[#a4553f]"
                                            : "border-hairline"
                                    }`}
                                />

                                {errors.email && (
                                    <p
                                        id="email-error"
                                        role="alert"
                                        className="mt-2 text-xs text-[#a4553f]"
                                    >
                                        {errors.email}
                                    </p>
                                )}
                            </div>

                            {/* Password */}
                            <div>
                                <label
                                    htmlFor="password"
                                    className="mb-2 block text-sm font-medium text-ink"
                                >
                                    Password
                                </label>

                                <div className="relative">
                                    <input
                                        id="password"
                                        name="password"
                                        type={showPassword ? "text" : "password"}
                                        autoComplete="current-password"
                                        placeholder="Enter your password"
                                        value={formData.password}
                                        onChange={(event) =>
                                            updateField(
                                                "password",
                                                event.target.value,
                                            )
                                        }
                                        disabled={isSubmitting || isGoogleLoading}
                                        aria-invalid={Boolean(errors.password)}
                                        aria-describedby={
                                            errors.password
                                                ? "password-error"
                                                : undefined
                                        }
                                        className={`w-full border bg-ivory/40 px-4 py-3.5 pr-12 text-sm text-ink outline-none transition-colors placeholder:text-ink-soft/50 focus:border-champagne focus:bg-white ${
                                            errors.password
                                                ? "border-[#a4553f]"
                                                : "border-hairline"
                                        }`}
                                    />

                                    <PasswordToggle
                                        visible={showPassword}
                                        onToggle={() =>
                                            setShowPassword((prev) => !prev)
                                        }
                                    />
                                </div>

                                {errors.password && (
                                    <p
                                        id="password-error"
                                        role="alert"
                                        className="mt-2 text-xs text-[#a4553f]"
                                    >
                                        {errors.password}
                                    </p>
                                )}
                            </div>

                            {/* Email Sign In */}
                            <button
                                type="submit"
                                disabled={isSubmitting || isGoogleLoading}
                                className="flex w-full items-center justify-center gap-3 bg-ink px-6 py-4 text-xs font-semibold uppercase tracking-[0.2em] text-ivory transition-colors duration-300 hover:bg-champagne hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-champagne focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {isSubmitting && (
                                    <span
                                        aria-hidden="true"
                                        className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
                                    />
                                )}

                                {isSubmitting ? "Signing in..." : "Sign in"}
                            </button>
                        </form>

                        {/* Divider */}
                        <div className="my-7 flex items-center gap-4">
                            <div className="h-px flex-1 bg-hairline" />
                            <span className="text-[10px] uppercase tracking-[0.2em] text-ink-soft">
                                Or continue with
                            </span>
                            <div className="h-px flex-1 bg-hairline" />
                        </div>

                        {/* Google Sign In */}
                        <button
                            type="button"
                            onClick={handleGoogleSignIn}
                            disabled={isSubmitting || isGoogleLoading}
                            className="flex w-full items-center justify-center gap-3 border border-hairline bg-white px-5 py-3.5 text-sm font-medium text-ink transition-colors hover:border-champagne hover:bg-ivory/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-champagne focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {isGoogleLoading ? (
                                <span
                                    aria-hidden="true"
                                    className="h-4 w-4 animate-spin rounded-full border-2 border-ink border-t-transparent"
                                />
                            ) : (
                                <svg
                                    aria-hidden="true"
                                    viewBox="0 0 48 48"
                                    className="h-5 w-5"
                                >
                                    <path
                                        fill="#EA4335"
                                        d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.06 13.22l7.98 6.19C11.93 13.72 17.46 9.5 24 9.5Z"
                                    />
                                    <path
                                        fill="#4285F4"
                                        d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.76 7.18l7.73 6C44.42 37.96 46.98 31.9 46.98 24.55Z"
                                    />
                                    <path
                                        fill="#FBBC05"
                                        d="M10.04 28.59A14.4 14.4 0 0 1 9.27 24c0-1.59.27-3.13.77-4.59l-7.98-6.19A23.9 23.9 0 0 0 0 24c0 3.88.93 7.55 2.58 10.78l7.46-6.19Z"
                                    />
                                    <path
                                        fill="#34A853"
                                        d="M24 48c6.48 0 11.93-2.13 15.91-5.8l-7.73-6c-2.14 1.44-4.87 2.3-8.18 2.3-6.54 0-12.07-4.22-14.06-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48Z"
                                    />
                                </svg>
                            )}

                            {isGoogleLoading
                                ? "Connecting to Google..."
                                : "Continue with Google"}
                        </button>

                        {/* Sign Up */}
                        <p className="mt-8 text-center text-sm text-ink-soft">
                            Don&apos;t have an account?{" "}
                            <Link
                                href={authRoutes.signUp}
                                className="font-semibold text-ink underline decoration-champagne decoration-2 underline-offset-4 transition-colors hover:text-champagne"
                            >
                                Create an account
                            </Link>
                        </p>

                        <div className="mt-10 border-t border-hairline pt-6 text-center">
                            <p className="text-[10px] uppercase tracking-[0.2em] text-ink-soft/70">
                                Thoughtfully planned. Beautifully celebrated.
                            </p>
                        </div>
                    </div>
                </section>
            </div>
        </motion.main>
    );
}
