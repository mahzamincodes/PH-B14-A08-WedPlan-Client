
import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";

const API_BASE_URL = (
    process.env.BACKEND_API_URL || "http://localhost:5000"
).replace(/\/+$/, "");

export async function GET(request) {
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

        const searchParams = new URL(request.url).searchParams;
        const query = new URLSearchParams();

        const search = searchParams.get("search");
        const status = searchParams.get("status");

        if (search) query.set("search", search);
        if (status) query.set("status", status);

        const response = await fetch(
            `${API_BASE_URL}/api/services/admin/all?${query.toString()}`,
            {
                headers: { Authorization: authorization },
                cache: "no-store",
            }
        );

        const result = await response.json();

        return NextResponse.json(result, { status: response.status });
    } catch (error) {
        console.error("Admin services fetch error:", error);

        return NextResponse.json(
            { success: false, message: "Unable to load services." },
            { status: 500 }
        );
    }
}
