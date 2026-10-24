import { Button } from "@heroui/react";
import type { ComponentProps } from "react";

function AppButton({ children, ...props }: ComponentProps<typeof Button>) {
  return <Button {...props}>{children}</Button>;
}

export default AppButton;
