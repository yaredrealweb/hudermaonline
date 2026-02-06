"use client";

import { Controller } from "react-hook-form";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { InputGroup, InputGroupTextarea } from "../ui/input-group";

interface TeaxtareaFormProps {
  name: string;
  control: any;
  label: string;
  placeholder: string;
}

function TeaxtareaForm({
  name,
  control,
  label,
  placeholder,
}: TeaxtareaFormProps) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          <FieldLabel htmlFor={name}>{label}</FieldLabel>

          <InputGroup className="bg-white/10 border-white/20 text-white placeholder:text-slate-500 text-sm">
            <InputGroupTextarea
              {...field}
              id={name}
              aria-invalid={fieldState.invalid}
              placeholder={placeholder}
              autoComplete="off"
            />
          </InputGroup>

          {fieldState.invalid && (
            <FieldError className="" errors={[fieldState.error]} />
          )}
        </Field>
      )}
    />
  );
}

export default TeaxtareaForm;
