"use client";

import { useEffect, useState } from "react";
import { Loader2, X } from "lucide-react";

interface ReviewModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: { title: string; description: string }) => Promise<void>;
}

export default function ReviewModal({
    isOpen,
    onClose,
    onSubmit,
}: ReviewModalProps) {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");

    // Close on Escape
    useEffect(() => {
        if (!isOpen) return;

        function handleKey(e: KeyboardEvent) {
            if (e.key === "Escape" && !isSubmitting) onClose();
        }

        window.addEventListener("keydown", handleKey);
        return () => window.removeEventListener("keydown", handleKey);
    }, [isOpen, isSubmitting, onClose]);

    if (!isOpen) return null;

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        if (title.trim().length < 3) {
            setError("Title must be at least 3 characters.");
            return;
        }

        if (description.trim().length < 10) {
            setError("Description must be at least 10 characters.");
            return;
        }

        setIsSubmitting(true);
        setError("");

        try {
            await onSubmit({
                title: title.trim(),
                description: description.trim(),
            });

            setTitle("");
            setDescription("");
            onClose();
        } catch {
            setError("Something went wrong. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
            onClick={() => !isSubmitting && onClose()}
        >
            <div
                role="dialog"
                aria-modal="true"
                aria-labelledby="review-modal-title"
                className="w-full max-w-lg rounded-xl border border-border bg-surface p-6 shadow-xl"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-start justify-between">
                    <h2
                        id="review-modal-title"
                        className="text-lg font-bold text-foreground"
                    >
                        Write a Review
                    </h2>

                    <button
                        type="button"
                        onClick={onClose}
                        disabled={isSubmitting}
                        aria-label="Close"
                        className="rounded-lg p-1.5 text-muted transition hover:bg-surface-secondary"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="mt-5 space-y-4">
                    <div>
                        <label
                            htmlFor="review-title"
                            className="mb-1.5 block text-sm font-medium text-foreground"
                        >
                            Title
                        </label>
                        <input
                            id="review-title"
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            maxLength={100}
                            placeholder="Sum it up in a few words"
                            className="w-full rounded-lg border border-border bg-surface px-3 py-2.5 text-sm outline-none focus:border-primary"
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="review-description"
                            className="mb-1.5 block text-sm font-medium text-foreground"
                        >
                            Description
                        </label>
                        <textarea
                            id="review-description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            maxLength={1000}
                            rows={5}
                            placeholder="Share your experience with this faculty member"
                            className="w-full resize-none rounded-lg border border-border bg-surface px-3 py-2.5 text-sm outline-none focus:border-primary"
                        />
                        <p className="mt-1 text-right text-xs text-muted-foreground">
                            {description.length}/1000
                        </p>
                    </div>

                    {error && (
                        <p role="alert" className="text-sm text-danger">
                            {error}
                        </p>
                    )}

                    <div className="flex justify-end gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={isSubmitting}
                            className="rounded-lg border border-border px-4 py-2.5 text-sm font-semibold text-foreground transition hover:bg-surface-secondary"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-hover"
                        >
                            {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
                            {isSubmitting ? "Submitting..." : "Submit Review"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}