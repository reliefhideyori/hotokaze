import Link from "next/link";

const SECTIONS = [
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
      "当社は、AIが生成した内容の正確性、完全性、有用性について保証するものではありません。\n\n自動生成された見積書・提案資料を利用したこと、または利用できなかったことによって利用者または第三者に生じた損害について、当社は故意または重過失がある場合を除き、一切の責任を負いません。\n\n利用者は、自らの判断と責任において本サービスを利用するものとし、必要に応じて専門家の助言を得るなどして内容の妥当性をご確認ください。",
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

export default function TermsPage() {
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
          <h1 className="text-2xl font-bold text-gray-900 mb-2">利用規約</h1>
          <p className="text-sm text-gray-400">最終更新日：2026年2月19日</p>
        </div>

        <div className="space-y-8">
          {SECTIONS.map((section) => (
            <div key={section.title} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <h2 className="text-sm font-bold text-gray-900 mb-3" style={{ color: "#008080" }}>
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
