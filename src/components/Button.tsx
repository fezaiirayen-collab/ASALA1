import React from "react";
import { Link, type LinkProps } from "react-router-dom";

export type ButtonVariant = "primary" | "secondary" | "solid" | "outline" | "ghost" | "text";
export type ButtonSize = "sm" | "md" | "lg";

interface ButtonBaseProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: React.ReactNode;
  className?: string;
}

export const getButtonClasses = (
  variant: ButtonVariant = "outline",
  size: ButtonSize = "md"
) => {
  const base =
    "inline-flex items-center justify-center gap-3 uppercase tracking-[0.14em] font-medium transition-all duration-250 select-none whitespace-nowrap cursor-pointer";

  const sizeClasses = {
    sm: "px-4 py-2.5 text-[10px]",
    md: "px-6 py-3.5 text-[11px]",
    lg: "px-8 py-4 text-[12px]",
  };

  const variantClasses: Record<ButtonVariant, string> = {
    primary:
      "border border-black bg-black text-white hover:bg-transparent hover:text-black",
    solid:
      "border border-black bg-black text-white hover:bg-transparent hover:text-black",
    secondary:
      "border border-black bg-transparent text-black hover:bg-black hover:text-white",
    outline:
      "border border-black bg-transparent text-black hover:bg-black hover:text-white",
    ghost: "bg-transparent text-black hover:opacity-60",
    text: "bg-transparent text-black hover:opacity-60 underline-offset-4 hover:underline",
  };

  return `${base} ${sizeClasses[size]} ${variantClasses[variant]}`;
};

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & ButtonBaseProps;

export const Button: React.FC<ButtonProps> = ({
  variant = "outline",
  size = "md",
  className = "",
  children,
  ...props
}) => {
  return (
    <button
      className={`${getButtonClasses(variant, size)} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export type ButtonLinkProps = LinkProps & ButtonBaseProps;

export const ButtonLink: React.FC<ButtonLinkProps> = ({
  variant = "outline",
  size = "md",
  className = "",
  children,
  ...props
}) => {
  return (
    <Link
      className={`${getButtonClasses(variant, size)} ${className}`}
      {...props}
    >
      {children}
    </Link>
  );
};

export default Button;
