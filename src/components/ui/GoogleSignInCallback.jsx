"use client";

import { useCallback, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import { useToast } from "@/components/ui/ToastProvider";

export default function GoogleSignInCallback() {
    const router = useRouter();
    const pathname = usePathname();
    const { data: session, isPending } = useSession();
    const { toast } = useToast();

    const handleVerify = useCallback(() => {
        if (isPending) return;

        const searchParams = new URLSearchParams(window.location.search);
        const googleSignIn = searchParams.get("googleSignIn");

        if (googleSignIn !== "success") return;

        // Clear the callback param so a refresh does not re-trigger the toast.
        router.replace(pathname);

        if (session?.user) {
            toast({
                title: "Signed in with Google",
                description: "Welcome to WedPlan!",
                variant: "success",
            });
        } else {
            toast({
                title: "Google sign in failed",
                description: "Unable to verify your session. Please try again.",
                variant: "error",
            });
        }
    }, [session, isPending, router, pathname, toast]);

    useEffect(() => {
        handleVerify();
    }, [handleVerify]);

    return null;
}
