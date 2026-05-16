import React from "react";

type Props = {
  children: React.ReactNode;
};

export default function SiloamShell({ children }: Props) {
  return (
    <main className="siloam-page">
      <div className="siloam-shell">{children}</div>
    </main>
  );
}
