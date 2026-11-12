
import type { ChangeEvent } from "react";
import type { LucideIcon } from "lucide-react";

type Option = {
  value: string;
  label: string;
};

type FormFieldProps = {
  id: string;
  label: string;
  value: string;
  placeholder: string;
  icon: LucideIcon;
  onChange: (
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;

  type?: "text" | "email";
  required?: boolean;
  maxLength?: number;
  minLength?: number;
  autoComplete?: string;
  pattern?: string;
  title?: string;
  options?: Option[];
  optional?: boolean;
};

const inputClass =
  "w-full rounded-xl border border-default bg-surface py-3.5 pl-11 pr-4 text-sm text-foreground outline-none transition placeholder:text-muted-foreground/80 hover:border-strong focus:border-primary focus:ring-4 focus:ring-primary/10";

const labelClass =
  "mb-2 block text-xs font-semibold uppercase tracking-wider text-muted";

export default function FormField({
  id,
  label,
  value,
  placeholder,
  icon: Icon,
  onChange,
  type = "text",
  required = false,
  maxLength,
  minLength,
  autoComplete,
  pattern,
  title,
  options,
  optional = false,
}: FormFieldProps) {
  return (
    <div>
      <label htmlFor={id} className={labelClass}>
        {label}

        {required && <span className="text-accent"> *</span>}

        {optional && (
          <span className="ml-1 text-muted normal-case tracking-normal">
            (Optional)
          </span>
        )}
      </label>

      <div className="relative">
        <Icon
          size={18}
          className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
        />

        {options ? (
          <select
            id={id}
            name={id}
            value={value}
            onChange={onChange}
            required={required}
            className={inputClass}
          >
            <option value="" disabled>
              {placeholder}
            </option>

            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        ) : (
          <input
            id={id}
            name={id}
            type={type}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            required={required}
            maxLength={maxLength}
            minLength={minLength}
            autoComplete={autoComplete}
            pattern={pattern}
            title={title}
            className={inputClass}
          />
        )}
      </div>
    </div>
  );
}
