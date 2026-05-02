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
        { fps: 10, qrbox: 250 },
        (decodedText) => {
          scanner.stop();

          // 👉 اگر QR فقط ID بود:
          router.push(`/items/${decodedText}`);

          onClose();
        },
        () => {}
      )
      .catch((err) => {
        console.error(err);
      });

    return () => {
      scanner.stop().catch(() => {});
    };
  }, []);

  return (
    <div className="scanner-overlay">
      <div id="qr-reader" style={{ width: "100%" }} />
      <button onClick={onClose}>Close</button>
    </div>
  );
}
