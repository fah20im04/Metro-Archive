"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Plus, X } from "lucide-react";

interface FacultyForm {
    sourceId: string;
    name: string;
    designation: string;
    profileImage: string;
    profileStatus: "active" | "inactive";
}

const emptyForm: FacultyForm = {
    sourceId: "",
    name: "",
    designation: "",
    profileImage: "",
    profileStatus: "active",
};

const inputClass =
    "h-11 w-full rounded-xl border border-border bg-background px-3 text-sm text-foreground outline-none transition placeholder:text-muted focus:border-primary focus:ring-2 focus:ring-primary/10";

export default function AddFacultyModal() {
    const [open, setOpen] = useState(false);
    const [form, setForm] = useState<FacultyForm>(emptyForm);
    const [departments, setDepartments] = useState<string[]>([]);
    const [departmentInput, setDepartmentInput] = useState("");
    const [errors, setErrors] = useState<Record<string, string>>({});

    function closeModal() {
        setOpen(false);
        setForm(emptyForm);
        setDepartments([]);
        setDepartmentInput("");
        setErrors({});
    }

    // Close on Escape and lock page scroll while open
    useEffect(() => {
        if (!open) return;

        function handleKeyDown(event: KeyboardEvent) {
            if (event.key === "Escape") closeModal();
        }

        document.addEventListener("keydown", handleKeyDown);
        document.body.style.overflow = "hidden";

        return () => {
            document.removeEventListener("keydown", handleKeyDown);
            document.body.style.overflow = "";
        };
    }, [open]);

    function updateField<K extends keyof FacultyForm>(
        key: K,
        value: FacultyForm[K],
    ) {
        setForm((prev) => ({ ...prev, [key]: value }));
        setErrors((prev) => ({ ...prev, [key]: "" }));
    }

    function addDepartment() {
        const value = departmentInput.trim().toUpperCase();

        if (!value) return;

        if (!departments.includes(value)) {
            setDepartments((prev) => [...prev, value]);
        }

        setDepartmentInput("");
        setErrors((prev) => ({ ...prev, departments: "" }));
    }

    function removeDepartment(department: string) {
        setDepartments((prev) => prev.filter((item) => item !== department));
    }

    function validate() {
        const next: Record<string, string> = {};

        const sourceId = Number(form.sourceId);

        if (!form.sourceId.trim() || !Number.isInteger(sourceId) || sourceId <= 0) {
            next.sourceId = "Enter a valid faculty ID (positive whole number).";
        }

        if (form.name.trim().length < 2) {
            next.name = "Name must be at least 2 characters.";
        }

        if (form.designation.trim().length < 2) {
            next.designation = "Designation is required.";
        }

        if (departments.length === 0 && !departmentInput.trim()) {
            next.departments = "Add at least one department.";
        }

        if (form.profileImage.trim()) {
            try {
                new URL(form.profileImage.trim());
            } catch {
                next.profileImage = "Enter a valid image URL.";
            }
        }

        setErrors(next);

        return Object.keys(next).length === 0;
    }

    function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        // Pick up a department typed but not yet added
        if (departmentInput.trim()) addDepartment();

        if (!validate()) return;

        // Placeholder: the server action will be wired here later.
        toast.success("Add faculty clicked (not saved yet).");

        closeModal();
    }

    return (
        <>
            <button
                type="button"
                onClick={() => setOpen(true)}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-hover"
            >
                <Plus size={17} />
                Add faculty
            </button>

            {open && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-[2px]"
                    onMouseDown={(event) => {
                        if (event.target === event.currentTarget) closeModal();
                    }}
                >
                    <div
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="add-faculty-title"
                        className="flex max-h-[90vh] w-full max-w-lg flex-col overflow-hidden rounded-2xl border border-border bg-surface shadow-xl"
                    >
                        {/* Header */}
                        <div className="flex items-start justify-between gap-4 border-b border-border p-5 sm:p-6">
                            <div>
                                <h2
                                    id="add-faculty-title"
                                    className="text-lg font-bold text-foreground"
                                >
                                    Add faculty
                                </h2>

                                <p className="mt-1 text-sm text-muted">
                                    Create a new faculty profile.
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={closeModal}
                                aria-label="Close"
                                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border text-muted transition hover:bg-background"
                            >
                                <X size={17} />
                            </button>
                        </div>

                        {/* Form */}
                        <form
                            onSubmit={handleSubmit}
                            noValidate
                            className="flex min-h-0 flex-1 flex-col"
                        >
                            <div className="space-y-4 overflow-y-auto p-5 sm:p-6">
                                {/* Faculty ID */}
                                <div>
                                    <label
                                        htmlFor="faculty-source-id"
                                        className="mb-1.5 block text-sm font-medium text-foreground"
                                    >
                                        Faculty ID
                                    </label>

                                    <input
                                        id="faculty-source-id"
                                        type="number"
                                        inputMode="numeric"
                                        value={form.sourceId}
                                        onChange={(e) => updateField("sourceId", e.target.value)}
                                        placeholder="e.g. 1024"
                                        className={inputClass}
                                    />

                                    <p className="mt-1 text-xs text-muted">
                                        The unique ID from the university system.
                                    </p>

                                    {errors.sourceId && (
                                        <p className="mt-1 text-xs text-red-500">
                                            {errors.sourceId}
                                        </p>
                                    )}
                                </div>

                                {/* Name */}
                                <div>
                                    <label
                                        htmlFor="faculty-name"
                                        className="mb-1.5 block text-sm font-medium text-foreground"
                                    >
                                        Full name
                                    </label>

                                    <input
                                        id="faculty-name"
                                        type="text"
                                        value={form.name}
                                        onChange={(e) => updateField("name", e.target.value)}
                                        placeholder="e.g. Dr. Jane Doe"
                                        className={inputClass}
                                    />

                                    {errors.name && (
                                        <p className="mt-1 text-xs text-red-500">{errors.name}</p>
                                    )}
                                </div>

                                {/* Designation */}
                                <div>
                                    <label
                                        htmlFor="faculty-designation"
                                        className="mb-1.5 block text-sm font-medium text-foreground"
                                    >
                                        Designation
                                    </label>

                                    <input
                                        id="faculty-designation"
                                        type="text"
                                        value={form.designation}
                                        onChange={(e) => updateField("designation", e.target.value)}
                                        placeholder="e.g. Assistant Professor"
                                        className={inputClass}
                                    />

                                    {errors.designation && (
                                        <p className="mt-1 text-xs text-red-500">
                                            {errors.designation}
                                        </p>
                                    )}
                                </div>

                                {/* Departments */}
                                <div>
                                    <label
                                        htmlFor="faculty-department"
                                        className="mb-1.5 block text-sm font-medium text-foreground"
                                    >
                                        Departments
                                    </label>

                                    <div className="flex gap-2">
                                        <input
                                            id="faculty-department"
                                            type="text"
                                            value={departmentInput}
                                            onChange={(e) => setDepartmentInput(e.target.value)}
                                            onKeyDown={(e) => {
                                                if (e.key === "Enter" || e.key === ",") {
                                                    e.preventDefault();
                                                    addDepartment();
                                                }
                                            }}
                                            placeholder="e.g. CSE, then press Enter"
                                            className={inputClass}
                                        />

                                        <button
                                            type="button"
                                            onClick={addDepartment}
                                            className="h-11 shrink-0 rounded-xl border border-border px-4 text-sm font-medium text-foreground transition hover:bg-background"
                                        >
                                            Add
                                        </button>
                                    </div>

                                    {departments.length > 0 && (
                                        <div className="mt-2 flex flex-wrap gap-2">
                                            {departments.map((department) => (
                                                <span
                                                    key={department}
                                                    className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary"
                                                >
                                                    {department}

                                                    <button
                                                        type="button"
                                                        onClick={() => removeDepartment(department)}
                                                        aria-label={`Remove ${department}`}
                                                        className="transition hover:text-red-500"
                                                    >
                                                        <X size={12} />
                                                    </button>
                                                </span>
                                            ))}
                                        </div>
                                    )}

                                    {errors.departments && (
                                        <p className="mt-1 text-xs text-red-500">
                                            {errors.departments}
                                        </p>
                                    )}
                                </div>

                                {/* Profile image */}
                                <div>
                                    <label
                                        htmlFor="faculty-image"
                                        className="mb-1.5 block text-sm font-medium text-foreground"
                                    >
                                        Profile image URL{" "}
                                        <span className="font-normal text-muted">(optional)</span>
                                    </label>

                                    <input
                                        id="faculty-image"
                                        type="url"
                                        value={form.profileImage}
                                        onChange={(e) => updateField("profileImage", e.target.value)}
                                        placeholder="https://..."
                                        className={inputClass}
                                    />

                                    {errors.profileImage && (
                                        <p className="mt-1 text-xs text-red-500">
                                            {errors.profileImage}
                                        </p>
                                    )}
                                </div>

                                {/* Status */}
                                <div>
                                    <label
                                        htmlFor="faculty-status"
                                        className="mb-1.5 block text-sm font-medium text-foreground"
                                    >
                                        Profile status
                                    </label>

                                    <select
                                        id="faculty-status"
                                        value={form.profileStatus}
                                        onChange={(e) =>
                                            updateField(
                                                "profileStatus",
                                                e.target.value as FacultyForm["profileStatus"],
                                            )
                                        }
                                        className={inputClass}
                                    >
                                        <option value="active">Active</option>
                                        <option value="inactive">Inactive</option>
                                    </select>
                                </div>
                            </div>

                            {/* Footer */}
                            <div className="flex items-center justify-end gap-3 border-t border-border p-5 sm:px-6">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="rounded-xl border border-border px-4 py-2.5 text-sm font-medium text-muted transition hover:bg-background"
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    className="rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-hover"
                                >
                                    Add faculty
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}