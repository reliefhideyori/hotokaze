"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const TEAL = "#008080";
const TEAL_BG = "#00808014";
const TEAL_BORDER = "#00808077";

type Phase = "systemType" | "questions" | "email" | "contact";
type ModalType = "terms" | "privacy" | null;

interface Question {
  question: string;
  type: "select" | "text";
  options?: string[];
  required?: boolean;
  subtitle?: string;
}

interface ContactInfo {
  name: string;
  company: string;
  email: string;
  phone: string;
}

// ============================================================
// Q1 選択肢
// ============================================================
const SYSTEM_TYPES = [
  { label: "ホームページ", icon: "🌐", desc: "会社・お店の紹介サイトを作りたい" },
  { label: "LP（広告用の1枚ページ）", icon: "📣", desc: "広告・集客用のランディングページを作りたい" },
  { label: "未定 / 相談したい", icon: "💬", desc: "何が必要かわからない・まず相談したい" },
];

// ============================================================
// ルート別 質問セット — すべて単一選択・クリックで即遷移
// ============================================================
const QUESTION_SETS: Record<string, Question[]> = {
  "ホームページ": [
    {
      question: "一番の目的を教えてください",
      type: "select",
      options: [
        "会社・お店の信頼性を上げたい",
        "問い合わせを増やしたい",
        "採用を強化したい",
        "商品・サービスをわかりやすく伝えたい",
        "とりあえず早く公開したい",
        "まだ整理できていない / 相談したい",
      ],
    },
    {
      question: "現在のWeb状況を教えてください",
      type: "select",
      options: [
        "何もない（これが最初のWeb展開）",
        "SNSのみ（HP/LPはない）",
        "古いHPがある（作り直したい）",
        "わからない / 相談したい",
      ],
    },
    {
      question: "希望する時期を教えてください",
      type: "select",
      options: [
        "できるだけ早く（2週間以内）",
        "1か月以内",
        "2〜3か月以内",
        "時期は未定（まず相談したい）",
      ],
    },
    {
      question: "想定するページ規模を教えてください",
      type: "select",
      options: [
        "1ページで十分（シンプル）",
        "3〜5ページくらい（標準）",
        "6ページ以上（しっかり作りたい）",
        "わからない / 提案してほしい",
      ],
    },
    {
      question: "最も必要な機能を1つ選んでください",
      type: "select",
      options: [
        "問い合わせフォーム",
        "予約機能",
        "お知らせ更新（ブログ）",
        "採用応募フォーム",
        "特になし / 相談したい",
      ],
    },
    {
      question: "素材の準備状況を教えてください",
      type: "select",
      options: [
        "ほぼ揃っている（ロゴ・写真・文章）",
        "一部ある",
        "何もない（全部相談したい）",
      ],
    },
    {
      question: "予算の目安を教えてください",
      type: "select",
      subtitle: "任意",
      options: [
        "〜10万円",
        "10〜30万円",
        "30〜50万円",
        "50万円以上",
        "まだわからない / 提案を見て決めたい",
      ],
    },
  ],

  "LP（広告用の1枚ページ）": [
    {
      question: "一番の目的を教えてください",
      type: "select",
      options: [
        "問い合わせ・予約を増やしたい",
        "新商品・新サービスを告知したい",
        "資料請求を増やしたい",
        "集客を強化したい",
        "まだ整理できていない / 相談したい",
      ],
    },
    {
      question: "LPは今回が初めてですか？",
      type: "select",
      options: [
        "初めて作る",
        "すでにLPがある（改善したい）",
        "わからない / 相談したい",
      ],
    },
    {
      question: "広告の状況を教えてください",
      type: "select",
      options: [
        "広告はすでに回している",
        "広告はこれから始める",
        "わからない / 相談したい",
      ],
    },
    {
      question: "達成したい成果（CV）を教えてください",
      type: "select",
      options: [
        "問い合わせ獲得",
        "予約獲得",
        "LINE登録",
        "資料請求",
        "商品購入（決済）",
        "応募（採用）",
        "その他 / 相談したい",
      ],
    },
    {
      question: "メインの集客チャンネルを教えてください",
      type: "select",
      options: [
        "Instagram / SNS",
        "Google広告",
        "Meta広告（Facebook / Instagram）",
        "LINE",
        "チラシ / QRコード",
        "SEO（検索流入）",
        "未定 / 相談したい",
      ],
    },
    {
      question: "素材の準備状況を教えてください",
      type: "select",
      options: [
        "ほぼ揃っている（商品説明・写真・実績など）",
        "一部ある",
        "何もない（壁打ちから相談したい）",
      ],
    },
    {
      question: "希望する時期を教えてください",
      type: "select",
      options: [
        "できるだけ早く（2週間以内）",
        "1か月以内",
        "2〜3か月以内",
        "時期は未定（まず相談したい）",
      ],
    },
    {
      question: "予算の目安を教えてください",
      type: "select",
      subtitle: "任意",
      options: [
        "〜10万円",
        "10〜30万円",
        "30〜50万円",
        "50万円以上",
        "まだわからない / 提案を見て決めたい",
      ],
    },
  ],

  "未定 / 相談したい": [
    {
      question: "今回の目的に近いものはどれですか？",
      type: "select",
      options: [
        "まずは名刺代わりのページがほしい",
        "集客や広告用のページがほしい",
        "まだ何が必要かわからない",
      ],
    },
    {
      question: "現在のWeb状況を教えてください",
      type: "select",
      options: [
        "何もない（今が最初の一歩）",
        "SNSはある",
        "既存ページはあるが弱い",
        "わからない",
      ],
    },
    {
      question: "希望する時期を教えてください",
      type: "select",
      options: [
        "できるだけ早く（2週間以内）",
        "1か月以内",
        "2〜3か月以内",
        "時期は未定（まず相談したい）",
      ],
    },
    {
      question: "素材の準備状況を教えてください",
      type: "select",
      options: [
        "ほぼ揃っている（ロゴ・写真・文章）",
        "一部ある",
        "何もない（整理から相談したい）",
      ],
    },
    {
      question: "優先したいことを教えてください",
      type: "select",
      options: [
        "会社・お店の信頼性を上げたい",
        "問い合わせを増やしたい",
        "採用を強化したい",
        "集客・広告を始めたい",
        "まだ整理できていない / 相談したい",
      ],
    },
    {
      question: "予算の目安を教えてください",
      type: "select",
      subtitle: "任意",
      options: [
        "〜10万円",
        "10〜30万円",
        "30〜50万円",
        "50万円以上",
        "まだわからない / 提案を見て決めたい",
      ],
    },
  ],
};

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
  const [contact, setContact] = useState<ContactInfo>({
    name: "",
    company: "",
    email: "",
    phone: "",
  });
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [direction, setDirection] = useState<"forward" | "backward">("forward");
  const [animKey, setAnimKey] = useState(0);
  const [modal, setModal] = useState<ModalType>(null);

  const advance = (dir: "forward" | "backward" = "forward") => {
    setDirection(dir);
    setAnimKey((k) => k + 1);
  };

  // Q1: ルート選択
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

  // 単一選択 → クリックで即遷移
  const answerAndAdvance = (answer: string) => {
    const newAnswers = [...answers];
    newAnswers[currentQ] = answer;
    setAnswers(newAnswers);

    if (currentQ < questions.length - 1) {
      advance("forward");
      setCurrentQ(currentQ + 1);
      setCurrentAnswer(newAnswers[currentQ + 1] || "");
    } else {
      advance("forward");
      setPhase("email");
    }
  };

  // メールページから連絡先ページへ
  const goToContact = () => {
    if (!contact.email.trim()) {
      setEmailError("メールアドレスを入力してください。");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact.email)) {
      setEmailError("正しいメールアドレスを入力してください。");
      return;
    }
    setEmailError("");
    advance("forward");
    setPhase("contact");
  };

  // 戻る
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
    } else if (phase === "contact") {
      advance("backward");
      setPhase("email");
    }
  };

  // 送信
  const submitEstimate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contact.name.trim()) { setError("お名前を入力してください。"); return; }
    if (!contact.phone.trim()) { setError("電話番号を入力してください。"); return; }
    if (!contact.email.trim()) { setError("メールアドレスを入力してください。"); return; }
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
        body: JSON.stringify({ systemType, qa, contact }),
      });
      // レスポンスが非JSONの場合（タイムアウト等）に備えて安全にパース
      let data: { success?: boolean; estimate?: unknown; error?: string } = {};
      try {
        data = await res.json();
      } catch {
        throw new Error(
          res.status === 504
            ? "処理に時間がかかりすぎました。しばらく後でお試しください。"
            : "サーバーエラーが発生しました。しばらく後でお試しください。"
        );
      }
      if (!res.ok) {
        throw new Error(data.error || "送信に失敗しました。");
      }
      // 見積もりデータを sessionStorage に保存して complete ページで表示
      if (data.estimate) {
        sessionStorage.setItem(
          "hotokaze_estimate",
          JSON.stringify({
            estimate: data.estimate,
            systemType,
            contact: {
              name: contact.name,
              company: contact.company,
              email: contact.email,
            },
          })
        );
      }
      router.push("/estimate/complete");
    } catch (err) {
      setError(err instanceof Error ? err.message : "送信に失敗しました。");
    } finally {
      setSubmitting(false);
    }
  };

  // プログレスバー
  const totalSteps = 1 + questions.length + 1 + 1;
  let currentStep = 0;
  if (phase === "systemType") currentStep = 0;
  else if (phase === "questions") currentStep = 1 + currentQ;
  else if (phase === "email") currentStep = 1 + questions.length;
  else if (phase === "contact") currentStep = totalSteps;
  const progressPct = totalSteps > 0 ? (currentStep / totalSteps) * 100 : 0;

  const routeLabel = systemType === "未定 / 相談したい" ? "相談" : systemType === "LP（広告用の1枚ページ）" ? "LP" : "HP";

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

          {/* ======== Q1: ルート選択 ======== */}
          {phase === "systemType" && (
            <div>
              <div className="mb-6">
                <h2 className="text-base font-bold text-gray-900">作りたいものを教えてください</h2>
                <p className="text-xs text-gray-400 mt-0.5">選択するとすぐに次に進みます</p>
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

          {/* ======== 質問フェーズ（すべて単一選択・即遷移） ======== */}
          {phase === "questions" && questions.length > 0 && (
            <div className="flex flex-col flex-1">
              <div className="mb-1 flex items-center justify-between">
                <p className="text-xs text-gray-400">質問 {currentQ + 1} / {questions.length}</p>
                <p className="text-xs font-medium" style={{ color: TEAL }}>{routeLabel}</p>
              </div>
              <div className="mb-5">
                <h2 className="text-base font-bold text-gray-900 leading-snug">
                  {questions[currentQ].question}
                </h2>
                {questions[currentQ].subtitle && (
                  <p className="text-xs text-gray-400 mt-0.5">{questions[currentQ].subtitle}</p>
                )}
              </div>

              {/* 単一選択 → クリック即遷移 */}
              {questions[currentQ].type === "select" && (
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
              )}

              {/* テキスト入力（残存） */}
              {questions[currentQ].type === "text" && (
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
                    {currentQ < questions.length - 1 ? "次の質問へ" : "入力完了"}
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

          {/* ======== メールアドレス ======== */}
          {phase === "email" && (
            <div className="flex flex-col flex-1">
              <div className="text-center mb-6">
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                  style={{ background: `${TEAL}15`, border: `2px solid ${TEAL}40` }}
                >
                  <svg className="w-7 h-7" fill="none" stroke={TEAL} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h2 className="text-base font-bold text-gray-900 leading-snug">
                  見積もり情報の入力が<br />完了しました
                </h2>
                <p className="text-xs text-gray-400 mt-1.5 leading-relaxed">
                  AIが作成した見積もりをメールでお届けします。<br />
                  メールアドレスを入力してください。
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5">
                  メールアドレス <span className="text-red-400">*</span>
                </label>
                <input
                  type="email"
                  value={contact.email}
                  onChange={(e) => { setContact({ ...contact, email: e.target.value }); setEmailError(""); }}
                  placeholder="example@company.com"
                  required
                  className="w-full rounded-2xl px-4 py-3 text-sm text-gray-700 placeholder-gray-300 focus:outline-none bg-gray-50 border-2 border-gray-100 transition-colors"
                  onFocus={(e) => (e.target.style.borderColor = TEAL_BORDER)}
                  onBlur={(e) => (e.target.style.borderColor = "#f3f4f6")}
                  onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); goToContact(); } }}
                />
              </div>

              {emailError && (
                <div className="mt-3 flex items-center gap-2 text-xs text-red-500 bg-red-50 border border-red-100 rounded-xl px-3 py-2.5">
                  <span>⚠️</span><span>{emailError}</span>
                </div>
              )}

              <p className="text-[11px] text-gray-400 mt-3 flex items-center gap-1">
                <span>🔒</span> 見積もり結果の送付にのみ使用します。
              </p>

              <button
                type="button"
                onClick={goToContact}
                className="mt-5 w-full font-semibold py-3.5 rounded-full text-sm text-white transition-all duration-200"
                style={{ backgroundColor: TEAL, boxShadow: `0 4px 14px ${TEAL}44` }}
              >
                次へ進む
              </button>

              <button
                type="button"
                onClick={goPrev}
                className="mt-3 w-full py-2.5 text-sm text-gray-400 hover:text-gray-600 transition-colors"
              >
                ← 戻る
              </button>
            </div>
          )}

          {/* ======== 連絡先 ======== */}
          {phase === "contact" && (
            <form onSubmit={submitEstimate} className="flex flex-col flex-1">
              <div className="mb-5">
                <h2 className="text-base font-bold text-gray-900">連絡先を教えてください</h2>
                <p className="text-xs text-gray-400 mt-0.5">見積もり結果と一緒にご案内をお届けします</p>
              </div>

              {/* サマリー */}
              <div
                className="rounded-2xl p-4 mb-4 border-2"
                style={{ borderColor: TEAL_BORDER, backgroundColor: TEAL_BG }}
              >
                <p className="text-[10px] font-semibold tracking-wider uppercase text-gray-400 mb-2">入力内容の確認</p>
                <div className="space-y-2 text-xs max-h-40 overflow-y-auto">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-gray-400 text-[10px]">種別</span>
                    <span className="text-gray-800 font-medium break-words">{systemType}</span>
                  </div>
                  {questions.map((q, i) => (
                    answers[i] ? (
                      <div key={i} className="flex flex-col gap-0.5">
                        <span className="text-gray-400 text-[10px]">{q.question}</span>
                        <span className="text-gray-700 break-words leading-relaxed">{answers[i]}</span>
                      </div>
                    ) : null
                  ))}
                </div>
              </div>

              {/* 連絡先フォーム */}
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1.5">
                    お名前 <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={contact.name}
                    onChange={(e) => setContact({ ...contact, name: e.target.value })}
                    placeholder="山田 太郎"
                    required
                    className="w-full rounded-2xl px-4 py-3 text-sm text-gray-700 placeholder-gray-300 focus:outline-none bg-gray-50 border-2 border-gray-100 transition-colors"
                    onFocus={(e) => (e.target.style.borderColor = TEAL_BORDER)}
                    onBlur={(e) => (e.target.style.borderColor = "#f3f4f6")}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1.5">
                    電話番号 <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="tel"
                    value={contact.phone}
                    onChange={(e) => setContact({ ...contact, phone: e.target.value })}
                    placeholder="090-1234-5678"
                    required
                    className="w-full rounded-2xl px-4 py-3 text-sm text-gray-700 placeholder-gray-300 focus:outline-none bg-gray-50 border-2 border-gray-100 transition-colors"
                    onFocus={(e) => (e.target.style.borderColor = TEAL_BORDER)}
                    onBlur={(e) => (e.target.style.borderColor = "#f3f4f6")}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1.5">
                    会社名 / 屋号
                  </label>
                  <input
                    type="text"
                    value={contact.company}
                    onChange={(e) => setContact({ ...contact, company: e.target.value })}
                    placeholder="株式会社○○（任意）"
                    className="w-full rounded-2xl px-4 py-3 text-sm text-gray-700 placeholder-gray-300 focus:outline-none bg-gray-50 border-2 border-gray-100 transition-colors"
                    onFocus={(e) => (e.target.style.borderColor = TEAL_BORDER)}
                    onBlur={(e) => (e.target.style.borderColor = "#f3f4f6")}
                  />
                </div>
              </div>

              <p className="text-[11px] text-gray-400 mt-3 flex items-center gap-1">
                <span>🔒</span> ご連絡は見積もり送付とご相談のみに使用します。
              </p>

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
