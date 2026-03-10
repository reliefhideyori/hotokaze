import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { Resend } from "resend";
import { generateEstimatePdf, EstimateData } from "@/lib/generateEstimatePdf";

const getGenAI = () => new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });
const getResend = () => new Resend(process.env.RESEND_API_KEY!);

// ============================================================
// 自社単価テーブル（確定版）
// ============================================================
const UNIT_PRICE_TABLE = `
【ベース単価】
- 統一単価: 3,000円/時間（AI活用により実現した低価格）

【ページ種別・規模別 目安工数と費用】
- LP（ランディングページ 1枚もの）: 25時間 → ¥75,000
- ホームページ（1ページ構成）: 25時間 → ¥75,000
- ホームページ ページ追加: +5時間/ページ → +¥15,000/ページ
  例）3ページ構成: 25h + 5h×2 = 35h → ¥105,000
  例）5ページ構成: 25h + 5h×4 = 45h → ¥135,000

【機能別 追加工数と費用】
- 問い合わせフォーム: +10時間 → +¥30,000
- LINE連携: +10時間 → +¥30,000
- ブログ・お知らせ更新機能: +20時間 → +¥60,000
- 採用応募フォーム: +20時間 → +¥60,000
- 予約機能: +20時間 → +¥60,000
- 多言語対応: +20時間 → +¥60,000

【注意事項】
- 上記はすべて税抜き価格
- 見積もりには必ずtotalMin（下限）とtotalMax（上限）を設定すること
- 素材未準備の場合はディレクション費用として+5〜10時間を上限に加算すること
- 「わからない / 相談したい」の回答がある場合は工数に幅を持たせること
`;

// ============================================================
// 連絡先情報の型
// ============================================================
interface ContactInfo {
  name: string;
  company?: string;
  email: string;
  phone?: string;
  lineId?: string;
  preferredDate?: string;
}

// ============================================================
// Geminiへのプロンプト（JSON出力指定）
// ============================================================
function buildPrompt(data: {
  systemType: string;
  qa: { question: string; answer: string }[];
}): string {
  const qaText = data.qa
    .map((item) => `・${item.question}　→　${item.answer}`)
    .join("\n");

  return `あなたはWeb制作会社の見積もり担当者です。
以下のヒアリング結果と単価テーブルをもとに見積もりを作成し、必ずJSONのみを返してください（説明文・マークダウン・コードブロック不要）。

【単価テーブル】
${UNIT_PRICE_TABLE}

【依頼内容】
制作種別: ${data.systemType}

【ヒアリング結果】
${qaText}

【出力形式】JSONのみ出力すること（\`\`\`jsonなどは不要）:
{
  "summary": "制作内容の概要を1〜2文で（日本語）",
  "totalMin": "合計金額（下限）例: ¥75,000",
  "totalMax": "合計金額（上限）例: ¥120,000",
  "deliveryPeriod": "納期目安 例: 3〜4週間",
  "breakdown": [
    { "feature": "項目名", "hours": "工数 例: 25h", "cost": "費用 例: ¥75,000" }
  ],
  "totalHours": "合計工数 例: 25h",
  "notes": [
    "備考・前提条件を3〜5点（文字列の配列、日本語）"
  ]
}`;
}

