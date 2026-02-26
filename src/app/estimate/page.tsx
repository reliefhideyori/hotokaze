import EstimateForm from "@/components/EstimateForm";

export default function EstimatePage() {
  return (
    <div
      className="h-screen overflow-hidden flex items-center justify-center px-4"
      style={{
        background: "linear-gradient(135deg, #0a0c14 0%, #111827 50%, #0a0c14 100%)",
      }}
    >
      {/* Grid background */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(79,156,249,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(79,156,249,0.04) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />
      {/* Blue glow top-left */}
      <div
        className="fixed pointer-events-none"
        style={{
          top: "-8rem",
          left: "-8rem",
          width: "500px",
          height: "500px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(79,156,249,0.10) 0%, transparent 70%)",
        }}
      />
      {/* Purple glow bottom-right */}
      <div
        className="fixed pointer-events-none"
        style={{
          bottom: "-10rem",
          right: "-6rem",
          width: "600px",
          height: "600px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(124,92,191,0.07) 0%, transparent 70%)",
        }}
      />

      <div
        className="relative w-full max-w-lg bg-white rounded-3xl shadow-xl border border-gray-100 flex flex-col overflow-hidden"
        style={{ maxHeight: "92vh", zIndex: 10 }}
      >
        <div className="flex-1 overflow-y-auto px-8 py-7">
          <EstimateForm />
        </div>
      </div>
    </div>
  );
}
