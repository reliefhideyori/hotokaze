"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const TEAL = "#008080";
const TEAL_BG = "#00808014";
const TEAL_BORDER = "#00808077";

type Phase = "systemType" | "questions" | "email";
type ModalType = "terms" | "privacy" | null;

interface Question {
  question: string;
  type: "select" | "text";
  options?: string[];
}

// ============================================================
// 定型質問セット
// ============================================================
const QUESTION_SETS: Record<string, Question[]> = {
  "経費精算システム": [
    {
      question: "利用予定のユーザー数を教えてください",
      type: "select",
      options: ["10名以下", "10〜50名", "50〜100名", "100名以上"],
    },
    {
      question: "現在の経費精算方法は何ですか？",
      type: "select",
      options: ["紙・手書き", "Excel・スプレッドシート", "既存システムから乗り換え", "特になし"],
    },
    {
      question: "必要な機能の規模感を教えてください",
      type: "select",
      options: [
        "領収書アップロードのみ（シンプル型）",
        "承認ワークフローも必要",
        "会計システム連携も必要",
        "フル機能（モバイル・レポート・連携）",
      ],
    },
    {
      question: "スマートフォン対応はどこまで必要ですか？",
      type: "select",
      options: ["スマホ対応のWebで十分", "iOS/Androidアプリが必要", "まだ未定"],
    },
    {
      question: "希望する納期はいつ頃ですか？",
      type: "select",
      options: ["3ヶ月以内", "3〜6ヶ月", "6ヶ月以上", "未定"],
    },
    {
      question: "ご予算の目安を教えてください",
      type: "select",
      options: ["〜100万円", "100〜300万円", "300〜500万円", "500万円以上", "未定"],
    },
    {
      question: "その他、ご要望や気になることがあればご記入ください（任意）",
      type: "text",
    },
  ],
  "ホームページ（LP）": [
    {
      question: "サイトの主な目的を教えてください",
      type: "select",
      options: [
        "会社・事業の紹介",
        "商品・サービスのPR",
        "リード獲得（問い合わせ・資料請求）",
        "イベント・キャンペーン告知",
      ],
    },
    {
      question: "ページ構成はどのくらいを想定していますか？",
      type: "select",
      options: ["1ページ（LP）", "5ページ以内", "10ページ以内", "10ページ以上"],
    },
    {
      question: "デザインのテイストを教えてください",
      type: "select",
      options: ["シンプル・ミニマル", "高級感・プレミアム", "ポップ・カジュアル", "コーポレート・信頼感"],
    },
    {
      question: "必要な機能を教えてください",
      type: "select",
      options: [
        "お問い合わせフォームのみ",
        "お問い合わせ＋ブログ・更新機能",
        "多言語・SEO対策も必要",
        "ECやシステム連携も含む",
      ],
    },
    {
      question: "希望する納期はいつ頃ですか？",
      type: "select",
      options: ["1ヶ月以内", "1〜2ヶ月", "2〜3ヶ月", "未定"],
    },
    {
      question: "ご予算の目安を教えてください",
      type: "select",
      options: ["〜30万円", "30〜100万円", "100〜300万円", "300万円以上", "未定"],
    },
    {
      question: "参考にしたいサイトのURLや、その他ご要望があればご記入ください（任意）",
      type: "text",
    },
  ],
};

const SYSTEM_TYPES = [
  { label: "経費精算システム", icon: "🧾", desc: "社内の経費申請・承認フローをシステム化" },
  { label: "ホームページ（LP）", icon: "🌐", desc: "企業サイト・サービス紹介・ランディングページ" },
];

