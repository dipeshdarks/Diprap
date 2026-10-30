import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

const buttonStyles = cva(
  "inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      variant: {
        primary: "bg-accent text-accent-fg hover:bg-accent/90",
        secondary: "border border-border bg-raised text-fg hover:bg-surface",
        ghost: "text-muted hover:bg-raised hover:text-fg",
        danger: "bg-danger text-fg hover:bg-danger/90",
      },
      size: {
        md: "min-h-11 px-4",
        sm: "min-h-11 px-3",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  },
);

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonStyles> {
  asChild?: boolean;
}

export function Button({
  className,
  variant,
  size,
  asChild = false,
  type = "button",
  ...props
}: ButtonProps) {
  if (asChild) {
    return <Slot className={cn(buttonStyles({ variant, size }), className)} {...props} />;
  }
  return (
    <button className={cn(buttonStyles({ variant, size }), className)} type={type} {...props} />
  );
}
