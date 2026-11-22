"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { useToast } from "@/components/ui/ToastProvider";
import Image from "next/image";

export default function ProfileSettingsForm({ user }) {
    const { toast } = useToast();

    const [isEditing, setIsEditing] = useState(false);
    const [name, setName] = useState(user.name || "");
    const [businessName, setBusinessName] = useState(user.businessName || "");
    const [imageFile, setImageFile] = useState(null);
    const [preview, setPreview] = useState(user.image || "");
    const [saving, setSaving] = useState(false);

    const isVendor = user.role === "Vendor";
    const initial = name.trim().charAt(0).toUpperCase() || "U";

    const handleImageChange = (event) => {
        const file = event.target.files?.[0];

        if (!file) return;

        if (!file.type.startsWith("image/")) {
            toast({
                title: "Invalid image",
                description: "Please select a valid image.",
                variant: "error",
            });
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            toast({
                title: "Image too large",
                description: "Maximum image size is 5MB.",
                variant: "error",
            });
            return;
        }

        setImageFile(file);
        setPreview(URL.createObjectURL(file));
    };

    const handleCancel = () => {
        setName(user.name || "");
        setBusinessName(user.businessName || "");
        setPreview(user.image || "");
        setImageFile(null);
        setIsEditing(false);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        const trimmedName = name.trim();
        const trimmedBusinessName = businessName.trim();

        if (!trimmedName || (isVendor && !trimmedBusinessName)) {
            toast({
                title: "Required information missing",
                description: "Please complete all required fields.",
                variant: "error",
            });
            return;
        }

        setSaving(true);

        try {
            let imageUrl = user.image || "";

            if (imageFile) {
                const formData = new FormData();
                formData.append("image", imageFile);

                const uploadResponse = await fetch("/api/upload", {
                    method: "POST",
                    body: formData,
                });

                const uploadData = await uploadResponse.json();

                if (!uploadResponse.ok || !uploadData.success) {
                    throw new Error(
                        uploadData.message || "Image upload failed.",
                    );
                }

                imageUrl = uploadData.imageUrl;
            }

            const updateData = {
                name: trimmedName,
                image: imageUrl,
            };

            if (isVendor) {
                updateData.businessName = trimmedBusinessName;
            }

            const result = await authClient.updateUser(updateData);

            if (result.error) {
                throw new Error(
                    result.error.message || "Profile update failed.",
                );
            }

            toast({
                title: "Profile updated",
                description: "Your profile has been updated successfully.",
                variant: "success",
            });

            window.location.reload();
        } catch (error) {
            toast({
                title: "Update failed",
                description: error.message || "Something went wrong.",
                variant: "error",
            });
        } finally {
            setSaving(false);
        }
    };

    return (
        <section className="overflow-hidden rounded-2xl border border-[#e9e2d9] bg-white shadow-sm">
            <div className="flex flex-col gap-5 border-b border-[#eee8e0] p-6 sm:flex-row sm:items-center sm:p-8">
                <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-full border border-[#e9e2d9] bg-[#eee5d9] text-3xl font-semibold text-[#967047]">
                    {preview ? (
                        <Image
                            src={preview}
                            alt="Profile"
                            width={96}
                            height={96}
                            unoptimized
                            className="h-full w-full object-cover"
                        />
                    ) : (
                        initial
                    )}
                </div>

                <div className="flex-1 text-center sm:text-left">
                    <h2 className="text-xl font-semibold text-[#29251f]">
                        {user.name || "User"}
                    </h2>
                    <p className="mt-1 text-sm text-[#77716a]">{user.email}</p>
                    <span className="mt-3 inline-flex rounded-full bg-[#f4eee6] px-3 py-1 text-xs font-medium text-[#967047]">
                        {user.role || "Customer"}
                    </span>
                </div>

                {!isEditing && (
                    <button
                        type="button"
                        onClick={() => setIsEditing(true)}
                        className="rounded-lg bg-[#967047] px-5 py-3 text-sm font-medium text-white transition hover:bg-[#725337]"
                    >
                        Edit Profile
                    </button>
                )}
            </div>

            <div className="p-6 sm:p-8">
                <div className="mb-6">
                    <h3 className="text-lg font-semibold text-[#29251f]">
                        Personal Information
                    </h3>
                    <p className="mt-1 text-sm text-[#888078]">
                        {isEditing
                            ? "Update your profile information below."
                            : "Your account information and personal details."}
                    </p>
                </div>

                {isEditing ? (
                    <form onSubmit={handleSubmit}>
                        <div className="mb-6">
                            <label className="mb-2 block text-sm font-medium text-[#77716a]">
                                Profile Image
                            </label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="block w-full rounded-lg border border-[#e9e2d9] p-3 text-sm text-[#55504a] file:mr-4 file:rounded-md file:border-0 file:bg-[#f4eee6] file:px-4 file:py-2 file:text-sm file:font-medium file:text-[#725337]"
                            />
                            <p className="mt-2 text-xs text-[#99918a]">
                                Maximum image size: 5MB.
                            </p>
                        </div>

                        <div className="grid gap-6 sm:grid-cols-2">
                            <div>
                                <label
                                    htmlFor="profile-name"
                                    className="mb-2 block text-sm font-medium text-[#77716a]"
                                >
                                    Full Name
                                </label>
                                <input
                                    id="profile-name"
                                    type="text"
                                    value={name}
                                    onChange={(event) =>
                                        setName(event.target.value)
                                    }
                                    maxLength={100}
                                    required
                                    className="w-full rounded-lg border border-[#e9e2d9] px-4 py-3 text-sm outline-none focus:border-[#967047]"
                                />
                            </div>

                            {isVendor && (
                                <div>
                                    <label
                                        htmlFor="business-name"
                                        className="mb-2 block text-sm font-medium text-[#77716a]"
                                    >
                                        Business Name
                                    </label>
                                    <input
                                        id="business-name"
                                        type="text"
                                        value={businessName}
                                        onChange={(event) =>
                                            setBusinessName(event.target.value)
                                        }
                                        maxLength={100}
                                        required
                                        className="w-full rounded-lg border border-[#e9e2d9] px-4 py-3 text-sm outline-none focus:border-[#967047]"
                                    />
                                </div>
                            )}

                            <div>
                                <label className="mb-2 block text-sm font-medium text-[#77716a]">
                                    Email Address
                                </label>
                                <input
                                    value={user.email || ""}
                                    readOnly
                                    className="w-full cursor-not-allowed rounded-lg border border-[#e9e2d9] bg-[#faf8f5] px-4 py-3 text-sm text-[#77716a]"
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium text-[#77716a]">
                                    Account Role
                                </label>
                                <input
                                    value={user.role || "Customer"}
                                    readOnly
                                    className="w-full cursor-not-allowed rounded-lg border border-[#e9e2d9] bg-[#faf8f5] px-4 py-3 text-sm text-[#77716a]"
                                />
                            </div>
                        </div>

                        <div className="mt-8 flex flex-wrap gap-3 border-t border-[#eee8e0] pt-6">
                            <button
                                type="submit"
                                disabled={saving}
                                className="rounded-lg bg-[#967047] px-6 py-3 text-sm font-medium text-white transition hover:bg-[#725337] disabled:opacity-60"
                            >
                                {saving ? "Saving..." : "Save Changes"}
                            </button>

                            <button
                                type="button"
                                onClick={handleCancel}
                                disabled={saving}
                                className="rounded-lg border border-[#e9e2d9] px-5 py-3 text-sm font-medium text-[#55504a] transition hover:bg-[#faf8f5]"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                ) : (
                    <div className="grid gap-6 sm:grid-cols-2">
                        <div>
                            <p className="mb-2 text-sm text-[#888078]">
                                Full Name
                            </p>
                            <p className="text-sm font-medium text-[#29251f]">
                                {user.name || "Not provided"}
                            </p>
                        </div>

                        <div>
                            <p className="mb-2 text-sm text-[#888078]">
                                Email Address
                            </p>
                            <p className="text-sm font-medium text-[#29251f]">
                                {user.email}
                            </p>
                        </div>

                        <div>
                            <p className="mb-2 text-sm text-[#888078]">
                                Account Role
                            </p>
                            <p className="text-sm font-medium text-[#29251f]">
                                {user.role || "Customer"}
                            </p>
                        </div>

                        <div>
                            <p className="mb-2 text-sm text-[#888078]">
                                Email Verification
                            </p>
                            <p className="text-sm font-medium text-[#29251f]">
                                {user.emailVerified
                                    ? "Verified"
                                    : "Not verified"}
                            </p>
                        </div>

                        {isVendor && (
                            <div>
                                <p className="mb-2 text-sm text-[#888078]">
                                    Business Name
                                </p>
                                <p className="text-sm font-medium text-[#29251f]">
                                    {user.businessName || "Not provided"}
                                </p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </section>
    );
}
