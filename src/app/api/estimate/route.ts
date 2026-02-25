import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { Resend } from "resend";

const getGenAI = () => new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });
const getResend = () => new Resend(process.env.RESEND_API_KEY!);

// ============================================================
// 自社単価テーブル
// ============================================================
const UNIT_PRICE_TABLE = `
- デザイナー単価: 6,000円/時間
- コーダー（エンジニア）単価: 8,000円/時間
- ディレクション単価: 5,000円/時間

ページ種別・規模別 目安工数:
- LP（1枚もの）: デザイン 15〜30h / コーディング 10〜20h
- コーポレートサイト（3〜5ページ）: デザイン 30〜60h / コーディング 20〜40h
- コーポレートサイト（6ページ以上）: デザイン 50〜100h / コーディング 40〜80h

機能別 目安工数:
- 問い合わせフォーム: 5〜10h
- LINE連携: 3〜8h
- ブログ・お知らせ更新: 15〜30h
- 予約機能: 20〜40h
- 採用応募フォーム: 8〜15h
- 多言語対応: 20〜40h
- SEO対策: 10〜20h
- 写真撮影ディレクション: 10〜20h
- 保守・運用（月額）: 月2〜5h
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

  return `
あなたはWeb制作会社の見積もり担当者です。
以下のヒアリング結果と単価テーブルをもとに見積もりを作成し、必ずJSONのみを返してください（説明文・マークダウン不要）。

【単価テーブル】
${UNIT_PRICE_TABLE}

【依頼内容】
制作種別: ${data.systemType}

【ヒアリング結果】
${qaText}

【出力形式】JSONのみ出力すること:
{
  "summary": "制作内容の概要を1〜2文で",
  "totalMin": "合計金額（下限）例: ¥120,000",
  "totalMax": "合計金額（上限）例: ¥350,000",
  "deliveryPeriod": "納期目安 例: 3〜6週間",
  "breakdown": [
    { "feature": "項目名", "hours": "工数 例: 20〜30h", "cost": "費用 例: ¥120,000〜¥180,000" }
  ],
  "totalHours": "合計工数 例: 50〜80h",
  "notes": [
    "備考・前提条件を3〜5点（文字列の配列）"
  ]
}
`;
}

// ============================================================
// メールHTML生成
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

function buildEmailHtml(
  systemType: string,
  qa: { question: string; answer: string }[],
  est: EstimateData,
  contact: ContactInfo
): string {
  const breakdownRows = est.breakdown
    .map(
      (row, i) => `
      <tr style="background:${i % 2 === 0 ? "#ffffff" : "#f9fafb"}">
        <td style="padding:12px 16px;font-size:13px;color:#374151;border-bottom:1px solid #f3f4f6;">${row.feature}</td>
        <td style="padding:12px 16px;font-size:13px;color:#374151;border-bottom:1px solid #f3f4f6;text-align:center;">${row.hours}</td>
        <td style="padding:12px 16px;font-size:13px;color:#374151;border-bottom:1px solid #f3f4f6;text-align:right;font-weight:600;">${row.cost}</td>
      </tr>`
    )
    .join("");

  const qaRows = qa
    .filter((item) => item.answer && item.answer !== "（回答なし）")
    .map(
      (item) => `
      <tr>
        <td style="padding:10px 16px;font-size:12px;color:#6b7280;border-bottom:1px solid #f3f4f6;width:45%;vertical-align:top;">${item.question}</td>
        <td style="padding:10px 16px;font-size:12px;color:#111827;border-bottom:1px solid #f3f4f6;font-weight:500;">${item.answer}</td>
      </tr>`
    )
    .join("");

  const noteItems = est.notes
    .map(
      (note) =>
        `<li style="font-size:12px;color:#6b7280;line-height:1.8;margin-bottom:4px;">${note}</li>`
    )
    .join("");

  // 連絡先行を構築
  const contactRows: string[] = [];
  contactRows.push(`<tr><td style="padding:8px 16px;font-size:12px;color:#6b7280;border-bottom:1px solid #f3f4f6;width:35%;">お名前</td><td style="padding:8px 16px;font-size:12px;color:#111827;border-bottom:1px solid #f3f4f6;font-weight:500;">${contact.name}</td></tr>`);
  if (contact.company) {
    contactRows.push(`<tr><td style="padding:8px 16px;font-size:12px;color:#6b7280;border-bottom:1px solid #f3f4f6;">会社名 / 屋号</td><td style="padding:8px 16px;font-size:12px;color:#111827;border-bottom:1px solid #f3f4f6;font-weight:500;">${contact.company}</td></tr>`);
  }
  contactRows.push(`<tr><td style="padding:8px 16px;font-size:12px;color:#6b7280;border-bottom:1px solid #f3f4f6;">メールアドレス</td><td style="padding:8px 16px;font-size:12px;color:#111827;border-bottom:1px solid #f3f4f6;font-weight:500;">${contact.email}</td></tr>`);
  if (contact.phone) {
    contactRows.push(`<tr><td style="padding:8px 16px;font-size:12px;color:#6b7280;border-bottom:1px solid #f3f4f6;">電話番号</td><td style="padding:8px 16px;font-size:12px;color:#111827;border-bottom:1px solid #f3f4f6;font-weight:500;">${contact.phone}</td></tr>`);
  }
  if (contact.lineId) {
    contactRows.push(`<tr><td style="padding:8px 16px;font-size:12px;color:#6b7280;border-bottom:1px solid #f3f4f6;">LINE</td><td style="padding:8px 16px;font-size:12px;color:#111827;border-bottom:1px solid #f3f4f6;font-weight:500;">${contact.lineId}</td></tr>`);
  }
  if (contact.preferredDate) {
    contactRows.push(`<tr><td style="padding:8px 16px;font-size:12px;color:#6b7280;border-bottom:1px solid #f3f4f6;">相談希望日時</td><td style="padding:8px 16px;font-size:12px;color:#111827;border-bottom:1px solid #f3f4f6;font-weight:500;">${contact.preferredDate}</td></tr>`);
  }

  return `
