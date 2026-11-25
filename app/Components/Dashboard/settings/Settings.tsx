"use client";

import React, { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Camera, Trash2, UserRound } from "lucide-react";

import type { UserRole } from "@/models/user";

export interface SettingsUser {
    id: string;
    name: string;
    universityId: string;
    email: string;
    role: UserRole;
    departmentId: string | null;
    batch: string | null;
    accountStatus: "active";
    createdAt: string;
}

interface SettingsProps {
    user: SettingsUser;
}

const MAX_IMAGE_SIZE = 2 * 1024 * 1024; // 2 MB

// Fixed locale and timezone so server and browser render the same text
function formatDate(value: string) {
    return new Date(value).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
        timeZone: "UTC",
    });
}

function capitalize(value: string) {
    return value.charAt(0).toUpperCase() + value.slice(1);
}

const Settings = ({ user }: SettingsProps) => {
    // Front-end only state: nothing here is saved to the database yet
    const [displayName, setDisplayName] = useState(user.name);
    const [nameInput, setNameInput] = useState(user.name);
    const [nameError, setNameError] = useState("");

    const [photoUrl, setPhotoUrl] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Release the preview URL when it changes or the page closes
    useEffect(() => {
        return () => {
            if (photoUrl) URL.revokeObjectURL(photoUrl);
        };
    }, [photoUrl]);

    const initials = displayName
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase())
        .join("");

    const trimmedName = nameInput.trim();
    const nameChanged = trimmedName !== displayName;

    function handleSaveName(e: React.FormEvent) {
        e.preventDefault();

        if (trimmedName.length < 2) {
            setNameError("Name must be at least 2 characters.");
            return;
        }

        setNameError("");
        setDisplayName(trimmedName);
        setNameInput(trimmedName);
        toast.success("Name updated.");
    }

    function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];

        // Allow picking the same file again later
        e.target.value = "";

        if (!file) return;

        if (!file.type.startsWith("image/")) {
            toast.error("Please choose an image file.");
            return;
        }

        if (file.size > MAX_IMAGE_SIZE) {
            toast.error("Image must be 2 MB or smaller.");
            return;
        }

        setPhotoUrl(URL.createObjectURL(file));
        toast.success("Profile picture updated.");
    }

    function handleRemovePhoto() {
        setPhotoUrl(null);
    }

    const details: { label: string; value: string }[] = [
        { label: "Full Name", value: displayName },
        { label: "University ID", value: user.universityId },
        { label: "Email", value: user.email },
        { label: "Role", value: capitalize(user.role) },
        ...(user.departmentId
            ? [{ label: "Department", value: user.departmentId }]
            : []),
        ...(user.batch ? [{ label: "Batch", value: user.batch }] : []),
        { label: "Account Status", value: capitalize(user.accountStatus) },
        { label: "Member Since", value: formatDate(user.createdAt) },
    ];

    return (
        <div className="mx-auto max-w-3xl space-y-8">
            {/* Header */}
            <section>
                <p className="text-sm font-medium text-primary">Settings</p>

                <h1 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
                    Account Settings
                </h1>

                <p className="mt-2 text-sm text-muted">
                    Manage your profile and view your account details.
                </p>
            </section>

            {/* Profile Picture */}
            <section className="rounded-xl border border-border bg-surface p-5 sm:p-6">
                <h2 className="text-lg font-semibold">Profile Picture</h2>

                <p className="mt-1 text-sm text-muted">
                    JPG, PNG or WebP. Up to 2 MB.
                </p>

                <div className="mt-5 flex flex-col gap-5 sm:flex-row sm:items-center">
                    {photoUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                            src={photoUrl}
                            alt="Your profile picture"
                            className="h-24 w-24 shrink-0 rounded-full border border-border object-cover"
                        />
                    ) : (
                        <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full bg-primary-light text-2xl font-bold text-primary">
                            {initials || <UserRound size={36} />}
                        </div>
                    )}

                    <div className="flex flex-wrap gap-3">
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handlePhotoChange}
                            className="hidden"
                        />

                        <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-white transition hover:bg-primary-hover"
                        >
                            <Camera size={17} />
                            Upload Photo
                        </button>

                        {photoUrl && (
                            <button
                                type="button"
                                onClick={handleRemovePhoto}
                                className="inline-flex items-center gap-2 rounded-xl border border-border bg-surface px-4 py-2.5 text-sm font-medium transition hover:bg-surface-secondary"
                            >
                                <Trash2 size={17} />
                                Remove
                            </button>
                        )}
                    </div>
                </div>
            </section>

            {/* Change Name */}
            <section className="rounded-xl border border-border bg-surface p-5 sm:p-6">
                <h2 className="text-lg font-semibold">Display Name</h2>

                <p className="mt-1 text-sm text-muted">
                    This is how your name appears on the page.
                </p>

                <form
                    onSubmit={handleSaveName}
                    className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-start"
                >
                    <div className="flex-1">
                        <label htmlFor="settings-name" className="sr-only">
                            Full name
                        </label>

                        <input
                            id="settings-name"
                            type="text"
                            value={nameInput}
                            onChange={(e) => setNameInput(e.target.value)}
                            maxLength={60}
                            className="w-full rounded-lg border border-border bg-surface px-3 py-2.5 text-sm outline-none focus:border-primary"
                        />

                        {nameError && (
                            <p role="alert" className="mt-1.5 text-sm text-danger">
                                {nameError}
                            </p>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={!nameChanged}
                        className="rounded-xl bg-primary px-5 py-2.5 text-sm font-medium text-white transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        Save Name
                    </button>
                </form>
            </section>

            {/* Account Details */}
            <section className="rounded-xl border border-border bg-surface p-5 sm:p-6">
                <h2 className="text-lg font-semibold">Account Details</h2>

                <p className="mt-1 text-sm text-muted">
                    Your registered information. Contact an admin to change it.
                </p>

                <dl className="mt-5 grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2">
                    {details.map((item) => (
                        <div
                            key={item.label}
                            className="rounded-lg bg-surface-secondary px-4 py-3"
                        >
                            <dt className="text-xs font-medium text-muted">{item.label}</dt>
                            <dd className="mt-1 wrap-break-word text-sm font-semibold">
                                {item.value}
                            </dd>
                        </div>
                    ))}
                </dl>
            </section>
        </div>
    );
};

export default Settings;