"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

// ============================================================
// 型定義
// ============================================================
interface EstimateData {
  summary: string;
  totalMin: string;
  totalMax: string;
  deliveryPeriod: string;
  breakdown: { feature: string; hours: string; cost: string }[];
  totalHours: string;
  notes: string[];
}

interface StoredEstimate {
  estimate: EstimateData;
  systemType: string;
  contact: { name: string; company?: string; email: string };
}

// ============================================================
// Complete Page
// ============================================================
export default function CompletePage() {
  const router = useRouter();
  const [data, setData] = useState<StoredEstimate | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const raw = sessionStorage.getItem("hotokaze_estimate");
    if (!raw) {
      router.replace("/estimate");
      return;
    }
    try {
      setData(JSON.parse(raw));
    } catch {
      router.replace("/estimate");
      return;
    }
    setLoading(false);
  }, [router]);

  if (loading || !data) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: "#0a0c14" }}
      >
        <div className="w-8 h-8 border-2 border-white/20 border-t-white/80 rounded-full animate-spin" />
      </div>
    );
  }

  const { estimate: est, systemType, contact } = data;

  return (
    <div
      className="min-h-screen flex flex-col relative overflow-hidden"
      style={{ background: "#0a0c14" }}
    >
      {/* ノイズテクスチャ */}
      <div className="noise-overlay" />

      {/* 背景グリッド */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(79,156,249,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(79,156,249,0.04) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
          zIndex: 0,
        }}
      />

      {/* 背景グロー */}
      <div
        className="fixed pointer-events-none"
        style={{ top: "-8rem", left: "-8rem", width: "500px", height: "500px", borderRadius: "50%", background: "radial-gradient(circle, rgba(79,156,249,0.08) 0%, transparent 70%)", zIndex: 0 }}
      />
      <div
        className="fixed pointer-events-none"
        style={{ bottom: "-10rem", right: "-6rem", width: "600px", height: "600px", borderRadius: "50%", background: "radial-gradient(circle, rgba(124,92,191,0.07) 0%, transparent 70%)", zIndex: 0 }}
      />

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
      <main className="relative flex-1 flex justify-center px-4 py-10 sm:py-16" style={{ zIndex: 10 }}>
        <div className="w-full max-w-2xl flex flex-col gap-5">

          {/* 完了バナー */}
          <div
            className="rounded-3xl p-6 text-center"
            style={{
              background: "rgba(17,24,37,0.92)",
              border: "1px solid rgba(79,156,249,0.18)",
              boxShadow: "0 8px 48px rgba(0,0,0,0.5)",
            }}
          >
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
              style={{
                background: "linear-gradient(135deg, #4f9cf9, #7c5cbf)",
                boxShadow: "0 4px 24px rgba(79,156,249,0.4)",
              }}
            >
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-xl font-bold mb-2" style={{ color: "#e8eaf0" }}>
              見積もりを送信しました！
            </h1>
            <p className="text-sm" style={{ color: "#8892a4" }}>
              <span style={{ color: "#e8eaf0" }}>{contact.email}</span> にPDF見積もりをお届けしました。
            </p>
            <p className="text-xs mt-1" style={{ color: "#6b7280" }}>
              ※ 届かない場合は迷惑メールフォルダをご確認ください
            </p>
          </div>

          {/* 見積もりサマリー */}
          <div
            className="rounded-3xl p-6"
            style={{
              background: "rgba(17,24,37,0.92)",
              border: "1px solid rgba(79,156,249,0.18)",
              boxShadow: "0 8px 48px rgba(0,0,0,0.5)",
            }}
          >
            <p
              className="text-xs font-bold tracking-widest uppercase mb-3"
              style={{ color: "#4f9cf9" }}
            >
              概算見積もり — {systemType}
            </p>

            {/* 金額 */}
            <div
              className="rounded-2xl p-5 mb-5"
              style={{
                background: "rgba(79,156,249,0.06)",
                border: "1.5px solid rgba(79,156,249,0.2)",
              }}
            >
              <p className="text-xs font-semibold mb-1" style={{ color: "#4f9cf9" }}>
                概算金額（税抜）
              </p>
              <p className="text-3xl font-black mb-1" style={{ color: "#e8eaf0" }}>
                {est.totalMin}
                <span className="text-lg font-normal mx-2" style={{ color: "#6b7280" }}>〜</span>
                {est.totalMax}
              </p>
              <p className="text-xs" style={{ color: "#8892a4" }}>
                納期目安：{est.deliveryPeriod}　／　合計工数：{est.totalHours}
              </p>
              <div
                className="mt-4 pt-4"
                style={{ borderTop: "1px solid rgba(79,156,249,0.15)" }}
              >
                <p className="text-sm leading-relaxed" style={{ color: "#8892a4" }}>
                  {est.summary}
                </p>
              </div>
            </div>

            {/* 内訳テーブル */}
            <p className="text-xs font-bold tracking-widest uppercase mb-3" style={{ color: "#4f9cf9" }}>
              見積もり内訳
            </p>
            <div
              className="rounded-2xl overflow-hidden mb-5"
              style={{ border: "1px solid rgba(79,156,249,0.15)" }}
            >
              {/* ヘッダー */}
              <div
                className="flex px-4 py-2.5"
                style={{ background: "rgba(79,156,249,0.12)" }}
              >
                <span className="flex-1 text-xs font-semibold" style={{ color: "#8892a4" }}>項目</span>
                <span className="w-20 text-xs font-semibold text-center" style={{ color: "#8892a4" }}>工数</span>
                <span className="w-28 text-xs font-semibold text-right" style={{ color: "#8892a4" }}>費用（概算）</span>
              </div>
              {/* 行 */}
              {est.breakdown.map((row, i) => (
                <div
                  key={i}
                  className="flex px-4 py-3"
                  style={{
                    borderTop: "1px solid rgba(79,156,249,0.08)",
                    background: i % 2 === 0 ? "transparent" : "rgba(255,255,255,0.02)",
                  }}
                >
                  <span className="flex-1 text-sm" style={{ color: "#c8ccd6" }}>{row.feature}</span>
                  <span className="w-20 text-sm text-center" style={{ color: "#8892a4" }}>{row.hours}</span>
                  <span className="w-28 text-sm font-bold text-right" style={{ color: "#4f9cf9" }}>{row.cost}</span>
                </div>
              ))}
              {/* 合計 */}
              <div
                className="flex items-center px-4 py-3"
                style={{
                  borderTop: "1px solid rgba(79,156,249,0.2)",
                  background: "rgba(79,156,249,0.06)",
                }}
              >
                <span className="flex-1 text-sm font-bold" style={{ color: "#e8eaf0" }}>合計（税抜）</span>
                <span className="w-20 text-xs text-center" style={{ color: "#8892a4" }}>{est.totalHours}</span>
                <span className="w-28 text-sm font-black text-right" style={{ color: "#4f9cf9" }}>
                  {est.totalMin} 〜 {est.totalMax}
                </span>
              </div>
            </div>

            {/* 備考 */}
            {est.notes.length > 0 && (
              <>
                <p className="text-xs font-bold tracking-widest uppercase mb-3" style={{ color: "#4f9cf9" }}>
                  備考・前提条件
                </p>
                <ul className="space-y-2">
                  {est.notes.map((note, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm" style={{ color: "#8892a4" }}>
                      <span style={{ color: "#4f9cf9", marginTop: "2px", flexShrink: 0 }}>・</span>
                      <span className="leading-relaxed">{note}</span>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>

          {/* 免責 + CTAボタン */}
          <div
            className="rounded-3xl p-6"
            style={{
              background: "rgba(17,24,37,0.92)",
              border: "1px solid rgba(79,156,249,0.18)",
              boxShadow: "0 8px 48px rgba(0,0,0,0.5)",
            }}
          >
            <p className="text-sm font-bold mb-2" style={{ color: "#e8eaf0" }}>
              次のステップ
            </p>
            <p className="text-sm leading-relaxed mb-5" style={{ color: "#8892a4" }}>
              より正確な金額・スケジュールについては、詳細なヒアリングの上でご提案いたします。<br />
              まずはお気軽に初回無料相談（60分）をご活用ください。
            </p>
            <Link
              href="/"
              className="inline-block w-full text-sm font-semibold py-3.5 rounded-full text-white text-center transition-all duration-200"
              style={{
                background: "linear-gradient(135deg, #4f9cf9, #7c5cbf)",
                boxShadow: "0 4px 20px rgba(79,156,249,0.4)",
              }}
            >
              トップに戻る
            </Link>
          </div>

          {/* 免責テキスト */}
          <p className="text-xs text-center pb-4" style={{ color: "#4b5563" }}>
            ※ 本見積もりはAIによる参考値であり、正式な見積書ではありません。<br />
            ※ 実際の費用は詳細要件・デザイン・コンテンツ量等によって変動します。
          </p>

        </div>
      </main>
    </div>
  );
}
