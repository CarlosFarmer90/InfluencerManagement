export default function SuccessMessage({
  message,
}) {
  if (!message) {
    return null;
  }

  return (
    <div
      style={{
        backgroundColor: "#dcfce7",
        border: "1px solid #16a34a",
        color: "#166534",
        padding: "12px",
        borderRadius: "6px",
        marginBottom: "20px",
        fontWeight: "600",
      }}
    >
      ✅ {message}
    </div>
  );
}