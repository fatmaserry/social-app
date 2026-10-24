import { FieldError, Input, Label, TextField } from "@heroui/react";
import type { ComponentProps } from "react";

interface AppInputProps extends ComponentProps<typeof Input> {
  label: string;
  type?: string;
  error?: string;
  hint?: string;
  isRequired?: boolean;
  hideError?: boolean;
}

function AppInput({
  label,
  type,
  error,
  hint,
  isRequired = true,
  hideError = false,
  ...inputProps
}: AppInputProps) {
  return (
    <TextField isRequired={isRequired} type={type} isInvalid={!!error}>
      <Label>{label}</Label>
      <Input {...inputProps} />
      {hint && !error && <p className="text-xs text-muted">{hint}</p>}
      {!hideError && <FieldError>{error}</FieldError>}
    </TextField>
  );
}

export default AppInput;
