import Link from "next/link";

const SECTIONS = [
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
      "当社は、個人情報の漏えい、滅失またはき損を防止するため、アクセス制御、暗号化、監査ログの取得など適切な安全管理措置を講じます。\n\n委託先に対しても、契約等により適切な安全管理措置を義務付け、定期的に監督を行います。",
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

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-100 px-6 py-4 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <Link href="/" className="text-lg font-bold tracking-tight hover:opacity-70 transition-opacity">
            AI<span style={{ color: "#008080" }}>見積もり</span>
          </Link>
          <Link
            href="/estimate"
            className="text-xs font-medium px-4 py-2 rounded-full text-white transition-opacity hover:opacity-80"
            style={{ backgroundColor: "#008080" }}
          >
            見積もりに戻る
          </Link>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-6 py-12">
        <div className="mb-10">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">プライバシーポリシー</h1>
          <p className="text-sm text-gray-400">最終更新日：2026年2月19日</p>
        </div>

        <div className="space-y-6">
          {SECTIONS.map((section) => (
            <div key={section.title} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <h2 className="text-sm font-bold mb-3" style={{ color: "#008080" }}>
                {section.title}
              </h2>
              <div className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">
                {section.content}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link
            href="/estimate"
            className="inline-block text-sm font-semibold px-8 py-3.5 rounded-full text-white transition-opacity hover:opacity-80"
            style={{ backgroundColor: "#008080", boxShadow: "0 4px 16px #00808044" }}
          >
            見積もりフォームに戻る
          </Link>
        </div>
      </main>

      <footer className="text-center py-8">
        <p className="text-xs text-gray-300">© 2026 AI見積もり</p>
      </footer>
    </div>
  );
}
