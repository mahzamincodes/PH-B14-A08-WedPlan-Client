
"use client";

import { useCallback, useEffect, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { authRoutes } from "@/components/layout/Navbar/navigation";
import { useToast } from "@/components/ui/ToastProvider";

const ROLES = [
    { value: "Customer", label: "Customer" },
    { value: "Vendor", label: "Vendor" },
];

const MAX_FILE_SIZE = 5 * 1024 * 1024;

const ACCEPTED_IMAGE_TYPES = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
];

function PasswordToggle({ visible, onToggle, label }) {
    return (
        <button
            type="button"
            onClick={onToggle}
            aria-label={visible ? `Hide ${label}` : `Show ${label}`}
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

export default function SignUpForm() {
    const prefersReducedMotion = useReducedMotion();
    const { toast } = useToast();

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        role: "Customer",
    });

    const [errors, setErrors] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        role: "",
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [imageUploadError, setImageUploadError] = useState("");

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isGoogleLoading, setIsGoogleLoading] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        return () => {
            if (imagePreview) {
                URL.revokeObjectURL(imagePreview);
            }
        };
    }, [imagePreview]);

    const updateField = useCallback((name, value) => {
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));

        setErrors((prev) => ({
            ...prev,
            [name]: "",
        }));
    }, []);

    const handleImageChange = (event) => {
        const file = event.target.files?.[0];

        if (!file) return;

        setImageUploadError("");

        if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
            event.target.value = "";
            setImageUploadError(
                "Only JPG, PNG, or WebP images are allowed.",
            );
            return;
        }

        if (file.size > MAX_FILE_SIZE) {
            event.target.value = "";
            setImageUploadError("Image must be 5 MB or smaller.");
            return;
        }

        setImageFile(file);
        setImagePreview(URL.createObjectURL(file));
    };

    const removeImage = () => {
        setImageFile(null);
        setImagePreview(null);
        setImageUploadError("");

        const input = document.getElementById("profile-image");

        if (input) {
            input.value = "";
        }
    };

    const validate = () => {
        const nextErrors = {
            name: "",
            email: "",
            password: "",
            confirmPassword: "",
            role: "",
        };

        let isValid = true;

        if (!formData.name.trim()) {
            nextErrors.name = "Full name is required.";
            isValid = false;
        } else if (formData.name.trim().length < 2) {
            nextErrors.name = "Please enter your full name.";
            isValid = false;
        }

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
        } else {
            const passwordRequirements = [];

            if (formData.password.length < 6) {
                passwordRequirements.push("at least 6 characters");
            }

            if (!/[A-Z]/.test(formData.password)) {
                passwordRequirements.push("one uppercase letter");
            }

            if (!/[a-z]/.test(formData.password)) {
                passwordRequirements.push("one lowercase letter");
            }

            if (passwordRequirements.length > 0) {
                nextErrors.password = `Password needs ${passwordRequirements.join(", ")}.`;
                isValid = false;
            }
        }

        if (!formData.confirmPassword) {
            nextErrors.confirmPassword = "Please confirm your password.";
            isValid = false;
        } else if (formData.password !== formData.confirmPassword) {
            nextErrors.confirmPassword = "Passwords do not match.";
            isValid = false;
        }

        if (!["Customer", "Vendor"].includes(formData.role)) {
            nextErrors.role = "Please select an account type.";
            isValid = false;
        }

        setErrors(nextErrors);

        return isValid;
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (isSubmitting || isGoogleLoading) return;

        setImageUploadError("");

        if (!validate()) return;

        setIsSubmitting(true);

        try {
            let imageUrl = null;

            if (imageFile) {
                setIsUploading(true);

                const uploadFormData = new FormData();
                uploadFormData.append("image", imageFile);

                const uploadResponse = await fetch("/api/upload", {
                    method: "POST",
                    body: uploadFormData,
                });

                const uploadResult = await uploadResponse.json();

                if (!uploadResponse.ok || !uploadResult.imageUrl) {
                    throw new Error(
                        uploadResult.message ||
                            "Profile image upload failed.",
                    );
                }

                imageUrl = uploadResult.imageUrl;
            }

            const { error } = await authClient.signUp.email({
                email: formData.email.trim(),
                password: formData.password,
                name: formData.name.trim(),
                ...(imageUrl ? { image: imageUrl } : {}),
                role: formData.role,
            });

            if (error) {
                throw new Error(
                    error.message || "Unable to create your account.",
                );
            }

            toast({
                title: "Account created",
                description: "Your WedPlan account has been created successfully.",
                variant: "success",
            });

            setSuccess(true);
        } catch (error) {
            toast({
                title: "Registration failed",
                description:
                    error?.message || "Something went wrong. Please try again.",
                variant: "error",
            });
        } finally {
            setIsSubmitting(false);
            setIsUploading(false);
        }
    };

    const handleGoogleSignUp = async () => {
        if (isSubmitting || isGoogleLoading) return;

        setIsGoogleLoading(true);

        try {
            const { error } = await authClient.signIn.social({
                provider: "google",
                callbackURL: "/",
            });

            if (error) {
                throw new Error(
                    error.message || "Google sign up failed. Please try again.",
                );
            }
        } catch (error) {
            toast({
                title: "Google sign up failed",
                description:
                    error?.message || "Unable to sign up with Google.",
                variant: "error",
            });
            setIsGoogleLoading(false);
        }
    };

    const inputClass = (hasError) =>
        `w-full border bg-ivory/40 px-4 py-3.5 text-sm text-ink outline-none transition-colors placeholder:text-ink-soft/50 focus:border-champagne focus:bg-white ${
            hasError ? "border-[#a4553f]" : "border-hairline"
        }`;

    return (
        <motion.main
            initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
            animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
            transition={
                prefersReducedMotion
                    ? undefined
                    : { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
            }
            className="w-full px-4 py-12 sm:px-6 sm:py-1 lg:px-8"
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

                {/* Sign Up Form */}
                <section className="flex items-center justify-center px-6 py-12 sm:px-10 sm:py-14 lg:px-14 lg:py-16">
                    <div className="w-full max-w-md">
                        {success ? (
                            <div className="space-y-6">
                                <div>
                                    <p className="text-xs font-semibold uppercase tracking-[0.25em] text-champagne">
                                        Registration complete
                                    </p>

                                    <h2 className="mt-3 font-display text-3xl text-ink sm:text-4xl">
                                        Account created
                                    </h2>

                                    <p className="mt-3 text-sm leading-7 text-ink-soft">
                                        Your WedPlan account has been created
                                        successfully and you are signed in.
                                    </p>
                                </div>

                                <div className="border border-champagne/30 bg-champagne/5 px-4 py-4 text-sm leading-7 text-ink">
                                    You can now return to the{" "}
                                    <Link
                                        href="/"
                                        className="font-semibold text-ink underline decoration-champagne decoration-2 underline-offset-4 hover:text-champagne"
                                    >
                                        homepage
                                    </Link>
                                    .
                                </div>
                            </div>
                        ) : (
                            <>
                                <div className="mb-8">
                                    <p className="text-xs font-semibold uppercase tracking-[0.25em] text-champagne">
                                        Get started
                                    </p>

                                    <h2 className="mt-3 font-display text-3xl text-ink sm:text-4xl">
                                        Create your account
                                    </h2>

                                    <p className="mt-3 text-sm leading-7 text-ink-soft">
                                        Join WedPlan and start your wedding
                                        planning journey.
                                    </p>
                                </div>

                                <form
                                    onSubmit={handleSubmit}
                                    noValidate
                                    className="space-y-5"
                                >
                                    {/* Full Name */}
                                    <div>
                                        <label
                                            htmlFor="name"
                                            className="mb-2 block text-sm font-medium text-ink"
                                        >
                                            Full name
                                        </label>

                                        <input
                                            id="name"
                                            name="name"
                                            type="text"
                                            autoComplete="name"
                                            placeholder="Your full name"
                                            value={formData.name}
                                            onChange={(event) =>
                                                updateField("name", event.target.value)
                                            }
                                            disabled={isSubmitting || isGoogleLoading}
                                            aria-invalid={Boolean(errors.name)}
                                            aria-describedby={
                                                errors.name ? "name-error" : undefined
                                            }
                                            className={inputClass(errors.name)}
                                        />

                                        {errors.name && (
                                            <p
                                                id="name-error"
                                                role="alert"
                                                className="mt-2 text-xs text-[#a4553f]"
                                            >
                                                {errors.name}
                                            </p>
                                        )}
                                    </div>

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
                                            className={inputClass(errors.email)}
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
                                                autoComplete="new-password"
                                                placeholder="Create a password"
                                                value={formData.password}
                                                onChange={(event) =>
                                                    updateField("password", event.target.value)
                                                }
                                                disabled={isSubmitting || isGoogleLoading}
                                                aria-invalid={Boolean(errors.password)}
                                                aria-describedby={
                                                    errors.password ? "password-error" : undefined
                                                }
                                                className={`${inputClass(errors.password)} pr-12`}
                                            />

                                            <PasswordToggle
                                                visible={showPassword}
                                                onToggle={() =>
                                                    setShowPassword((prev) => !prev)
                                                }
                                                label="password"
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

                                        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[10px] uppercase tracking-widest text-ink-soft/70">
                                            <span
                                                className={
                                                    formData.password.length >= 6
                                                        ? "text-champagne"
                                                        : ""
                                                }
                                            >
                                                6+ characters
                                            </span>

                                            <span
                                                className={
                                                    /[A-Z]/.test(formData.password)
                                                        ? "text-champagne"
                                                        : ""
                                                }
                                            >
                                                One uppercase
                                            </span>

                                            <span
                                                className={
                                                    /[a-z]/.test(formData.password)
                                                        ? "text-champagne"
                                                        : ""
                                                }
                                            >
                                                One lowercase
                                            </span>
                                        </div>
                                    </div>

                                    {/* Confirm Password */}
                                    <div>
                                        <label
                                            htmlFor="confirm-password"
                                            className="mb-2 block text-sm font-medium text-ink"
                                        >
                                            Confirm password
                                        </label>

                                        <div className="relative">
                                            <input
                                                id="confirm-password"
                                                name="confirm-password"
                                                type={
                                                    showConfirmPassword
                                                        ? "text"
                                                        : "password"
                                                }
                                                autoComplete="new-password"
                                                placeholder="Confirm your password"
                                                value={formData.confirmPassword}
                                                onChange={(event) =>
                                                    updateField(
                                                        "confirmPassword",
                                                        event.target.value,
                                                    )
                                                }
                                                disabled={isSubmitting || isGoogleLoading}
                                                aria-invalid={Boolean(
                                                    errors.confirmPassword,
                                                )}
                                                aria-describedby={
                                                    errors.confirmPassword
                                                        ? "confirm-password-error"
                                                        : undefined
                                                }
                                                className={`${inputClass(errors.confirmPassword)} pr-12`}
                                            />

                                            <PasswordToggle
                                                visible={showConfirmPassword}
                                                onToggle={() =>
                                                    setShowConfirmPassword((prev) => !prev)
                                                }
                                                label="confirm password"
                                            />
                                        </div>

                                        {errors.confirmPassword && (
                                            <p
                                                id="confirm-password-error"
                                                role="alert"
                                                className="mt-2 text-xs text-[#a4553f]"
                                            >
                                                {errors.confirmPassword}
                                            </p>
                                        )}
                                    </div>

                                    {/* Account Type */}
                                    <div>
                                        <p className="mb-2 block text-sm font-medium text-ink">
                                            Account type
                                        </p>

                                        <div className="grid grid-cols-2 gap-3">
                                            {ROLES.map((role) => {
                                                const selected =
                                                    formData.role === role.value;

                                                return (
                                                    <button
                                                        key={role.value}
                                                        type="button"
                                                        role="radio"
                                                        aria-checked={selected}
                                                        onClick={() =>
                                                            updateField("role", role.value)
                                                        }
                                                        disabled={isSubmitting || isGoogleLoading}
                                                        className={`border px-4 py-3.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-champagne disabled:cursor-not-allowed disabled:opacity-60 ${
                                                            selected
                                                                ? "border-champagne bg-champagne/10 text-ink"
                                                                : "border-hairline bg-ivory/40 text-ink-soft hover:border-champagne"
                                                        }`}
                                                    >
                                                        {role.label}
                                                    </button>
                                                );
                                            })}
                                        </div>

                                        {errors.role && (
                                            <p
                                                role="alert"
                                                className="mt-2 text-xs text-[#a4553f]"
                                            >
                                                {errors.role}
                                            </p>
                                        )}
                                    </div>

                                    {/* Profile Image */}
                                    <div>
                                        <label
                                            htmlFor="profile-image"
                                            className="mb-2 block text-sm font-medium text-ink"
                                        >
                                            Profile image{" "}
                                            <span className="font-normal text-ink-soft">
                                                (optional)
                                            </span>
                                        </label>

                                        <div className="border border-hairline bg-ivory/40 p-4">
                                            <div className="flex items-center gap-4">
                                                {imagePreview ? (
                                                    <>
                                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                                        <img
                                                            src={imagePreview}
                                                            alt="Profile preview"
                                                            className="h-16 w-16 rounded-full border border-hairline object-cover"
                                                        />
                                                    </>
                                                ) : (
                                                    <div className="flex h-16 w-16 items-center justify-center rounded-full border border-hairline bg-white text-ink-soft">
                                                        <svg
                                                            aria-hidden="true"
                                                            viewBox="0 0 24 24"
                                                            fill="none"
                                                            className="h-7 w-7"
                                                            stroke="currentColor"
                                                            strokeWidth="1.5"
                                                        >
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                d="M20 21a8 8 0 0 0-16 0m8-10a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z"
                                                            />
                                                        </svg>
                                                    </div>
                                                )}

                                                <div className="min-w-0 flex-1">
                                                    <label
                                                        htmlFor="profile-image"
                                                        className="inline-flex cursor-pointer border border-hairline bg-white px-4 py-2.5 text-xs font-semibold uppercase tracking-[0.12em] text-ink transition-colors hover:border-champagne"
                                                    >
                                                        {imageFile ? "Change photo" : "Choose photo"}
                                                    </label>

                                                    <input
                                                        id="profile-image"
                                                        name="profile-image"
                                                        type="file"
                                                        accept="image/jpeg,image/jpg,image/png,image/webp"
                                                        onChange={handleImageChange}
                                                        disabled={isSubmitting || isGoogleLoading}
                                                        className="sr-only"
                                                    />

                                                    <p className="mt-2 text-xs text-ink-soft">
                                                        JPG, PNG or WebP · Max 5 MB
                                                    </p>

                                                    {imageFile && (
                                                        <p className="mt-1 truncate text-xs text-ink">
                                                            {imageFile.name}
                                                        </p>
                                                    )}
                                                </div>

                                                {imageFile && (
                                                    <button
                                                        type="button"
                                                        onClick={removeImage}
                                                        disabled={isSubmitting || isGoogleLoading}
                                                        className="text-xs font-medium text-[#a4553f] underline underline-offset-4 disabled:opacity-50"
                                                    >
                                                        Remove
                                                    </button>
                                                )}
                                            </div>

                                            {imageUploadError && (
                                                <p
                                                    role="alert"
                                                    className="mt-3 text-xs text-[#a4553f]"
                                                >
                                                    {imageUploadError}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Create Account */}
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

                                        {isUploading
                                            ? "Uploading image..."
                                            : isSubmitting
                                              ? "Creating account..."
                                              : "Create account"}
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

                                {/* Google Sign Up */}
                                <button
                                    type="button"
                                    onClick={handleGoogleSignUp}
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
                                                d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
                                            />
                                            <path
                                                fill="#4285F4"
                                                d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.74 7.18l7.26 5.64c4.24-3.92 7.52-9.72 7.52-17.29z"
                                            />
                                            <path
                                                fill="#FBBC05"
                                                d="M10.53 28.59A14.4 14.4 0 0 1 9.75 24c0-1.6.28-3.14.78-4.59l-7.98-6.19A23.9 23.9 0 0 0 0 24c0 3.88.93 7.56 2.56 10.78l7.97-6.19z"
                                            />
                                            <path
                                                fill="#34A853"
                                                d="M24 48c6.48 0 11.92-2.13 15.9-6.16l-7.26-5.64c-2.01 1.35-4.6 2.15-8.64 2.15-6.26 0-11.57-4.22-13.47-9.91l-7.97 6.19C6.51 42.62 14.62 48 24 48z"
                                            />
                                        </svg>
                                    )}

                                    {isGoogleLoading
                                        ? "Connecting to Google..."
                                        : "Continue with Google"}
                                </button>

                                {/* Sign In Link */}
                                <p className="mt-8 text-center text-sm text-ink-soft">
                                    Already have an account?{" "}
                                    <Link
                                        href={authRoutes.signIn}
                                        className="font-semibold text-ink underline decoration-champagne decoration-2 underline-offset-4 transition-colors hover:text-champagne"
                                    >
                                        Sign in
                                    </Link>
                                </p>

                                <div className="mt-10 border-t border-hairline pt-6 text-center">
                                    <p className="text-[10px] uppercase tracking-[0.2em] text-ink-soft/70">
                                        Thoughtfully planned. Beautifully
                                        celebrated.
                                    </p>
                                </div>
                            </>
                        )}
                    </div>
                </section>
            </div>
        </motion.main>
    );
}
