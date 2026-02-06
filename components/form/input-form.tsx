"use client";

import React from "react";
import { Controller } from "react-hook-form";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { cn } from "@/lib/utils";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "../ui/input-group";

interface InputFormProps {
  name: string;
  control: any;
  label: string;
  placeholder: string;
  type?: string;
  icon: React.ComponentType<{ className?: string }>;
  disable?: boolean;
}

function InputForm({
  name,
  control,
  label,
  placeholder,
  type,
  icon: Icon,
  disable,
}: InputFormProps) {
  return (
    <Controller
      name={name}
      control={control}
      disabled={disable}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          <FieldLabel htmlFor={name}>{label}</FieldLabel>

          <InputGroup className="bg-white/10 border-white/20 text-white placeholder:text-slate-500 text-sm">
            <InputGroupInput
              {...field}
              id={name}
              aria-invalid={fieldState.invalid}
              placeholder={placeholder}
              type={type}
              autoComplete="off"
            />

            <InputGroupAddon>
              <Icon />
            </InputGroupAddon>
          </InputGroup>

          {fieldState.invalid && (
            <FieldError className="" errors={[fieldState.error]} />
          )}
        </Field>
      )}
    />
  );
}

export default InputForm;
