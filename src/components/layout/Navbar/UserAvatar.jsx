"use client";

import { useState } from "react";

const SIZE_CLASSES = {
    sm: "h-9 w-9 text-[11px]",
    md: "h-10 w-10 text-xs",
    lg: "h-12 w-12 text-sm",
};

function getInitials(name) {
    const parts = String(name ?? "")
        .trim()
        .split(/\s+/)
        .filter(Boolean);

    if (parts.length === 0) return "W";

    return parts
        .slice(0, 2)
        .map((part) => part.charAt(0))
        .join("")
        .toUpperCase();
}

export default function UserAvatar({ user, size = "sm", className = "" }) {
    const [failedImage, setFailedImage] = useState(null);

    const name = user?.name?.trim() || "Account";
    const image = user?.image || null;
    const showImage = Boolean(image) && failedImage !== image;

    return (
        <span
            className={`inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full border border-champagne/40 bg-ivory-deep font-sans font-semibold uppercase tracking-[0.06em] text-champagne ${SIZE_CLASSES[size]} ${className}`}
        >
            {showImage ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                    src={image}
                    alt={`${name}'s profile photo`}
                    width={48}
                    height={48}
                    loading="lazy"
                    referrerPolicy="no-referrer"
                    onError={() => setFailedImage(image)}
                    className="h-full w-full object-cover"
                />
            ) : (
                <span aria-hidden="true">{getInitials(name)}</span>
            )}
        </span>
    );
}