<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>AI見積もり結果</title>
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
                <h1 style="margin:4px 0 0;font-size:22px;font-weight:700;color:#ffffff;">AI見積もり</h1>
              </td>
              <td align="right">
                <p style="margin:0;font-size:11px;color:#99d6d6;">${new Date().toLocaleDateString("ja-JP", { year: "numeric", month: "long", day: "numeric" })}</p>
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
          <p style="margin:0 0 28px;font-size:14px;color:#374151;line-height:1.8;">
            ${contact.name} 様<br><br>
            この度はお問い合わせいただきありがとうございます。<br>
            ヒアリング内容をもとに、AIが概算見積もりを作成しました。
          </p>

          <!-- 見積もりサマリーカード -->
          <table width="100%" cellpadding="0" cellspacing="0" style="background:#f0fafa;border:2px solid #99d6d6;border-radius:12px;margin-bottom:28px;">
            <tr>
              <td style="padding:24px 28px;">
                <p style="margin:0 0 6px;font-size:11px;color:#008080;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;">概算見積もり</p>
                <p style="margin:0 0 4px;font-size:28px;font-weight:800;color:#111827;">${est.totalMin}<span style="font-size:16px;color:#6b7280;font-weight:400;"> 〜 </span>${est.totalMax}</p>
                <p style="margin:0;font-size:12px;color:#6b7280;">税抜き ／ 納期目安：${est.deliveryPeriod}</p>
                <hr style="border:none;border-top:1px solid #c5e8e8;margin:16px 0;">
                <p style="margin:0;font-size:13px;color:#374151;line-height:1.7;">${est.summary}</p>
              </td>
            </tr>
          </table>

          <!-- お客様情報 -->
          <p style="margin:0 0 12px;font-size:11px;font-weight:700;color:#008080;letter-spacing:0.08em;text-transform:uppercase;">お客様情報</p>
          <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #f3f4f6;border-radius:10px;overflow:hidden;margin-bottom:28px;">
            ${contactRows.join("")}
          </table>

          <!-- ヒアリング内容 -->
          <p style="margin:0 0 12px;font-size:11px;font-weight:700;color:#008080;letter-spacing:0.08em;text-transform:uppercase;">ヒアリング内容</p>
          <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #f3f4f6;border-radius:10px;overflow:hidden;margin-bottom:28px;">
            ${qaRows}
          </table>

          <!-- 機能別内訳 -->
          <p style="margin:0 0 12px;font-size:11px;font-weight:700;color:#008080;letter-spacing:0.08em;text-transform:uppercase;">見積もり内訳</p>
          <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #f3f4f6;border-radius:10px;overflow:hidden;margin-bottom:16px;">
            <tr style="background:#008080;">
              <th style="padding:10px 16px;font-size:11px;color:#ffffff;text-align:left;font-weight:600;">項目</th>
              <th style="padding:10px 16px;font-size:11px;color:#ffffff;text-align:center;font-weight:600;">工数</th>
              <th style="padding:10px 16px;font-size:11px;color:#ffffff;text-align:right;font-weight:600;">費用（概算）</th>
            </tr>
            ${breakdownRows}
          </table>

          <!-- 合計行 -->
          <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
            <tr>
              <td style="padding:14px 16px;background:#f9fafb;border-radius:10px;">
                <table width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="font-size:13px;color:#374151;font-weight:600;">合計工数</td>
                    <td align="right" style="font-size:13px;color:#374151;font-weight:600;">${est.totalHours}</td>
                  </tr>
                  <tr>
                    <td style="font-size:15px;color:#111827;font-weight:800;padding-top:6px;">合計金額（税抜）</td>
                    <td align="right" style="font-size:15px;color:#008080;font-weight:800;padding-top:6px;">${est.totalMin} 〜 ${est.totalMax}</td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>

          <!-- 備考 -->
          <p style="margin:0 0 12px;font-size:11px;font-weight:700;color:#008080;letter-spacing:0.08em;text-transform:uppercase;">備考・前提条件</p>
          <ul style="margin:0 0 28px;padding-left:20px;">
            ${noteItems}
          </ul>

          <!-- 次のステップ -->
          <table width="100%" cellpadding="0" cellspacing="0" style="background:#f9fafb;border-radius:12px;margin-bottom:8px;">
            <tr>
              <td style="padding:20px 24px;">
                <p style="margin:0 0 8px;font-size:13px;font-weight:700;color:#111827;">次のステップ</p>
                <p style="margin:0;font-size:13px;color:#6b7280;line-height:1.7;">
                  上記はAIによる概算見積もりです。より正確な金額は、詳細なヒアリングの上でご提案いたします。<br>
                  お気軽にご相談ください。
                </p>
              </td>
            </tr>
          </table>

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
export const maxDuration = 30; // Vercel タイムアウトを30秒に延長

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

    // Gemini で見積もり生成（JSON形式）
    console.log("[1] Gemini API 呼び出し開始");
    const prompt = buildPrompt({ systemType, qa: qa ?? [] });
    let result;
    try {
      result = await getGenAI().models.generateContent({
        model: "gemini-2.0-flash",
        contents: prompt,
      });
    } catch (e) {
      console.error("[ERROR] Gemini API:", e);
      return NextResponse.json({ error: "AI見積もりの生成に失敗しました。時間をおいて再度お試しください。" }, { status: 500 });
    }
    const raw = result.text ?? "";
    console.log("[2] Gemini レスポンス取得完了");

    // JSON を抽出・パース
    const jsonMatch = raw.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.error("[ERROR] JSON抽出失敗。raw:", raw.slice(0, 200));
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

    // メール送信
    console.log("[4] Resend メール送信開始");
    const sendOptions: Parameters<ReturnType<typeof getResend>["emails"]["send"]>[0] = {
      from: process.env.FROM_EMAIL!,
      to: contact.email,
      subject: `【AI見積もり】${systemType}の概算見積もりが届きました`,
      html: buildEmailHtml(systemType, qa ?? [], est, contact),
    };
    if (process.env.TO_EMAIL) sendOptions.cc = process.env.TO_EMAIL;

    try {
      await getResend().emails.send(sendOptions);
    } catch (e) {
      console.error("[ERROR] Resend:", e);
      return NextResponse.json({ error: "メールの送信に失敗しました。アドレスをご確認ください。" }, { status: 500 });
    }
    console.log("[5] メール送信完了");

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[ERROR] 予期しないエラー:", error);
    return NextResponse.json(
      { error: "処理中にエラーが発生しました。しばらく時間をおいて再度お試しください。" },
      { status: 500 }
    );
  }
}
