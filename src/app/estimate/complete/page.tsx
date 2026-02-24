import Link from "next/link";

export default function CompletePage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white border-b border-gray-100 px-6 py-4">
        <div className="max-w-6xl mx-auto">
          <Link href="/" className="text-lg font-bold tracking-tight hover:opacity-70 transition-opacity">
            AI<span style={{ color: "#008080" }}>見積もり</span>
          </Link>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center px-6 py-20">
        <div className="bg-white rounded-3xl p-10 border border-gray-100 shadow-sm max-w-md w-full text-center">

          {/* アイコン */}
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
            style={{ backgroundColor: "#008080", boxShadow: "0 4px 24px #00808044" }}
          >
            <svg className="w-9 h-9 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mb-3">
            送信が完了しました！
          </h1>

          {/* メイン説明 */}
          <p className="text-gray-600 text-sm leading-relaxed mb-6">
            まもなくご登録のメールアドレスへ<br />
            <span className="font-semibold text-gray-800">AI見積もりをお送りいたします。</span>
          </p>

          {/* メール到着のお知らせカード */}
          <div
            className="rounded-2xl px-5 py-4 mb-6 text-left"
            style={{ backgroundColor: "#00808010", border: "2px solid #00808033" }}
          >
            <div className="flex items-center gap-3">
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center shrink-0"
                style={{ backgroundColor: "#008080" }}
              >
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <p className="text-xs font-bold text-gray-800">数分以内にメールをお届けします</p>
                <p className="text-xs text-gray-500 mt-0.5">このページを閉じていただいて構いません</p>
              </div>
            </div>
          </div>

          {/* 注意事項 */}
          <p className="text-xs text-gray-400 mb-7">
            ※ メールが届かない場合は迷惑メールフォルダをご確認ください。
          </p>

          <Link
            href="/"
            className="inline-block w-full text-sm font-semibold py-3.5 rounded-full transition-all duration-200 text-white"
            style={{ backgroundColor: "#008080", boxShadow: "0 4px 16px #00808044" }}
          >
            トップに戻る
          </Link>
        </div>
      </main>
    </div>
  );
}