// ============================================================
// シンプルなメール本文HTML（詳細はPDF添付）
// ============================================================
function buildSimpleEmailHtml(
  systemType: string,
  est: EstimateData,
  contact: ContactInfo
): string {
  const dateStr = new Date().toLocaleDateString("ja-JP", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return `
<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>AI見積もり</title>
</head>
<body style="margin:0;padding:0;background:#f3f4f6;font-family:-apple-system,BlinkMacSystemFont,'Hiragino Sans','Yu Gothic',sans-serif;">

  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f3f4f6;padding:32px 16px;">
    <tr><td align="center">
    <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

      <!-- ヘッダー -->
      <tr>
        <td style="background:#008080;border-radius:16px 16px 0 0;padding:28px 36px;">
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td>
                <p style="margin:0;font-size:11px;color:#99d6d6;letter-spacing:0.08em;text-transform:uppercase;font-weight:600;">AI ESTIMATE</p>
                <h1 style="margin:4px 0 0;font-size:22px;font-weight:700;color:#ffffff;">Hotokaze AI見積もり</h1>
              </td>
              <td align="right">
                <p style="margin:0;font-size:11px;color:#99d6d6;">${dateStr}</p>
                <p style="margin:4px 0 0;font-size:13px;color:#ffffff;font-weight:600;">${systemType}</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>

      <!-- メインカード -->
      <tr>
        <td style="background:#ffffff;padding:36px;">

          <!-- 挨拶 -->
          <p style="margin:0 0 24px;font-size:14px;color:#374151;line-height:1.8;">
            ${contact.name} 様<br><br>
            このたびはHotokazeのAI見積もりをご利用いただき、ありがとうございます。<br>
            概算見積もりを<strong>添付のPDFファイル</strong>にてお届けします。
          </p>

          <!-- 見積もりサマリーカード -->
          <table width="100%" cellpadding="0" cellspacing="0" style="background:#f0fafa;border:2px solid #99d6d6;border-radius:12px;margin-bottom:28px;">
            <tr>
              <td style="padding:24px 28px;">
                <p style="margin:0 0 6px;font-size:11px;color:#008080;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;">概算金額（税抜）</p>
                <p style="margin:0 0 4px;font-size:28px;font-weight:800;color:#111827;">${est.totalMin}<span style="font-size:16px;color:#6b7280;font-weight:400;"> 〜 </span>${est.totalMax}</p>
                <p style="margin:0;font-size:12px;color:#6b7280;">納期目安：${est.deliveryPeriod}　／　合計工数：${est.totalHours}</p>
              </td>
            </tr>
          </table>

          <!-- 本文 -->
          <p style="margin:0 0 16px;font-size:13px;color:#374151;line-height:1.8;">
            詳細な内訳・前提条件・次のステップについては、<br>
            添付のPDFをご覧ください。
          </p>
          <p style="margin:0 0 24px;font-size:13px;color:#374151;line-height:1.8;">
            より正確な金額・スケジュールは、詳細なヒアリングの上でご提案いたします。<br>
            まずはお気軽に初回無料相談（60分）をご活用ください。
          </p>

          <p style="margin:0;font-size:13px;font-weight:700;color:#008080;">Hotokaze</p>
        </td>
      </tr>

      <!-- フッター -->
      <tr>
        <td style="background:#f9fafb;border-radius:0 0 16px 16px;padding:20px 36px;border-top:1px solid #e5e7eb;">
          <p style="margin:0;font-size:11px;color:#9ca3af;line-height:1.8;text-align:center;">
            ※ 本見積もりはAIによる参考値であり、正式な見積書ではありません。<br>
            ※ 実際の制作費用は要件の詳細・デザイン・コンテンツ量によって変動します。
          </p>
        </td>
      </tr>

    </table>
    </td></tr>
  </table>

</body>
</html>
  `;
}

// ============================================================
// API ハンドラー
// ============================================================
export const maxDuration = 60; // PDF生成・Gemini処理のため60秒に設定

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { systemType, qa, contact } = body as {
      systemType: string;
      qa: { question: string; answer: string }[];
      contact: ContactInfo;
    };

    if (!systemType || !contact?.email || !contact?.name) {
      return NextResponse.json({ error: "必須項目が不足しています。" }, { status: 400 });
    }

    // ── [1] Gemini で見積もり生成 ──────────────────────────
    console.log("[1] Gemini API 呼び出し開始");
    const prompt = buildPrompt({ systemType, qa: qa ?? [] });
    let result;
    try {
      result = await getGenAI().models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
      });
    } catch (e) {
      const errMsg = e instanceof Error ? e.message : String(e);
      console.error("[ERROR] Gemini API:", errMsg, e);
      return NextResponse.json({ error: `AI見積もりの生成に失敗しました: ${errMsg}` }, { status: 500 });
    }
    const raw = result.text ?? "";
    console.log("[2] Gemini レスポンス取得完了");

    // ── [2] JSON を抽出・パース ────────────────────────────
    const jsonMatch = raw.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.error("[ERROR] JSON抽出失敗。raw:", raw.slice(0, 300));
      return NextResponse.json({ error: "見積もりデータの解析に失敗しました。" }, { status: 500 });
    }
    let est: EstimateData;
    try {
      est = JSON.parse(jsonMatch[0]);
    } catch (e) {
      console.error("[ERROR] JSON.parse失敗:", e);
      return NextResponse.json({ error: "見積もりデータの解析に失敗しました。" }, { status: 500 });
    }
    console.log("[3] JSON パース完了");

    // ── [3] PDF 生成（失敗してもメール送信は続行） ─────────
    console.log("[4] PDF生成開始");
    const dateStr = new Date().toLocaleDateString("ja-JP", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    let pdfBuffer: Buffer | undefined;
    try {
      pdfBuffer = await generateEstimatePdf(systemType, est, contact, dateStr);
      console.log("[5] PDF生成完了");
    } catch (e) {
      const errMsg = e instanceof Error ? e.message : String(e);
      console.error("[WARN] PDF生成失敗（メール送信は続行）:", errMsg);
      // PDF失敗でもエラーにしない — メールのみ送信に切り替え
    }

    // ── [4] メール送信 ─────────────────────────────────────
    console.log("[6] Resend メール送信開始");
    const sendOptions: Parameters<ReturnType<typeof getResend>["emails"]["send"]>[0] = {
      from: process.env.FROM_EMAIL!,
      to: contact.email,
      subject: `【AI見積もり】${systemType}の概算見積もりをお届けします | Hotokaze`,
      html: buildSimpleEmailHtml(systemType, est, contact),
      ...(pdfBuffer
        ? {
            attachments: [
              {
                filename: "Hotokaze_AI見積もり.pdf",
                content: pdfBuffer,
              },
            ],
          }
        : {}),
    };
    if (process.env.TO_EMAIL) sendOptions.cc = process.env.TO_EMAIL;

    try {
      await getResend().emails.send(sendOptions);
    } catch (e) {
      console.error("[ERROR] Resend:", e);
      return NextResponse.json({ error: "メールの送信に失敗しました。アドレスをご確認ください。" }, { status: 500 });
    }
    console.log("[7] メール送信完了");

    return NextResponse.json({ success: true, estimate: est });
  } catch (error) {
    console.error("[ERROR] 予期しないエラー:", error);
    return NextResponse.json(
      { error: "処理中にエラーが発生しました。しばらく時間をおいて再度お試しください。" },
      { status: 500 }
    );
  }
}
