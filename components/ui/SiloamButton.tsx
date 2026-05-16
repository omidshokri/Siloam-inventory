import React from "react";

type SiloamButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost";
};

export default function SiloamButton({
  variant = "primary",
  className = "",
  children,
  ...props
}: SiloamButtonProps) {
  const variantClass =
    variant === "primary"
      ? "siloam-button-primary"
      : variant === "secondary"
      ? "siloam-button-secondary"
      : "siloam-button-ghost";

  return (
    <button
      className={`siloam-button ${variantClass} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