// ============================================================
// モーダルコンテンツ
// ============================================================
const TERMS_SECTIONS = [
  {
    title: "第1条（適用）",
    content:
      "本利用規約（以下、「本規約」といいます。）は、当社が提供するAI見積もりサービス（以下、「本サービス」といいます。）の利用条件を定めるものです。利用者は本サービスを利用することにより、本規約に同意したものとみなされます。",
  },
  {
    title: "第2条（定義）",
    content:
      "本規約において「利用者」とは、本サービスを閲覧、利用、または資料請求・問い合わせを行う個人または法人をいいます。\n\n「見積書」とは、本サービスを通じて生成・提供される各種提案資料を指します。",
  },
  {
    title: "第3条（サービス内容）",
    content:
      "当社は、利用者からの入力情報をもとに、AIを活用した初期見積書の自動生成、並びに関連する情報提供を行います。\n\n本サービスの内容は、利用者への事前通知なく追加・変更・中止される場合があります。",
  },
  {
    title: "第4条（AIによる見積書の位置づけ）",
    content:
      "本サービスで提示される見積額・工数・機能構成等は、利用者から提供された情報をAIが解釈した結果に基づく自動算出です。\n\nAIの特性上、実際の開発条件、詳細要件、技術的制約、人員構成等によって金額・作業内容が大幅に変動する可能性があることを利用者は理解し、承諾するものとします。\n\n当社は、正式なプロジェクト発注前には必ず担当者とのヒアリングおよび詳細見積もり工程を実施し、その結果に基づく正式見積書を発行いたします。自動生成された資料は参考値であり、契約や支払い義務を直接発生させるものではありません。",
  },
  {
    title: "第5条（免責）",
    content:
      "当社は、AIが生成した内容の正確性、完全性、有用性について保証するものではありません。\n\n自動生成された見積書・提案資料を利用したこと、または利用できなかったことによって利用者または第三者に生じた損害について、当社は故意または重過失がある場合を除き、一切の責任を負いません。",
  },
  {
    title: "第6条（利用者の責務）",
    content:
      "利用者は、本サービスに入力する情報が正確かつ最新であるよう努めるものとします。\n\n利用者は、当社または第三者の権利・利益を侵害する行為、本サービスの運営を妨げる行為、その他法令または公序良俗に反する行為を行ってはなりません。",
  },
  {
    title: "第7条（知的財産権）",
    content:
      "本サービスに関する著作権、商標権、その他一切の知的財産権は、当社または正当な権利者に帰属します。\n\n利用者は、当社の事前の書面による承諾なく、本サービスを通じて得られた情報の複製、転用、再配布等を行うことはできません。",
  },
  {
    title: "第8条（個人情報の取り扱い）",
    content:
      "当社は、利用者の個人情報を適切に管理し、法令に基づき取り扱います。収集した個人情報は、見積もり結果の送付および当社からのご連絡にのみ使用します。利用者の同意なく第三者に提供することはありません。",
  },
  {
    title: "第9条（規約の変更）",
    content:
      "当社は、必要と判断した場合には、利用者へ通知することなく本規約を変更することができます。変更後の本規約は、当社ウェブサイトに掲示した時点から効力を生じるものとし、利用者は継続して本サービスを利用することにより変更後の規約に同意したものとみなされます。",
  },
  {
    title: "第10条（準拠法・合意管轄）",
    content:
      "本規約は、日本法に準拠し解釈されるものとします。\n\n本サービスに関して当社と利用者との間で紛争が生じた場合には、当社本店所在地を管轄する裁判所を第一審の専属的合意管轄裁判所とします。",
  },
];

const PRIVACY_SECTIONS = [
  {
    title: "1. 取得する個人情報",
    content:
      "本サービスでは、利用者が入力フォーム等を通じて送信するメールアドレス、その他本サービスの提供に必要な情報を取得します。\n\nサービス品質向上や不正防止のため、利用状況に関するログ情報（IPアドレス、ブラウザ種別、アクセス日時等）を取得する場合があります。",
  },
  {
    title: "2. 利用目的",
    content:
      "・AIによる見積書の生成および送付、並びに関連する連絡のため\n・サービス改善、新機能開発、利用状況の分析のため\n・ご質問・ご相談への対応、サポート提供のため\n・法令または行政当局からの要請に応じるため",
  },
  {
    title: "3. 第三者提供および委託",
    content:
      "当社は、利用目的の達成に必要な範囲内で、適切な管理体制を有する業務委託先に個人情報の取扱いを委託することがあります。\n\n法令に基づく場合を除き、利用者の同意なく第三者に個人情報を提供することはありません。",
  },
  {
    title: "4. 個人情報の安全管理",
    content:
      "当社は、個人情報の漏えい、滅失またはき損を防止するため、アクセス制御、暗号化、監査ログの取得など適切な安全管理措置を講じます。",
  },
  {
    title: "5. クッキー等の利用",
    content:
      "当社は、利用者体験の向上や利用状況の分析を目的としてクッキー等の技術を利用する場合があります。ブラウザ設定によりクッキーを無効にすることは可能ですが、その場合一部機能が制限されることがあります。",
  },
  {
    title: "6. 開示、訂正、利用停止等の請求",
    content:
      "利用者は、当社が保有する自身の個人情報について、開示・訂正・利用停止等を求めることができます。ご希望の際はお問い合わせ先までご連絡ください。",
  },
  {
    title: "7. 未成年者の利用",
    content:
      "未成年者が本サービスを利用する場合、親権者または法定代理人の同意を得た上で個人情報を提供してください。",
  },
  {
    title: "8. ポリシーの改定",
    content:
      "当社は、法令の改正やサービス内容の変更等に応じて、本ポリシーを改定することがあります。重要な変更がある場合は、当社ウェブサイト上で告知します。",
  },
];

