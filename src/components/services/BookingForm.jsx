
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { getAccessToken } from "@/lib/auth-token";

export default function BookingForm({ serviceId }) {
    const router = useRouter();

    const [formData, setFormData] = useState({
        eventDate: "",
        eventLocation: "",
        message: "",
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [feedback, setFeedback] = useState({
        type: "",
        message: "",
    });

    const today = new Date().toLocaleDateString("en-CA");

    function handleChange(event) {
        const { name, value } = event.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value,
        }));
    }

    async function handleSubmit(event) {
        event.preventDefault();
        setFeedback({
            type: "",
            message: "",
        });

        if (
            !formData.eventDate ||
            !formData.eventLocation.trim() ||
            !formData.message.trim()
        ) {
            setFeedback({
                type: "error",
                message: "Please complete all booking fields.",
            });
            return;
        }

        if (formData.eventLocation.trim().length > 300) {
            setFeedback({
                type: "error",
                message: "Event location must be within 300 characters.",
            });
            return;
        }

        if (formData.message.trim().length > 2000) {
            setFeedback({
                type: "error",
                message: "Message must be within 2000 characters.",
            });
            return;
        }

        setIsSubmitting(true);

        try {
            const token = await getAccessToken();

            if (!token) {
                throw new Error(
                    "Your session could not be verified. Please sign in again.",
                );
            }

            const response = await fetch("/api/bookings", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    serviceId,
                    eventDate: formData.eventDate,
                    eventLocation: formData.eventLocation.trim(),
                    message: formData.message.trim(),
                }),
            });

            const result = await response.json();

            if (!response.ok || !result.success) {
                throw new Error(
                    result.message || "Unable to submit your booking request.",
                );
            }

            setFeedback({
                type: "success",
                message:
                    "Your booking request has been submitted successfully.",
            });

            setFormData({
                eventDate: "",
                eventLocation: "",
                message: "",
            });

            router.refresh();
        } catch (error) {
            console.error("Booking submission error:", error);

            setFeedback({
                type: "error",
                message:
                    error.message ||
                    "Something went wrong. Please try again.",
            });
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <div>
            <h2 className="font-display text-2xl text-ink">
                Request a Booking
            </h2>

            <p className="mt-3 text-sm leading-7 text-ink-soft">
                Share your event details with the service provider.
            </p>

            <form onSubmit={handleSubmit} className="mt-6 space-y-5">
                <div>
                    <label
                        htmlFor="eventDate"
                        className="mb-2 block text-[10px] font-semibold uppercase tracking-widest text-ink-soft"
                    >
                        Event Date
                    </label>

                    <input
                        id="eventDate"
                        name="eventDate"
                        type="date"
                        min={today}
                        value={formData.eventDate}
                        onChange={handleChange}
                        required
                        className="w-full rounded-lg border border-hairline bg-white px-4 py-3 text-sm text-ink outline-none transition-colors focus:border-champagne"
                    />
                </div>

                <div>
                    <label
                        htmlFor="eventLocation"
                        className="mb-2 block text-[10px] font-semibold uppercase tracking-widest text-ink-soft"
                    >
                        Event Location
                    </label>

                    <input
                        id="eventLocation"
                        name="eventLocation"
                        type="text"
                        value={formData.eventLocation}
                        onChange={handleChange}
                        maxLength={300}
                        placeholder="Enter your event location"
                        required
                        className="w-full rounded-lg border border-hairline bg-white px-4 py-3 text-sm text-ink outline-none transition-colors focus:border-champagne"
                    />
                </div>

                <div>
                    <label
                        htmlFor="message"
                        className="mb-2 block text-[10px] font-semibold uppercase tracking-widest text-ink-soft"
                    >
                        Message
                    </label>

                    <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        maxLength={2000}
                        rows={5}
                        placeholder="Tell the vendor about your wedding plans..."
                        required
                        className="w-full resize-y rounded-lg border border-hairline bg-white px-4 py-3 text-sm leading-6 text-ink outline-none transition-colors focus:border-champagne"
                    />
                </div>

                {feedback.message ? (
                    <p
                        role="status"
                        aria-live="polite"
                        className={`rounded-lg px-4 py-3 text-sm leading-6 ${
                            feedback.type === "success"
                                ? "border border-green-200 bg-green-50 text-green-800"
                                : "border border-red-200 bg-red-50 text-red-700"
                        }`}
                    >
                        {feedback.message}
                    </p>
                ) : null}

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full rounded-full bg-ink px-6 py-4 text-[10px] font-semibold uppercase tracking-widest text-white transition-colors hover:bg-champagne disabled:cursor-not-allowed disabled:opacity-60"
                >
                    {isSubmitting ? "Submitting..." : "Submit Booking Request"}
                </button>
            </form>
        </div>
    );
}
