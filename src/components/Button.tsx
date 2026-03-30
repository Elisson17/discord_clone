import { Button as ButtonBase, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ComponentProps } from "react";
import { VariantProps } from "class-variance-authority";

interface ButtonProps
  extends ComponentProps<typeof ButtonBase>,
    VariantProps<typeof buttonVariants> {
  /** Variante discord-icon: botão circular para ícones da barra de ferramentas */
  discordIcon?: boolean;
}

export default function Button({ discordIcon, className, ...props }: ButtonProps) {
  return (
    <ButtonBase
      className={cn(
        discordIcon &&
          "rounded-full w-9 h-9 bg-[#2b2d31] text-[#80848e] hover:text-[#dbdee1] transition-colors",
        className
      )}
      {...props}
    />
  );
}
