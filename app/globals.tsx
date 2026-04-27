* {
  box-sizing: border-box;
}

body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", sans-serif;
  background: #f5f5f7;
  color: #1d1d1f;
}

.app-shell {
  max-width: 1180px;
  margin: 0 auto;
  padding: 32px 20px 80px;
}

.hero {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
  margin-bottom: 28px;
}

.eyebrow {
  margin: 0 0 6px;
  color: #86868b;
  font-size: 14px;
  font-weight: 500;
}

h1 {
  margin: 0;
  font-size: 36px;
  letter-spacing: -0.04em;
  font-weight: 700;
}

h2 {
  margin: 0 0 18px;
  font-size: 20px;
  letter-spacing: -0.02em;
}

.actions {
  display: flex;
  gap: 10px;
}

.primary-btn,
.secondary-btn,
.pill-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  text-decoration: none;
  border-radius: 999px;
  padding: 11px 18px;
  font-size: 14px;
  font-weight: 600;
}

.primary-btn {
  background: #1d1d1f;
  color: white;
}

.secondary-btn,
.pill-btn {
  background: white;
  color: #1d1d1f;
  border: 1px solid #e5e5ea;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 14px;
  margin-bottom: 24px;
}

.stat-card,
.card {
  background: rgba(255, 255, 255, 0.82);
  border: 1px solid rgba(0, 0, 0, 0.06);
  border-radius: 28px;
  box-shadow: 0 18px 45px rgba(0, 0, 0, 0.06);
  backdrop-filter: blur(18px);
}

.stat-card {
  padding: 22px;
}

.stat-card p {
  margin: 0 0 10px;
  color: #86868b;
  font-size: 14px;
}

.stat-card strong {
  font-size: 28px;
  letter-spacing: -0.03em;
}

.charts-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 18px;
  margin-bottom: 24px;
}

.card {
  padding: 24px;
  overflow: hidden;
}

.item-list {
  display: flex;
  flex-direction: column;
}

.item-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 18px 0;
  border-bottom: 1px solid #f0f0f2;
}

.item-row:last-child {
  border-bottom: none;
}

.item-row h3 {
  margin: 4px 0;
  font-size: 17px;
}

.serial,
.muted {
  margin: 0;
  color: #86868b;
  font-size: 13px;
}

.profit-pill {
  border-radius: 999px;
  padding: 10px 14px;
  background: #ecfdf3;
  color: #027a48;
  font-size: 14px;
  font-weight: 700;
}

@media (max-width: 800px) {
  .hero {
    flex-direction: column;
    align-items: flex-start;
  }

  .stats-grid,
  .charts-grid {
    grid-template-columns: 1fr;
  }
}
