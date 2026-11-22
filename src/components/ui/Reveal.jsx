"use client";

import { useSyncExternalStore } from "react";
import { motion, useReducedMotion } from "motion/react";

const subscribeToNothing = () => () => {};
const getClientSnapshot = () => true;
const getServerSnapshot = () => false;

/**
 * Adds a subtle entrance to server-rendered content.
 *
 * The server always renders a plain, visible element. The animated element is
 * only mounted after hydration, so blocked or failed JavaScript can never leave
 * content hidden behind an initial opacity of zero.
 */
export default function Reveal({
    as = "div",
    delay = 0,
    distance = 16,
    className = "",
    children,
}) {
    const prefersReducedMotion = useReducedMotion();
    const isHydrated = useSyncExternalStore(
        subscribeToNothing,
        getClientSnapshot,
        getServerSnapshot
    );

    const Tag = as;

    if (!isHydrated || prefersReducedMotion) {
        return <Tag className={className}>{children}</Tag>;
    }

    const MotionTag = motion[as] ?? motion.div;

    return (
        <MotionTag
            className={className}
            initial={{ opacity: 0, y: distance }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "0px 0px -80px 0px" }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay }}
        >
            {children}
        </MotionTag>
    );
}