// ============================================================
// モーダル
// ============================================================
function LegalModal({ type, onClose }: { type: ModalType; onClose: () => void }) {
  if (!type) return null;
  const isTerms = type === "terms";
  const title = isTerms ? "利用規約" : "プライバシーポリシー";
  const sections = isTerms ? TERMS_SECTIONS : PRIVACY_SECTIONS;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
      onClick={onClose}
    >
      <div
        className="bg-white w-full sm:max-w-lg sm:rounded-3xl rounded-t-3xl flex flex-col overflow-hidden"
        style={{ maxHeight: "85vh" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 shrink-0">
          <h2 className="text-base font-bold text-gray-900">{title}</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all duration-200"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="overflow-y-auto flex-1 px-6 py-5">
          <p className="text-[11px] text-gray-400 mb-5">最終更新日：2026年2月19日</p>
          <div className="space-y-5">
            {sections.map((section) => (
              <div key={section.title}>
                <h3 className="text-xs font-bold mb-1.5" style={{ color: TEAL }}>{section.title}</h3>
                <p className="text-xs text-gray-600 leading-relaxed whitespace-pre-line">{section.content}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="px-6 py-4 border-t border-gray-100 shrink-0">
          <button
            onClick={onClose}
            className="w-full font-semibold py-3 rounded-full text-sm text-white transition-opacity hover:opacity-80"
            style={{ backgroundColor: TEAL }}
          >
            閉じる
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// メインフォーム
// ============================================================
export default function EstimateForm() {
  const router = useRouter();
  const [phase, setPhase] = useState<Phase>("systemType");
  const [systemType, setSystemType] = useState("");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [currentAnswer, setCurrentAnswer] = useState("");
  const [email, setEmail] = useState("");
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [direction, setDirection] = useState<"forward" | "backward">("forward");
  const [animKey, setAnimKey] = useState(0);
  const [modal, setModal] = useState<ModalType>(null);

  const advance = (dir: "forward" | "backward" = "forward") => {
    setDirection(dir);
    setAnimKey((k) => k + 1);
  };

  const selectSystemType = (type: string) => {
    setSystemType(type);
    const qs = QUESTION_SETS[type] ?? [];
    setQuestions(qs);
    setAnswers(new Array(qs.length).fill(""));
    setCurrentQ(0);
    setCurrentAnswer("");
    advance("forward");
    setPhase("questions");
  };

  const answerAndAdvance = (answer: string) => {
    const newAnswers = [...answers];
    newAnswers[currentQ] = answer;
    setAnswers(newAnswers);

    if (currentQ < questions.length - 1) {
      advance("forward");
      setCurrentQ((q) => q + 1);
      setCurrentAnswer("");
    } else {
      advance("forward");
      setPhase("email");
    }
  };

  const goPrev = () => {
    if (phase === "questions") {
      if (currentQ > 0) {
        const prevIdx = currentQ - 1;
        advance("backward");
        setCurrentQ(prevIdx);
        setCurrentAnswer(answers[prevIdx] || "");
      } else {
        advance("backward");
        setPhase("systemType");
      }
    } else if (phase === "email") {
      const lastQ = questions.length - 1;
      advance("backward");
      setCurrentQ(lastQ);
      setCurrentAnswer(answers[lastQ] || "");
      setPhase("questions");
    }
  };

  const submitEstimate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) { setError("メールアドレスを入力してください。"); return; }
    if (!agreedToTerms) { setError("利用規約・プライバシーポリシーへの同意が必要です。"); return; }
    setSubmitting(true);
    setError("");

    try {
      const qa = questions.map((q, i) => ({
        question: q.question,
        answer: answers[i] || "（回答なし）",
      }));
      const res = await fetch("/api/estimate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ systemType, qa, email }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "送信に失敗しました。");
      }
      router.push("/estimate/complete");
    } catch (err) {
      setError(err instanceof Error ? err.message : "送信に失敗しました。");
    } finally {
      setSubmitting(false);
    }
  };

  // プログレスバー
  const totalSteps = 1 + questions.length + 1; // systemType + questions + email
  let currentStep = 0;
  if (phase === "systemType") currentStep = 0;
  else if (phase === "questions") currentStep = 1 + currentQ;
  else if (phase === "email") currentStep = totalSteps;
  const progressPct = totalSteps > 0 ? (currentStep / totalSteps) * 100 : 0;

  return (
    <>
      <LegalModal type={modal} onClose={() => setModal(null)} />

      <div className="flex flex-col h-full">
        {/* プログレスバー */}
        <div className="w-full h-1 bg-gray-100 rounded-full mb-6 overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progressPct}%`, backgroundColor: TEAL }}
          />
        </div>

        <div
          key={animKey}
          className={`flex-1 flex flex-col ${direction === "forward" ? "step-forward" : "step-backward"}`}
        >

          {/* フェーズ: システム種別選択 */}
          {phase === "systemType" && (
            <div>
              <div className="mb-6">
                <h2 className="text-base font-bold text-gray-900">どんなシステムを作りたいですか？</h2>
                <p className="text-xs text-gray-400 mt-0.5">最も近いものを選択してください</p>
              </div>
              <div className="space-y-3">
                {SYSTEM_TYPES.map(({ label, icon, desc }) => (
                  <button
                    key={label}
                    type="button"
                    onClick={() => selectSystemType(label)}
                    className="flex items-center gap-4 w-full px-5 py-4 rounded-2xl border-2 text-left transition-all duration-200"
                    style={{ borderColor: "#e2e8f0", backgroundColor: "#f8fafc" }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLElement).style.borderColor = TEAL_BORDER;
                      (e.currentTarget as HTMLElement).style.backgroundColor = TEAL_BG;
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.borderColor = "#e2e8f0";
                      (e.currentTarget as HTMLElement).style.backgroundColor = "#f8fafc";
                    }}
                  >
                    <span className="text-2xl">{icon}</span>
                    <div>
                      <p className="font-semibold text-gray-800">{label}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{desc}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* フェーズ: 質問 */}
          {phase === "questions" && questions.length > 0 && (
            <div className="flex flex-col flex-1">
              <div className="mb-1 flex items-center justify-between">
                <p className="text-xs text-gray-400">質問 {currentQ + 1} / {questions.length}</p>
                <p className="text-xs font-medium" style={{ color: TEAL }}>{systemType}</p>
              </div>
              <div className="mb-5">
                <h2 className="text-base font-bold text-gray-900 leading-snug">
                  {questions[currentQ].question}
                </h2>
              </div>

              {questions[currentQ].type === "select" ? (
                <div className="space-y-2 flex-1">
                  {questions[currentQ].options!.map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => answerAndAdvance(opt)}
                      className="flex items-center w-full px-4 py-3.5 rounded-2xl border-2 text-left text-sm font-medium text-gray-700 transition-all duration-200"
                      style={{
                        borderColor: answers[currentQ] === opt ? TEAL_BORDER : "#e2e8f0",
                        backgroundColor: answers[currentQ] === opt ? TEAL_BG : "#f8fafc",
                      }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLElement).style.borderColor = TEAL_BORDER;
                        (e.currentTarget as HTMLElement).style.backgroundColor = TEAL_BG;
                      }}
                      onMouseLeave={(e) => {
                        if (answers[currentQ] !== opt) {
                          (e.currentTarget as HTMLElement).style.borderColor = "#e2e8f0";
                          (e.currentTarget as HTMLElement).style.backgroundColor = "#f8fafc";
                        }
                      }}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col flex-1">
                  <textarea
                    value={currentAnswer}
                    onChange={(e) => setCurrentAnswer(e.target.value)}
                    placeholder="任意でご記入ください"
                    rows={4}
                    className="w-full rounded-2xl px-4 py-3 text-sm text-gray-700 placeholder-gray-300 focus:outline-none resize-none bg-gray-50 border-2 border-gray-100 leading-relaxed"
                    onFocus={(e) => (e.target.style.borderColor = TEAL_BORDER)}
                    onBlur={(e) => (e.target.style.borderColor = "#f3f4f6")}
                  />
                  <button
                    type="button"
                    onClick={() => answerAndAdvance(currentAnswer)}
                    className="mt-4 w-full font-semibold py-3.5 rounded-full text-sm text-white transition-all duration-200"
                    style={{ backgroundColor: TEAL, boxShadow: `0 4px 14px ${TEAL}44` }}
                  >
                    {currentQ < questions.length - 1 ? "次の質問へ →" : "入力完了 →"}
                  </button>
                </div>
              )}

              <button
                type="button"
                onClick={goPrev}
                className="mt-3 w-full py-2.5 text-sm text-gray-400 hover:text-gray-600 transition-colors"
              >
                ← 戻る
              </button>
            </div>
          )}

          {/* フェーズ: メール */}
          {phase === "email" && (
            <form onSubmit={submitEstimate} className="flex flex-col flex-1">
              <div className="mb-5">
                <h2 className="text-base font-bold text-gray-900">見積もり送付先を教えてください</h2>
                <p className="text-xs text-gray-400 mt-0.5">AIが作成した見積もりをメールでお届けします</p>
              </div>

              {/* サマリー */}
              <div
                className="rounded-2xl p-4 mb-4 border-2"
                style={{ borderColor: TEAL_BORDER, backgroundColor: TEAL_BG }}
              >
                <p className="text-[10px] font-semibold tracking-wider uppercase text-gray-400 mb-2">入力内容の確認</p>
                <div className="space-y-1.5 text-xs">
                  <div className="flex gap-2">
                    <span className="text-gray-400 w-20 shrink-0">種別</span>
                    <span className="text-gray-800 font-medium">{systemType}</span>
                  </div>
                  {questions.slice(0, 3).map((q, i) => (
                    <div key={i} className="flex gap-2">
                      <span className="text-gray-400 w-20 shrink-0 leading-tight">{q.question.slice(0, 8)}…</span>
                      <span className="text-gray-700">{answers[i] || "—"}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-2">
                  メールアドレス <span className="text-red-400">*</span>
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="example@company.com"
                  required
                  className="w-full rounded-2xl px-4 py-3 text-sm text-gray-700 placeholder-gray-300 focus:outline-none bg-gray-50 border-2 border-gray-100 transition-colors"
                  onFocus={(e) => (e.target.style.borderColor = TEAL_BORDER)}
                  onBlur={(e) => (e.target.style.borderColor = "#f3f4f6")}
                />
                <p className="text-[11px] text-gray-400 mt-1.5 flex items-center gap-1">
                  <span>🔒</span> 見積もり送付のみに使用します。
                </p>
              </div>

              {/* 同意チェックボックス */}
              <label className="flex items-start gap-3 mt-4 cursor-pointer">
                <div className="relative mt-0.5 shrink-0">
                  <input
                    type="checkbox"
                    checked={agreedToTerms}
                    onChange={(e) => setAgreedToTerms(e.target.checked)}
                    className="sr-only"
                  />
                  <div
                    className="w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all duration-200"
                    style={{
                      borderColor: agreedToTerms ? TEAL : "#d1d5db",
                      backgroundColor: agreedToTerms ? TEAL : "white",
                    }}
                  >
                    {agreedToTerms && (
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                </div>
                <span className="text-xs text-gray-500 leading-relaxed">
                  <button
                    type="button"
                    onClick={() => setModal("terms")}
                    className="font-semibold hover:opacity-70 transition-opacity"
                    style={{ color: TEAL }}
                  >
                    利用規約
                  </button>
                  {" "}および{" "}
                  <button
                    type="button"
                    onClick={() => setModal("privacy")}
                    className="font-semibold hover:opacity-70 transition-opacity"
                    style={{ color: TEAL }}
                  >
                    プライバシーポリシー
                  </button>
                  に同意します。
                </span>
              </label>

              {error && (
                <div className="mt-3 flex items-center gap-2 text-xs text-red-500 bg-red-50 border border-red-100 rounded-xl px-3 py-2.5">
                  <span>⚠️</span><span>{error}</span>
                </div>
              )}

              <div className="mt-5 flex gap-3">
                <button
                  type="button"
                  onClick={goPrev}
                  className="flex-1 border-2 border-gray-200 text-gray-500 font-medium py-3 rounded-full text-sm hover:border-gray-300 transition-all duration-200"
                >
                  ← 戻る
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="font-semibold py-3 rounded-full text-sm text-white disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-all duration-200"
                  style={{ flex: 2, backgroundColor: TEAL, boxShadow: submitting ? "none" : `0 4px 16px ${TEAL}44` }}
                >
                  {submitting ? (
                    <>
                      <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                      </svg>
                      AIが見積もり中...
                    </>
                  ) : "見積もりを依頼する ✉️"}
                </button>
              </div>
            </form>
          )}

        </div>
      </div>
    </>
  );
}
