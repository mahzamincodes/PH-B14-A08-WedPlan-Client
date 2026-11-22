
import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";

const API_BASE_URL =
    process.env.BACKEND_API_URL || "http://localhost:5000";

export async function PATCH(request, { params }) {
    try {
        const session = await auth.api.getSession({
            headers: await headers(),
        });

        if (!session?.user) {
            return NextResponse.json(
                { success: false, message: "Unauthorized." },
                { status: 401 }
            );
        }

        if (session.user.role !== "Admin") {
            return NextResponse.json(
                { success: false, message: "Forbidden." },
                { status: 403 }
            );
        }

        const authorization = request.headers.get("authorization");

        if (!authorization) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Authentication token unavailable.",
                },
                { status: 401 }
            );
        }

        const { id } = await params;
        const body = await request.json();

        if (typeof body.isBlocked !== "boolean") {
            return NextResponse.json(
                { success: false, message: "Invalid block status." },
                { status: 400 }
            );
        }

        const response = await fetch(
            `${API_BASE_URL}/api/admin/users/${encodeURIComponent(id)}/block`,
            {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: authorization,
                },
                body: JSON.stringify({
                    isBlocked: body.isBlocked,
                }),
                cache: "no-store",
            }
        );

        const data = await response.json();

        return NextResponse.json(data, {
            status: response.status,
        });
    } catch (error) {
        console.error("Admin block user API error:", error);

        return NextResponse.json(
            {
                success: false,
                message: "Failed to update user status.",
            },
            { status: 500 }
        );
    }
}
