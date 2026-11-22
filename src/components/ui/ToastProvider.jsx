"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";

const DEFAULT_DURATION_MS = 5000;

const ToastContext = createContext(null);

export function useToast() {
    const context = useContext(ToastContext);

    if (!context) {
        throw new Error("useToast must be used within a ToastProvider.");
    }

    return context;
}

export function ToastProvider({ children }) {
    const [toasts, setToasts] = useState([]);

    const toast = useCallback(
        ({ title, description, variant = "default", duration = DEFAULT_DURATION_MS }) => {
            const id = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

            setToasts((prev) => [
                ...prev,
                {
                    id,
                    title,
                    description,
                    variant,
                    duration,
                    createdAt: Date.now(),
                },
            ]);

            return id;
        },
        [],
    );

    const dismiss = useCallback((id) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    }, []);

    const dismissAll = useCallback(() => {
        setToasts([]);
    }, []);

    const value = useMemo(
        () => ({ toasts, toast, dismiss, dismissAll }),
        [toasts, toast, dismiss, dismissAll],
    );

    return <ToastContext.Provider value={value}>{children}</ToastContext.Provider>;
}
