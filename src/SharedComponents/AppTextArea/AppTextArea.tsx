import { TextArea } from "@heroui/react";
import type { ComponentProps } from "react";

function AppTextArea({ fullWidth = true, ...props }: ComponentProps<typeof TextArea>) {
  return <TextArea fullWidth={fullWidth} {...props} />;
}

export default AppTextArea;
