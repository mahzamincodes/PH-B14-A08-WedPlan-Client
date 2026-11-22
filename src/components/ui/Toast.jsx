
"use client";

import { useEffect, useRef } from "react";
import { motion, useReducedMotion } from "motion/react";
import { useToast } from "./ToastProvider";

function ToastIcon({ variant }) {
    if (variant === "success") {
        return (
            <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                fill="none"
                className="h-5 w-5 shrink-0 text-emerald-400"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
            >
                <polyline points="20 6 9 17 4 12" />
            </svg>
        );
    }

    if (variant === "error") {
        return (
            <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                fill="none"
                className="h-5 w-5 shrink-0 text-red-400"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
            >
                <circle cx="12" cy="12" r="10" />
                <line x1="15" y1="9" x2="9" y2="15" />
                <line x1="9" y1="9" x2="15" y2="15" />
            </svg>
        );
    }

    return (
        <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            fill="none"
            className="h-5 w-5 shrink-0 text-white/70"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="16" x2="12" y2="12" />
            <line x1="12" y1="8" x2="12.01" y2="8" />
        </svg>
    );
}

function ToastItem({ toast, onDismiss }) {
    const { id, title, description, variant, duration } = toast;
    const prefersReducedMotion = useReducedMotion();
    const timerRef = useRef(null);
    const isHoveredRef = useRef(false);

    const variantClasses =
        variant === "error"
            ? "border-red-400/20"
            : variant === "success"
                ? "border-emerald-400/20"
                : "border-white/10";

    useEffect(() => {
        if (prefersReducedMotion || duration <= 0) return;

        let remaining = duration;
        const tick = 50;

        const start = () => {
            timerRef.current = window.setInterval(() => {
                if (!isHoveredRef.current) {
                    remaining -= tick;

                    if (remaining <= 0) {
                        onDismiss(id);
                    }
                }
            }, tick);
        };

        start();

        return () => {
            if (timerRef.current) {
                window.clearInterval(timerRef.current);
            }
        };
    }, [duration, id, onDismiss, prefersReducedMotion]);

    return (
        <motion.div
            initial={prefersReducedMotion ? undefined : { opacity: 0, y: 16 }}
            animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
            exit={
                prefersReducedMotion
                    ? undefined
                    : { opacity: 0, y: -16, scale: 0.95 }
            }
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            onPointerEnter={() => {
                isHoveredRef.current = true;
            }}
            onPointerLeave={() => {
                isHoveredRef.current = false;
            }}
            role={variant === "error" ? "alert" : "status"}
            aria-live={variant === "error" ? "assertive" : "polite"}
            className={`flex items-start gap-3 rounded-xl border bg-[#171717] px-4 py-3.5 text-sm leading-snug text-white shadow-xl ${variantClasses}`}
        >
            <ToastIcon variant={variant} />

            <div className="min-w-0 flex-1">
                {title && (
                    <p className="font-semibold text-white">
                        {title}
                    </p>
                )}

                {description && (
                    <p className="mt-0.5 text-xs leading-relaxed text-white/70">
                        {description}
                    </p>
                )}
            </div>

            <button
                type="button"
                onClick={() => onDismiss(id)}
                aria-label="Dismiss notification"
                className="ml-auto shrink-0 rounded p-1.5 text-white/60 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
                <svg
                    aria-hidden="true"
                    viewBox="0 0 24 24"
                    fill="none"
                    className="h-4 w-4"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
            </button>
        </motion.div>
    );
}

export default function Toast() {
    const { toasts, dismiss } = useToast();

    if (toasts.length === 0) {
        return null;
    }

    return (
        <div
            className="pointer-events-none fixed top-4 right-4 z-[100] flex flex-col gap-3"
            aria-label="Notifications"
        >
            {toasts.map((toast) => (
                <div key={toast.id} className="pointer-events-auto">
                    <ToastItem toast={toast} onDismiss={dismiss} />
                </div>
            ))}
        </div>
    );
}
