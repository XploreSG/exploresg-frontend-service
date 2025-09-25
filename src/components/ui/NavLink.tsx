import { Link } from "react-router-dom";
import type { LinkProps } from "react-router-dom";
import type { ReactNode } from "react";

interface NavLinkProps extends Omit<LinkProps, "className"> {
  children: ReactNode;
  variant?: "default" | "danger" | "user";
  isMobile?: boolean;
}

const getNavLinkStyles = (
  variant: NavLinkProps["variant"] = "default",
  isMobile = false,
) => {
  const baseStyles = isMobile
    ? "block hover:text-green-400"
    : "hover:text-green-400";

  const variantStyles = {
    default: baseStyles,
    danger: isMobile
      ? "block text-red-400 hover:text-red-500"
      : "text-red-400 hover:text-red-500",
    user: baseStyles,
  };

  return variantStyles[variant];
};

export const NavLink = ({
  children,
  variant = "default",
  isMobile = false,
  ...props
}: NavLinkProps) => {
  return (
    <Link className={getNavLinkStyles(variant, isMobile)} {...props}>
      {children}
    </Link>
  );
};
