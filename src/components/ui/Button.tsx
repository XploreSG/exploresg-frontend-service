import React from "react";
import { cn } from "../../utils/helpers";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  size?: "sm" | "md" | "lg";
  variant?: "primary" | "secondary" | "outline";
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, size = "md", variant = "primary", ...props }, ref) => {
    const sizeClasses = {
      sm: "px-3 py-1.5 text-sm",
      md: "px-4 py-2 text-base",
      lg: "px-6 py-3 text-lg",
    };

    const variantClasses = {
      primary: "bg-(--brand-orange) text-white hover:bg-orange-600",
      secondary: "bg-gray-600 text-white hover:bg-gray-700",
      outline:
        "border border-(--brand-orange) text-(--brand-orange) hover:bg-(--brand-orange) hover:text-white",
    };

    return (
      <button
        ref={ref}
        className={cn(
          "rounded-lg font-semibold transition-colors",
          sizeClasses[size],
          variantClasses[variant],
          className,
        )}
        {...props}
      />
    );
  },
);

Button.displayName = "Button";
