import type { ChangeEvent } from "react";
import { LockKeyhole, Eye, EyeOff } from "lucide-react";

type PasswordFieldProps = {
  id: string;
  label: string;
  value: string;
  placeholder: string;
  visible: boolean;
  onToggle: () => void;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
};

const inputClass =
  "w-full rounded-xl border border-default bg-surface py-3.5 pl-11 pr-4 text-sm text-foreground outline-none transition placeholder:text-muted-foreground/80 hover:border-strong focus:border-primary focus:ring-4 focus:ring-primary/10";

const labelClass =
  "mb-2 block text-xs font-semibold uppercase tracking-wider text-muted";

export default function PasswordField({
  id,
  label,
  value,
  placeholder,
  visible,
  onToggle,
  onChange,
}: PasswordFieldProps) {
  return (
    <div>
      <label htmlFor={id} className={labelClass}>
        {label} <span className="text-accent">*</span>
      </label>

      <div className="relative">
        <LockKeyhole
          size={18}
          className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
        />

        <input
          id={id}
          name={id}
          type={visible ? "text" : "password"}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          autoComplete="new-password"
          minLength={8}
          maxLength={72}
          required
          className={`${inputClass} pr-12`}
        />

        <button
          type="button"
          onClick={onToggle}
          aria-label={visible ? "Hide password" : "Show password"}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground transition hover:text-foreground"
        >
          {visible ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
    </div>
  );
}
