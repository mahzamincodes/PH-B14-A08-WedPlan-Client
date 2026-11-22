
import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";

const MAX_FILE_SIZE = 5 * 1024 * 1024;

export async function POST(request) {
    try {
        // Verify authenticated user
        const session = await auth.api.getSession({
            headers: await headers(),
        });

        if (!session?.user) {
            return NextResponse.json(
                { message: "Unauthorized. Please sign in first." },
                { status: 401 }
            );
        }

        const apiKey = process.env.IMGBB_API_KEY;

        if (!apiKey) {
            return NextResponse.json(
                { message: "Image upload is not configured." },
                { status: 500 }
            );
        }

        const formData = await request.formData();
        const image = formData.get("image");

        if (!image || typeof image === "string") {
            return NextResponse.json(
                { message: "Please select an image." },
                { status: 400 }
            );
        }

        if (!image.type.startsWith("image/")) {
            return NextResponse.json(
                { message: "Only image files are allowed." },
                { status: 400 }
            );
        }

        if (image.size > MAX_FILE_SIZE) {
            return NextResponse.json(
                { message: "Image size must be 5 MB or less." },
                { status: 400 }
            );
        }

        const uploadData = new FormData();
        uploadData.append("image", image);

        const response = await fetch(
            `https://api.imgbb.com/1/upload?key=${encodeURIComponent(apiKey)}`,
            {
                method: "POST",
                body: uploadData,
            }
        );

        const result = await response.json();

        if (!response.ok || !result.success || !result.data?.url) {
            return NextResponse.json(
                { message: "Image upload failed. Please try again." },
                { status: 502 }
            );
        }

        return NextResponse.json({
            success: true,
            imageUrl: result.data.url,
        });
    } catch {
        return NextResponse.json(
            { message: "Something went wrong during image upload." },
            { status: 500 }
        );
    }
}
