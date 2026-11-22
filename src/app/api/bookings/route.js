
import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";

const API_BASE_URL = (
    process.env.BACKEND_API_URL || "http://localhost:5000"
).replace(/\/+$/, "");

export async function POST(request) {
    try {
        const session = await auth.api.getSession({
            headers: await headers(),
        });

        if (!session?.user) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Please sign in first.",
                },
                { status: 401 }
            );
        }

        if (session.user.role !== "Customer") {
            return NextResponse.json(
                {
                    success: false,
                    message: "Only customers can create bookings.",
                },
                { status: 403 }
            );
        }

        const authorization = request.headers.get("authorization");

        if (!authorization?.startsWith("Bearer ")) {
            return NextResponse.json(
                {
                    success: false,
                    message: "API access token is required.",
                },
                { status: 401 }
            );
        }

        const body = await request.json();

        const response = await fetch(`${API_BASE_URL}/api/bookings`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: authorization,
            },
            body: JSON.stringify(body),
            cache: "no-store",
        });

        const result = await response.json();

        return NextResponse.json(result, {
            status: response.status,
        });
    } catch (error) {
        console.error("Create booking API error:", error);

        return NextResponse.json(
            {
                success: false,
                message: "Unable to submit booking. Please try again.",
            },
            { status: 500 }
        );
    }
}
