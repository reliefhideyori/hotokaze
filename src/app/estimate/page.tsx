import EstimateForm from "@/components/EstimateForm";

export default function EstimatePage() {
  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden" style={{ background: "#0a0c14" }}>

      {/* ノイズテクスチャ */}
      <div className="noise-overlay" />

      {/* 背景グリッド */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(79,156,249,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(79,156,249,0.04) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
          animation: "gridMove 20s linear infinite",
          zIndex: 0,
        }}
      />

      {/* 背景グロー */}
      <div className="fixed pointer-events-none" style={{ top: "-10rem", left: "-10rem", width: "500px", height: "500px", borderRadius: "50%", background: "radial-gradient(circle, rgba(79,156,249,0.08) 0%, transparent 70%)", zIndex: 0 }} />
      <div className="fixed pointer-events-none" style={{ bottom: "-12rem", right: "-8rem", width: "600px", height: "600px", borderRadius: "50%", background: "radial-gradient(circle, rgba(124,92,191,0.07) 0%, transparent 70%)", zIndex: 0 }} />

      {/* ヘッダー */}
      <header
        className="relative flex items-center px-6 sm:px-10 py-4"
        style={{
          background: "rgba(10,12,20,0.85)",
          backdropFilter: "blur(16px)",
          borderBottom: "1px solid rgba(79,156,249,0.12)",
          zIndex: 10,
        }}
      >
        <a href="/" style={{ textDecoration: "none" }}>
          <div
            style={{
              fontFamily: "'Inter', 'Noto Sans JP', sans-serif",
              fontSize: "1.4rem",
              fontWeight: 300,
              letterSpacing: "0.18em",
              background: "linear-gradient(135deg, #4f9cf9, #c8a96e)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              lineHeight: 1.1,
            }}
          >
            Hotokaze
          </div>
          <div
            style={{
              fontSize: "0.55rem",
              letterSpacing: "0.28em",
              background: "linear-gradient(135deg, #8892a4, #c8a96e)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              marginTop: "1px",
            }}
          >
            AI ESTIMATE
          </div>
        </a>
      </header>

      {/* メイン */}
      <main className="relative flex-1 flex items-center justify-center px-4 py-8" style={{ zIndex: 10 }}>
        <div
          className="w-full max-w-lg flex flex-col overflow-hidden"
          style={{
            background: "rgba(17,24,37,0.92)",
            border: "1px solid rgba(79,156,249,0.18)",
            borderRadius: "1.75rem",
            boxShadow: "0 8px 48px rgba(0,0,0,0.5), 0 0 0 1px rgba(79,156,249,0.06)",
            maxHeight: "90vh",
          }}
        >
          <div className="flex-1 overflow-y-auto px-6 sm:px-8 py-7">
            <EstimateForm />
          </div>
        </div>
      </main>
    </div>
  );
}
