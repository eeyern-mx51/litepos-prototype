import tokens from "../theme/tokens";

export default function SectionHeader({ title }) {
  return (
    <div
      style={{
        padding: "20px 16px 8px",
        fontSize: tokens.type.titleSmall.size,
        fontWeight: tokens.type.titleSmall.weight,
        color: tokens.color.primary,
        letterSpacing: tokens.type.titleSmall.tracking,
      }}
    >
      {title}
    </div>
  );
}
