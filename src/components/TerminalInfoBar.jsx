import tokens from "../theme/tokens";

export default function TerminalInfoBar() {
  return (
    <div
      style={{
        height: 40,
        background: tokens.color.bg.statusbar,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 16px",
        fontSize: tokens.type.labelSmall.size,
        color: tokens.color.fg.white,
        fontWeight: 500,
      }}
    >
      <div style={{ display: "flex", gap: 16 }}>
        <span>STANDALONE</span>
        <span>Front counter</span>
      </div>
      <span style={{ fontSize: tokens.type.labelSmall.size }}>Powered by mx51</span>
    </div>
  );
}
