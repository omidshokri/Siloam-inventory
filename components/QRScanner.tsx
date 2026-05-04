"use client";

import { useEffect } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { useRouter } from "next/navigation";

export default function QrScanner({ onClose }: { onClose: () => void }) {
  const router = useRouter();

  useEffect(() => {
    const scanner = new Html5Qrcode("qr-reader");

    scanner
      .start(
        { facingMode: "environment" },
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
        },
        async (decodedText) => {
          await scanner.stop().catch(() => {});

          const clean = decodedText.trim();

          if (clean.startsWith("http")) {
            window.location.href = clean;
          } else {
            router.push(`/items/${clean}`);
          }

          onClose();
        },
        () => {}
      )
      .catch((error) => {
        alert(error?.message || "Camera could not open");
      });

    return () => {
      scanner.stop().catch(() => {});
    };
  }, [router, onClose]);

  return (
    <div className="scanner-overlay">
      <div className="scanner-card">
        <button type="button" className="scanner-close" onClick={onClose}>
          Close
        </button>

        <div id="qr-reader" className="qr-reader" />
      </div>
    </div>
  );
}
