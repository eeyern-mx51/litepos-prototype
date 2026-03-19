import tokens from "../theme/tokens";
import TopAppBar from "../components/TopAppBar";
import ListItem from "../components/ListItem";
import Icon from "../components/Icon";

const transactions = [
  { id: "TXN-001", time: "2:34 PM", amount: "$23.30", items: 4, status: "Approved" },
  { id: "TXN-002", time: "1:15 PM", amount: "$9.00", items: 2, status: "Approved" },
  { id: "TXN-003", time: "11:42 AM", amount: "$14.50", items: 3, status: "Declined" },
];

export default function HistoryScreen({ navigate }) {
  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
      <TopAppBar title="Transaction History" onBack={() => navigate("menu")} />
      <div
        style={{
          padding: "4px 16px 12px",
          fontSize: tokens.type.bodySmall.size,
          color: tokens.color.onSurfaceVariant,
        }}
      >
        Today — March 20, 2026
      </div>
      <div style={{ flex: 1, overflow: "auto" }}>
        {transactions.map((t, i) => (
          <ListItem
            key={i}
            leading={
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: tokens.shape.full,
                  background:
                    t.status === "Approved"
                      ? tokens.color.primaryContainer
                      : tokens.color.errorContainer,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Icon
                  name="receipt"
                  size={20}
                  color={
                    t.status === "Approved"
                      ? tokens.color.onPrimaryContainer
                      : tokens.color.onErrorContainer
                  }
                />
              </div>
            }
            headline={`${t.id} · ${t.items} items`}
            supporting={`${t.time} · ${t.status}`}
            trailing={
              <span
                style={{
                  fontSize: tokens.type.titleMedium.size,
                  fontWeight: 600,
                  color: t.status === "Approved" ? tokens.color.onSurface : tokens.color.error,
                }}
              >
                {t.amount}
              </span>
            }
            divider={i < transactions.length - 1}
          />
        ))}
      </div>
    </div>
  );
}
