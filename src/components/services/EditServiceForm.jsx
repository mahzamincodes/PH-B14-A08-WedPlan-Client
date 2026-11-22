
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { getAccessToken } from "@/lib/auth-token";

const categories = [
    "Photography & Videography",
    "Wedding Venues",
    "Decoration & Florist",
    "Catering Services",
    "Makeup & Styling",
    "Wedding Fashion",
];

export default function EditServiceForm({ serviceId }) {
    const router = useRouter();

    const [formData, setFormData] = useState({
        serviceName: "",
        category: "",
        description: "",
        price: "",
        location: "",
    });

    const [existingImages, setExistingImages] = useState([]);
    const [newImages, setNewImages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState("");

    useEffect(() => {
        let isMounted = true;

        async function fetchService() {
            try {
                setLoading(true);
                setMessage("");

                const token = await getAccessToken();

                if (!token) {
                    throw new Error(
                        "Unable to verify your session. Please sign in again.",
                    );
                }

                const response = await fetch("/api/services/mine", {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    cache: "no-store",
                });

                const result = await response.json();

                if (!response.ok || !result.success) {
                    throw new Error(
                        result.message || "Unable to load your services.",
                    );
                }

                const service = (result.services || []).find(
                    (item) => String(item._id) === String(serviceId),
                );

                if (!service) {
                    throw new Error(
                        "Service not found or you do not have permission to edit it.",
                    );
                }

                if (isMounted) {
                    setFormData({
                        serviceName: service.serviceName || "",
                        category: service.category || "",
                        description: service.description || "",
                        price: String(service.price ?? ""),
                        location: service.location || "",
                    });

                    setExistingImages(
                        Array.isArray(service.images) ? service.images : [],
                    );
                }
            } catch (error) {
                if (isMounted) {
                    console.error("Fetch service error:", error);

                    setMessage(
                        error.message || "Unable to load your service.",
                    );
                    setMessageType("error");
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        }

        fetchService();

        return () => {
            isMounted = false;
        };
    }, [serviceId]);

    function handleChange(event) {
        const { name, value } = event.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value,
        }));
    }

    function handleImageChange(event) {
        const selectedFiles = Array.from(event.target.files || []);

        if (selectedFiles.some((file) => !file.type.startsWith("image/"))) {
            setMessage("Please select valid image files.");
            setMessageType("error");
            event.target.value = "";
            return;
        }

        if (selectedFiles.some((file) => file.size > 5 * 1024 * 1024)) {
            setMessage("Each image must be 5 MB or less.");
            setMessageType("error");
            event.target.value = "";
            return;
        }

        setNewImages((previous) => [...previous, ...selectedFiles]);
        setMessage("");
        event.target.value = "";
    }

    function removeExistingImage(index) {
        setExistingImages((previous) =>
            previous.filter((_, imageIndex) => imageIndex !== index),
        );
    }

    function removeNewImage(index) {
        setNewImages((previous) =>
            previous.filter((_, imageIndex) => imageIndex !== index),
        );
    }

    async function uploadNewImages(token) {
        const uploadedUrls = [];

        for (const image of newImages) {
            const uploadData = new FormData();
            uploadData.append("image", image);

            const response = await fetch("/api/upload", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: uploadData,
            });

            const result = await response.json();

            if (!response.ok || !result.success || !result.imageUrl) {
                throw new Error(result.message || "Image upload failed.");
            }

            uploadedUrls.push(result.imageUrl);
        }

        return uploadedUrls;
    }

    async function handleSubmit(event) {
        event.preventDefault();

        if (existingImages.length + newImages.length === 0) {
            setMessage("Please keep or upload at least one service image.");
            setMessageType("error");
            return;
        }

        setIsSubmitting(true);
        setMessage("");

        try {
            const token = await getAccessToken();

            if (!token) {
                throw new Error(
                    "Unable to verify your account. Please sign in again.",
                );
            }

            const uploadedUrls = await uploadNewImages(token);

            const payload = {
                serviceName: formData.serviceName.trim(),
                category: formData.category,
                description: formData.description.trim(),
                price: Number(formData.price),
                location: formData.location.trim(),
                images: [...existingImages, ...uploadedUrls],
            };

            const response = await fetch(`/api/services/${serviceId}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(payload),
            });

            const result = await response.json();

            if (!response.ok || !result.success) {
                throw new Error(
                    result.message || "Unable to update your service.",
                );
            }

            router.push("/dashboard/my-services");
            router.refresh();
        } catch (error) {
            console.error("Update service error:", error);

            setMessage(
                error.message || "Something went wrong. Please try again.",
            );
            setMessageType("error");
        } finally {
            setIsSubmitting(false);
        }
    }

    const inputClass =
        "mt-2 w-full rounded-lg border border-[#e5ddd3] bg-white px-4 py-3 text-sm text-[#29251f] outline-none transition focus:border-[#a17b52] focus:ring-2 focus:ring-[#a17b52]/10";

    const labelClass = "text-sm font-medium text-[#39332c]";

    if (loading) {
        return (
            <div className="animate-pulse rounded-2xl border border-[#e9e2d9] bg-white p-8">
                <div className="h-5 w-1/3 rounded bg-[#eee9e2]" />
                <div className="mt-6 h-12 rounded bg-[#eee9e2]" />
                <div className="mt-5 h-12 rounded bg-[#eee9e2]" />
                <div className="mt-5 h-32 rounded bg-[#eee9e2]" />
            </div>
        );
    }

    if (messageType === "error" && !formData.serviceName) {
        return (
            <div className="rounded-xl border border-red-200 bg-white p-8 text-center">
                <p className="font-medium text-red-600">{message}</p>

                <button
                    type="button"
                    onClick={() => router.push("/dashboard/my-services")}
                    className="mt-5 rounded-lg bg-[#967047] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#725337]"
                >
                    Back to My Services
                </button>
            </div>
        );
    }

    return (
        <form
            onSubmit={handleSubmit}
            className="space-y-6 rounded-2xl border border-[#e9e2d9] bg-white p-5 shadow-sm sm:p-8"
        >
            {message && (
                <div
                    role="alert"
                    className={`rounded-lg px-4 py-3 text-sm ${
                        messageType === "success"
                            ? "border border-green-200 bg-green-50 text-green-800"
                            : "border border-red-200 bg-red-50 text-red-700"
                    }`}
                >
                    {message}
                </div>
            )}

            <div>
                <label htmlFor="serviceName" className={labelClass}>
                    Service Name
                </label>
                <input
                    id="serviceName"
                    name="serviceName"
                    type="text"
                    value={formData.serviceName}
                    onChange={handleChange}
                    maxLength={150}
                    className={inputClass}
                    required
                />
            </div>

            <div>
                <label htmlFor="category" className={labelClass}>
                    Service Category
                </label>
                <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className={inputClass}
                    required
                >
                    <option value="">Select a category</option>
                    {categories.map((category) => (
                        <option key={category} value={category}>
                            {category}
                        </option>
                    ))}
                </select>
            </div>

            <div>
                <label htmlFor="description" className={labelClass}>
                    Service Description
                </label>
                <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    maxLength={5000}
                    rows={6}
                    className={`${inputClass} resize-y`}
                    required
                />
                <p className="mt-1 text-right text-xs text-[#8b8177]">
                    {formData.description.length}/5000
                </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
                <div>
                    <label htmlFor="price" className={labelClass}>
                        Price (BDT)
                    </label>
                    <input
                        id="price"
                        name="price"
                        type="number"
                        value={formData.price}
                        onChange={handleChange}
                        min="0.01"
                        step="0.01"
                        className={inputClass}
                        required
                    />
                </div>

                <div>
                    <label htmlFor="location" className={labelClass}>
                        Service Location
                    </label>
                    <input
                        id="location"
                        name="location"
                        type="text"
                        value={formData.location}
                        onChange={handleChange}
                        maxLength={200}
                        className={inputClass}
                        required
                    />
                </div>
            </div>

            <div>
                <label className={labelClass}>Current Service Images</label>

                {existingImages.length > 0 ? (
                    <div className="mt-3 grid grid-cols-2 gap-4 sm:grid-cols-3">
                        {existingImages.map((image, index) => (
                            <div
                                key={`${image}-${index}`}
                                className="overflow-hidden rounded-lg border border-[#e9e2d9]"
                            >
                                <Image
                                    src={image}
                                    alt={`Service image ${index + 1}`}
                                    width={400}
                                    height={300}
                                    className="h-32 w-full object-cover"
                                />

                                <button
                                    type="button"
                                    onClick={() => removeExistingImage(index)}
                                    className="w-full border-t border-[#e9e2d9] py-2 text-xs font-semibold text-red-600 transition hover:bg-red-50"
                                >
                                    Remove Image
                                </button>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="mt-2 text-sm text-[#8b8177]">
                        No existing images. Please upload at least one image.
                    </p>
                )}
            </div>

            <div>
                <label htmlFor="serviceImages" className={labelClass}>
                    Add New Images
                </label>

                <p className="mt-1 text-xs leading-5 text-[#8b8177]">
                    You can keep your existing images and add new ones.
                    Each image must be 5 MB or less.
                </p>

                <input
                    id="serviceImages"
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageChange}
                    className="mt-3 block w-full cursor-pointer rounded-lg border border-dashed border-[#d9cabb] bg-[#faf8f5] p-4 text-sm text-[#77716a] file:mr-4 file:rounded-md file:border-0 file:bg-[#967047] file:px-4 file:py-2 file:text-sm file:font-medium file:text-white hover:file:bg-[#725337]"
                />

                {newImages.length > 0 && (
                    <ul className="mt-4 space-y-2">
                        {newImages.map((image, index) => (
                            <li
                                key={`${image.name}-${image.size}-${index}`}
                                className="flex items-center justify-between gap-3 rounded-lg border border-[#eee7df] px-3 py-2"
                            >
                                <span className="min-w-0 truncate text-sm text-[#51483e]">
                                    {image.name}
                                </span>

                                <button
                                    type="button"
                                    onClick={() => removeNewImage(index)}
                                    className="shrink-0 text-xs font-medium text-red-600 hover:text-red-800"
                                    aria-label={`Remove ${image.name}`}
                                >
                                    Remove
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            <div className="border-t border-[#eee7df] pt-5">
                <p className="mb-4 text-xs leading-5 text-[#8b8177]">
                    Your changes will be saved to your service. Any approval
                    status will remain unchanged.
                </p>

                <div className="flex flex-col gap-3 sm:flex-row">
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full rounded-lg bg-[#967047] px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-[#725337] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
                    >
                        {isSubmitting ? "Updating Service..." : "Save Changes"}
                    </button>

                    <button
                        type="button"
                        disabled={isSubmitting}
                        onClick={() => router.push("/dashboard/my-services")}
                        className="w-full rounded-lg border border-[#e5ddd3] px-6 py-3.5 text-sm font-semibold text-[#51483e] transition hover:bg-[#faf8f5] disabled:opacity-60 sm:w-auto"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </form>
    );
}
