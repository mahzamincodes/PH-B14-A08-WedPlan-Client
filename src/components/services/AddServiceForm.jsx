
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { getAccessToken } from "@/lib/auth-token";

const categories = [
    "Photography & Videography",
    "Wedding Venues",
    "Decoration & Florist",
    "Catering Services",
    "Makeup & Styling",
    "Wedding Fashion",
];

const initialFormData = {
    serviceName: "",
    category: "",
    description: "",
    price: "",
    location: "",
};

export default function AddServiceForm() {
    const router = useRouter();

    const [formData, setFormData] = useState(initialFormData);
    const [images, setImages] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState("");

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

        setImages((previous) => [...previous, ...selectedFiles]);
        setMessage("");
        event.target.value = "";
    }

    function removeImage(index) {
        setImages((previous) =>
            previous.filter((_, imageIndex) => imageIndex !== index),
        );
    }

    async function uploadImages() {
        const uploadedUrls = [];

        for (const image of images) {
            const uploadData = new FormData();
            uploadData.append("image", image);

            const response = await fetch("/api/upload", {
                method: "POST",
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

        if (images.length === 0) {
            setMessage("Please upload at least one service image.");
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

            const imageUrls = await uploadImages();

            const payload = {
                serviceName: formData.serviceName.trim(),
                category: formData.category,
                description: formData.description.trim(),
                price: Number(formData.price),
                location: formData.location.trim(),
                images: imageUrls,
            };

            const response = await fetch("/api/services", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(payload),
            });

            const result = await response.json();

            if (!response.ok || !result.success) {
                throw new Error(
                    result.message || "Unable to submit your service.",
                );
            }

            setFormData(initialFormData);
            setImages([]);
            setMessage(
                result.message ||
                    "Your service has been submitted for admin approval.",
            );
            setMessageType("success");

            setTimeout(() => {
                router.push("/dashboard/my-services");
            }, 1000);
        } catch (error) {
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
                    placeholder="e.g. Premium Wedding Photography"
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
                    placeholder="Describe your service, what's included, and what makes it special..."
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
                        placeholder="e.g. 25000"
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
                        placeholder="e.g. Dhaka, Bangladesh"
                        className={inputClass}
                        required
                    />
                </div>
            </div>

            <div>
                <label htmlFor="serviceImages" className={labelClass}>
                    Service Images
                </label>
                <p className="mt-1 text-xs leading-5 text-[#8b8177]">
                    Upload one or more images. Each image must be 5 MB or less.
                </p>

                <input
                    id="serviceImages"
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageChange}
                    className="mt-3 block w-full cursor-pointer rounded-lg border border-dashed border-[#d9cabb] bg-[#faf8f5] p-4 text-sm text-[#77716a] file:mr-4 file:rounded-md file:border-0 file:bg-[#967047] file:px-4 file:py-2 file:text-sm file:font-medium file:text-white hover:file:bg-[#725337]"
                />

                {images.length > 0 && (
                    <ul className="mt-4 space-y-2">
                        {images.map((image, index) => (
                            <li
                                key={`${image.name}-${image.size}-${index}`}
                                className="flex items-center justify-between gap-3 rounded-lg border border-[#eee7df] px-3 py-2"
                            >
                                <span className="min-w-0 truncate text-sm text-[#51483e]">
                                    {image.name}
                                </span>
                                <button
                                    type="button"
                                    onClick={() => removeImage(index)}
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
                    Your service will remain pending until an administrator
                    reviews and approves it.
                </p>

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full rounded-lg bg-[#967047] px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-[#725337] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
                >
                    {isSubmitting ? "Submitting Service..." : "Submit Service"}
                </button>
            </div>
        </form>
    );
}
