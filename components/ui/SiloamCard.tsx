import React from "react";

type SiloamCardProps = React.HTMLAttributes<HTMLDivElement> & {
  hover?: boolean;
};

export default function SiloamCard({
  hover = true,
  className = "",
  children,
  ...props
}: SiloamCardProps) {
  return (
    <div
      className={`siloam-card ${hover ? "siloam-card-hover" : ""} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
