import Link from "next/link";

export default function CompletePage() {
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
      <div className="fixed pointer-events-none" style={{ top: "-8rem", left: "-8rem", width: "500px", height: "500px", borderRadius: "50%", background: "radial-gradient(circle, rgba(79,156,249,0.08) 0%, transparent 70%)", zIndex: 0 }} />
      <div className="fixed pointer-events-none" style={{ bottom: "-10rem", right: "-6rem", width: "600px", height: "600px", borderRadius: "50%", background: "radial-gradient(circle, rgba(124,92,191,0.07) 0%, transparent 70%)", zIndex: 0 }} />

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
        <Link href="/" style={{ textDecoration: "none" }}>
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
        </Link>
      </header>

      {/* メイン */}
      <main className="relative flex-1 flex items-center justify-center px-6 py-16" style={{ zIndex: 10 }}>
        <div
          className="w-full max-w-md text-center"
          style={{
            background: "rgba(17,24,37,0.92)",
            border: "1px solid rgba(79,156,249,0.18)",
            borderRadius: "1.75rem",
            boxShadow: "0 8px 48px rgba(0,0,0,0.5)",
            padding: "2.5rem 2rem",
          }}
        >
          {/* 完了アイコン */}
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
            style={{
              background: "linear-gradient(135deg, #4f9cf9, #7c5cbf)",
              boxShadow: "0 4px 32px rgba(79,156,249,0.4)",
            }}
          >
            <svg className="w-9 h-9 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
          </div>

          <h1 className="text-2xl font-bold mb-3" style={{ color: "#e8eaf0" }}>
            送信が完了しました！
          </h1>

          <p className="text-sm leading-relaxed mb-6" style={{ color: "#8892a4" }}>
            まもなくご登録のメールアドレスへ<br />
            <span className="font-semibold" style={{ color: "#e8eaf0" }}>AI見積もりをお送りいたします。</span>
          </p>

          {/* メール到着カード */}
          <div
            className="rounded-2xl px-5 py-4 mb-6 text-left"
            style={{
              background: "rgba(79,156,249,0.06)",
              border: "1.5px solid rgba(79,156,249,0.2)",
            }}
          >
            <div className="flex items-center gap-3">
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center shrink-0"
                style={{ background: "linear-gradient(135deg, #4f9cf9, #7c5cbf)" }}
              >
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <p className="text-xs font-bold" style={{ color: "#e8eaf0" }}>数分以内にメールをお届けします</p>
                <p className="text-xs mt-0.5" style={{ color: "#8892a4" }}>このページを閉じていただいて構いません</p>
              </div>
            </div>
          </div>

          <p className="text-xs mb-7" style={{ color: "#8892a4" }}>
            ※ メールが届かない場合は迷惑メールフォルダをご確認ください。
          </p>

          <Link
            href="/"
            className="inline-block w-full text-sm font-semibold py-3.5 rounded-full text-white transition-all duration-200"
            style={{
              background: "linear-gradient(135deg, #4f9cf9, #7c5cbf)",
              boxShadow: "0 4px 20px rgba(79,156,249,0.4)",
            }}
          >
            トップに戻る
          </Link>
        </div>
      </main>
    </div>
  );
}
