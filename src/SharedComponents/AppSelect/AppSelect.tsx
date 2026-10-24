import { FieldError, Label, ListBox, Select } from "@heroui/react";
import type { ComponentProps } from "react";

interface AppSelectProps extends ComponentProps<typeof Select> {
  label: string;
  options: { id: string; label: string }[];
  error?: string;
  placeholder?: string;
}

function AppSelect({
  label,
  options,
  error,
  placeholder = "Select one",
  ...selectProps
}: AppSelectProps) {
  return (
    <Select placeholder={placeholder} isInvalid={!!error} {...selectProps}>
      <Label>{label}</Label>
      <Select.Trigger>
        <Select.Value />
        <Select.Indicator />
      </Select.Trigger>
      <Select.Popover>
        <ListBox>
          {options.map((option) => (
            <ListBox.Item
              key={option.id}
              id={option.id}
              textValue={option.label}
            >
              {option.label}
              <ListBox.ItemIndicator />
            </ListBox.Item>
          ))}
        </ListBox>
      </Select.Popover>
      <FieldError>{error}</FieldError>
    </Select>
  );
}

export default AppSelect;
