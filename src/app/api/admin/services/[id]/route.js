
import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";

const API_BASE_URL = (
    process.env.BACKEND_API_URL || "http://localhost:5000"
).replace(/\/+$/, "");

export async function DELETE(request, { params }) {
    try {
        const session = await auth.api.getSession({
            headers: await headers(),
        });

        if (!session?.user) {
            return NextResponse.json(
                { success: false, message: "Please sign in first." },
                { status: 401 }
            );
        }

        if (session.user.role !== "Admin") {
            return NextResponse.json(
                { success: false, message: "Admin access required." },
                { status: 403 }
            );
        }

        const authorization = request.headers.get("authorization");

        if (!authorization?.startsWith("Bearer ")) {
            return NextResponse.json(
                { success: false, message: "API access token is required." },
                { status: 401 }
            );
        }

        const { id } = await params;

        const response = await fetch(
            `${API_BASE_URL}/api/services/admin/${encodeURIComponent(id)}`,
            {
                method: "DELETE",
                headers: { Authorization: authorization },
                cache: "no-store",
            }
        );

        const result = await response.json();

        return NextResponse.json(result, { status: response.status });
    } catch (error) {
        console.error("Admin service delete error:", error);

        return NextResponse.json(
            { success: false, message: "Unable to delete service." },
            { status: 500 }
        );
    }
}
