import SiloamButton from "@/components/ui/SiloamButton";
import SiloamCard from "@/components/ui/SiloamCard";

export default function HomePage() {
  return (
    <main className="siloam-page">
      <div className="siloam-shell">
        {/* HERO */}

        <section
          style={{
            paddingTop: 40,
            paddingBottom: 28,
          }}
        >
          <p className="siloam-eyebrow">Siloam Inventory</p>

          <h1
            style={{
              fontSize: "clamp(48px, 8vw, 82px)",
              lineHeight: 0.92,
              letterSpacing: "-0.07em",
              maxWidth: 850,
              margin: "16px 0",
            }}
          >
            Your inventory.
            <br />
            Reimagined.
          </h1>

          <p
            className="siloam-muted"
            style={{
              maxWidth: 640,
              fontSize: 18,
              lineHeight: 1.8,
              marginBottom: 28,
            }}
          >
            Track purchases, profits, taxes, receipts, analytics, and inventory
            movement in one intelligent Siloam workspace.
          </p>

          <div
            style={{
              display: "flex",
              gap: 12,
              flexWrap: "wrap",
            }}
          >
            <SiloamButton>
              Open Inventory
            </SiloamButton>

            <SiloamButton variant="secondary">
              Add Product
            </SiloamButton>
          </div>
        </section>

        {/* STATS */}

        <section
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(240px, 1fr))",
            gap: 18,
            marginTop: 28,
          }}
        >
          <SiloamCard style={{ padding: 26 }}>
            <p className="siloam-eyebrow">Inventory Value</p>

            <h2
              style={{
                fontSize: 40,
                margin: "12px 0 8px",
                letterSpacing: "-0.05em",
              }}
            >
              $12,450
            </h2>

            <p className="siloam-muted">
              Current estimated stock value
            </p>
          </SiloamCard>

          <SiloamCard style={{ padding: 26 }}>
            <p className="siloam-eyebrow">Profit</p>

            <h2
              style={{
                fontSize: 40,
                margin: "12px 0 8px",
                letterSpacing: "-0.05em",
              }}
            >
              $4,320
            </h2>

            <p className="siloam-muted">
              Estimated after-tax profit
            </p>
          </SiloamCard>

          <SiloamCard style={{ padding: 26 }}>
            <p className="siloam-eyebrow">Products</p>

            <h2
              style={{
                fontSize: 40,
                margin: "12px 0 8px",
                letterSpacing: "-0.05em",
              }}
            >
              128
            </h2>

            <p className="siloam-muted">
              Active tracked inventory items
            </p>
          </SiloamCard>
        </section>

        {/* FEATURE CARD */}

        <section
          style={{
            marginTop: 24,
            marginBottom: 120,
          }}
        >
          <SiloamCard
            style={{
              padding: 34,
              overflow: "hidden",
              position: "relative",
            }}
          >
            <div
              style={{
                position: "absolute",
                inset: 0,
                background:
                  "radial-gradient(circle at top right, rgba(124,58,237,.22), transparent 35%)",
                pointerEvents: "none",
              }}
            />

            <div
              style={{
                position: "relative",
                zIndex: 2,
              }}
            >
              <p className="siloam-eyebrow">
                Smart Analytics
              </p>

              <h2
                style={{
                  fontSize: "clamp(34px,5vw,58px)",
                  lineHeight: 1,
                  letterSpacing: "-0.06em",
                  maxWidth: 700,
                  margin: "12px 0",
                }}
              >
                Built for modern resellers.
              </h2>

              <p
                className="siloam-muted"
                style={{
                  maxWidth: 620,
                  lineHeight: 1.8,
                  fontSize: 17,
                }}
              >
                Siloam helps you understand inventory movement,
                tax estimates, product value, and profitability
                through a clean premium interface.
              </p>
            </div>
          </SiloamCard>
        </section>
      </div>
    </main>
  );
}
