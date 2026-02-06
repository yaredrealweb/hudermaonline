import { Label } from "@/components/ui/label";
import { useFormContext } from "react-hook-form";

interface GenderSelectorProps {
  label?: string;
}

export function GenderSelector({ label = "Gender" }: GenderSelectorProps) {
  const { register, setValue, watch } = useFormContext();
  const selected = watch("gender");

  return (
    <div className="space-y-3">
      <Label>{label}</Label>

      <input type="hidden" {...register("gender")} />

      <div role="radiogroup" aria-label={label} className="inline-flex gap-2">
        <button
          type="button"
          role="radio"
          aria-checked={selected === "male"}
          onClick={() =>
            setValue("gender", "male", {
              shouldValidate: true,
              shouldDirty: true,
              shouldTouch: true,
            })
          }
          className={
            (selected === "male"
              ? "bg-blue-600 border-blue-600 text-white"
              : "bg-white/5 border-white/10 text-slate-200") +
            " px-4 py-2 rounded-lg border transition-colors text-sm font-medium"
          }
        >
          Male
        </button>

        <button
          type="button"
          role="radio"
          aria-checked={selected === "female"}
          onClick={() =>
            setValue("gender", "female", {
              shouldValidate: true,
              shouldDirty: true,
              shouldTouch: true,
            })
          }
          className={
            (selected === "female"
              ? "bg-blue-600 border-blue-600 text-white"
              : "bg-white/5 border-white/10 text-slate-200") +
            " px-4 py-2 rounded-lg border transition-colors text-sm font-medium"
          }
        >
          Female
        </button>
      </div>
    </div>
  );
}
