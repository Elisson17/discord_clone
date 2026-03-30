import { Input as InputBase } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { ComponentProps } from "react";
import Label from "./Label";

interface InputProps extends ComponentProps<typeof InputBase> {
  transparent?: boolean;
  label?: string;
  placeholder?: string;
}

export default function Input({
  transparent,
  className,
  ...props
}: InputProps) {
  return (
    <>
      <Label text={props.label ?? ""} htmlFor={props.id} />
      <InputBase
        className={cn(
          transparent &&
            "border-none bg-transparent focus-visible:ring-0 focus-visible:border-0",
          className,
        )}
        placeholder={props.placeholder}
        {...props}
      />
    </>
  );
}
