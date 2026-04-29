"use client";

import { useEffect } from "react";
import { Html5Qrcode } from "html5-qrcode";

export default function QRScanner({ onScan }: { onScan: (text: string) => void }) {
  useEffect(() => {
    const scanner = new Html5Qrcode("reader");

    scanner.start(
      { facingMode: "environment" },
      { fps: 10, qrbox: 250 },
      (decodedText) => {
        scanner.stop();
        onScan(decodedText);
      }
    );

    return () => {
      scanner.stop().catch(() => {});
    };
  }, []);

  return (
    <div
      id="reader"
      style={{
        width: "100%",
        maxWidth: "300px",
        margin: "20px auto",
      }}
    />
  );
}
