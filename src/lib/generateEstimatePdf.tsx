import React from "react";
import {
  Document,
  Page,
  View,
  Text,
  StyleSheet,
  Font,
  pdf,
} from "@react-pdf/renderer";

// ============================================================
// 日本語フォント登録（jsDelivr CDN経由）
// ============================================================
Font.register({
  family: "NotoSansJP",
  fonts: [
    {
      src: "https://cdn.jsdelivr.net/npm/@fontsource/noto-sans-jp@5.0.12/files/noto-sans-jp-japanese-400-normal.woff",
      fontWeight: 400,
    },
    {
      src: "https://cdn.jsdelivr.net/npm/@fontsource/noto-sans-jp@5.0.12/files/noto-sans-jp-japanese-700-normal.woff",
      fontWeight: 700,
    },
  ],
});

// ============================================================
// 型定義
// ============================================================
export interface EstimateData {
  summary: string;
  totalMin: string;
  totalMax: string;
  deliveryPeriod: string;
  breakdown: { feature: string; hours: string; cost: string }[];
  totalHours: string;
  notes: string[];
}

interface PdfProps {
  systemType: string;
  estimate: EstimateData;
  contact: {
    name: string;
    company?: string;
    email: string;
    phone?: string;
  };
  date: string;
}

// ============================================================
// カラー定数
// ============================================================
const C = {
  teal: "#008080",
  tealLight: "#f0fafa",
  tealBorder: "#99d6d6",
  tealMid: "#c5e8e8",
  black: "#111827",
  gray: "#374151",
  muted: "#6b7280",
  border: "#e5e7eb",
  bg: "#f9fafb",
  white: "#ffffff",
};

// ============================================================
// スタイル
// ============================================================
const S = StyleSheet.create({
  // ── ページ共通 ──
  coverPage: {
    fontFamily: "NotoSansJP",
    backgroundColor: C.white,
    flexDirection: "column",
  },
  contentPage: {
    fontFamily: "NotoSansJP",
    backgroundColor: C.white,
    paddingTop: 36,
    paddingHorizontal: 44,
    paddingBottom: 50,
  },

  // ── 表紙 ──
  coverHeader: {
    backgroundColor: C.teal,
    paddingHorizontal: 44,
    paddingVertical: 40,
  },
  coverLogo: {
    fontSize: 24,
    fontWeight: 700,
    color: C.white,
    letterSpacing: 2,
  },
  coverSubLabel: {
    fontSize: 10,
    color: "rgba(255,255,255,0.65)",
    letterSpacing: 2,
    marginTop: 4,
  },
  coverBody: {
    paddingHorizontal: 44,
    paddingTop: 52,
    paddingBottom: 40,
    flex: 1,
  },
  coverMainTitle: {
    fontSize: 30,
    fontWeight: 700,
    color: C.black,
    marginBottom: 6,
  },
  coverType: {
    fontSize: 14,
    fontWeight: 700,
    color: C.teal,
    marginBottom: 36,
  },
  coverClientBorder: {
    borderLeftWidth: 3,
    borderLeftColor: C.teal,
    paddingLeft: 14,
    marginBottom: 28,
  },
  coverClientLabel: {
    fontSize: 8,
    color: C.muted,
    letterSpacing: 1.5,
    marginBottom: 4,
  },
  coverClientName: {
    fontSize: 20,
    fontWeight: 700,
    color: C.black,
  },
  coverClientCompany: {
    fontSize: 12,
    color: C.muted,
    marginTop: 3,
  },
  coverPriceBadge: {
    flexDirection: "row",
    gap: 40,
    marginTop: 8,
  },
  coverPriceLabel: {
    fontSize: 8,
    color: C.muted,
    letterSpacing: 1.5,
    marginBottom: 4,
  },
  coverPriceValue: {
    fontSize: 17,
    fontWeight: 700,
    color: C.teal,
  },
  coverDeliveryValue: {
    fontSize: 17,
    fontWeight: 700,
    color: C.black,
  },
  coverDate: {
    fontSize: 9,
    color: C.muted,
    marginTop: 36,
  },
  coverFooter: {
    paddingHorizontal: 44,
    paddingVertical: 18,
    borderTopWidth: 1,
    borderTopColor: C.border,
  },
  coverFooterText: {
    fontSize: 8,
    color: C.muted,
  },

  // ── ページヘッダー（2〜3ページ） ──
  pageHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: C.border,
  },
  pageHeaderLogo: {
    fontSize: 10,
    fontWeight: 700,
    color: C.teal,
    letterSpacing: 1,
  },
  pageHeaderDate: {
    fontSize: 9,
    color: C.muted,
  },

  // ── セクション ──
  sectionLabel: {
    fontSize: 8,
    fontWeight: 700,
    color: C.teal,
    letterSpacing: 2,
    marginBottom: 6,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 700,
    color: C.black,
    marginBottom: 16,
  },

  // ── サマリーボックス ──
  summaryBox: {
    backgroundColor: C.tealLight,
    borderRadius: 8,
    padding: 22,
    marginBottom: 22,
    borderWidth: 1.5,
    borderColor: C.tealBorder,
  },
  summaryPriceLabel: {
    fontSize: 8,
    fontWeight: 700,
    color: C.teal,
    letterSpacing: 1.5,
    marginBottom: 5,
  },
  summaryPrice: {
    fontSize: 26,
    fontWeight: 700,
    color: C.black,
    marginBottom: 4,
  },
  summaryMeta: {
    fontSize: 10,
    color: C.muted,
    marginBottom: 10,
  },
  summaryDivider: {
    borderTopWidth: 1,
    borderTopColor: C.tealMid,
    marginBottom: 10,
  },
  summaryText: {
    fontSize: 11,
    color: C.gray,
    lineHeight: 1.7,
  },

  // ── 内訳テーブル ──
  tableWrap: {
    marginBottom: 14,
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 6,
    overflow: "hidden",
  },
  tableHead: {
    flexDirection: "row",
    backgroundColor: C.teal,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  thFeature: { flex: 3, fontSize: 10, fontWeight: 700, color: C.white },
  thHours: {
    flex: 1.5,
    fontSize: 10,
    fontWeight: 700,
    color: C.white,
    textAlign: "center",
  },
  thCost: {
    flex: 2,
    fontSize: 10,
    fontWeight: 700,
    color: C.white,
    textAlign: "right",
  },
  tableRow: {
    flexDirection: "row",
    paddingVertical: 9,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: C.border,
  },
  tableRowAlt: { backgroundColor: C.bg },
  tdFeature: { flex: 3, fontSize: 11, color: C.black },
  tdHours: { flex: 1.5, fontSize: 11, color: C.black, textAlign: "center" },
  tdCost: { flex: 2, fontSize: 11, fontWeight: 700, color: C.black, textAlign: "right" },

  // ── 合計 ──
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: C.bg,
    borderRadius: 6,
    paddingVertical: 12,
    paddingHorizontal: 14,
    marginBottom: 20,
  },
  totalLeft: { flexDirection: "column" },
  totalHoursText: { fontSize: 10, color: C.muted, marginBottom: 2 },
  totalLabel: { fontSize: 13, fontWeight: 700, color: C.black },
  totalAmount: { fontSize: 14, fontWeight: 700, color: C.teal },

  // ── 備考 ──
  noteRow: { flexDirection: "row", marginBottom: 7, alignItems: "flex-start" },
  noteBullet: { fontSize: 11, color: C.teal, marginRight: 6 },
  noteText: { fontSize: 11, color: C.gray, lineHeight: 1.65, flex: 1 },

  // ── 次のステップ ──
  nextBox: {
    backgroundColor: C.bg,
    borderRadius: 8,
    padding: 18,
    marginTop: 18,
    borderWidth: 1,
    borderColor: C.border,
  },
  nextTitle: {
    fontSize: 12,
    fontWeight: 700,
    color: C.black,
    marginBottom: 6,
  },
  nextText: { fontSize: 11, color: C.muted, lineHeight: 1.65 },

  // ── フッター（固定） ──
  footer: {
    position: "absolute",
    bottom: 18,
    left: 44,
    right: 44,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  footerText: { fontSize: 8, color: "#d1d5db" },

  // ── 免責 ──
  disclaimer: {
    fontSize: 8,
    color: "#9ca3af",
    lineHeight: 1.55,
    textAlign: "center",
    marginTop: 14,
    paddingHorizontal: 8,
  },
});

// ============================================================
// 固定フッター
// ============================================================
function Footer({ date }: { date: string }) {
  return (
    <View style={S.footer} fixed>
      <Text style={S.footerText}>Hotokaze AI概算見積もり</Text>
      <Text style={S.footerText}>{date}</Text>
    </View>
  );
}

// ============================================================
// PDFドキュメント本体
// ============================================================
export function EstimatePdfDocument({ systemType, estimate, contact, date }: PdfProps) {
  return (
    <Document>

      {/* ===== 表紙 ===== */}
      <Page size="A4" style={S.coverPage}>
        <View style={S.coverHeader}>
          <Text style={S.coverLogo}>Hotokaze</Text>
          <Text style={S.coverSubLabel}>AI ESTIMATE</Text>
        </View>

        <View style={S.coverBody}>
          <Text style={S.coverMainTitle}>AI概算見積もり</Text>
          <Text style={S.coverType}>{systemType}</Text>

          <View style={S.coverClientBorder}>
            <Text style={S.coverClientLabel}>宛先</Text>
            <Text style={S.coverClientName}>{contact.name} 様</Text>
            {contact.company ? (
              <Text style={S.coverClientCompany}>{contact.company}</Text>
            ) : null}
          </View>

          <View style={S.coverPriceBadge}>
            <View>
              <Text style={S.coverPriceLabel}>概算金額</Text>
              <Text style={S.coverPriceValue}>
                {estimate.totalMin} 〜 {estimate.totalMax}
              </Text>
            </View>
            <View>
              <Text style={S.coverPriceLabel}>納期目安</Text>
              <Text style={S.coverDeliveryValue}>{estimate.deliveryPeriod}</Text>
            </View>
          </View>

          <Text style={S.coverDate}>発行日：{date}</Text>
        </View>

        <View style={S.coverFooter}>
          <Text style={S.coverFooterText}>
            ※ 本資料はAIによる参考見積もりです。正式なお見積もりは別途ご提案いたします。
          </Text>
        </View>
      </Page>

      {/* ===== 見積もり内訳ページ ===== */}
      <Page size="A4" style={S.contentPage}>
        <View style={S.pageHeader} fixed>
          <Text style={S.pageHeaderLogo}>HOTOKAZE</Text>
          <Text style={S.pageHeaderDate}>{date}</Text>
        </View>

        {/* サマリー */}
        <Text style={S.sectionLabel}>概算見積もり</Text>
        <View style={S.summaryBox}>
          <Text style={S.summaryPriceLabel}>概算金額（税抜）</Text>
          <Text style={S.summaryPrice}>
            {estimate.totalMin} 〜 {estimate.totalMax}
          </Text>
          <Text style={S.summaryMeta}>
            納期目安：{estimate.deliveryPeriod}　／　合計工数：{estimate.totalHours}
          </Text>
          <View style={S.summaryDivider} />
          <Text style={S.summaryText}>{estimate.summary}</Text>
        </View>

        {/* 内訳テーブル */}
        <Text style={[S.sectionLabel, { marginTop: 4 }]}>見積もり内訳</Text>
        <View style={S.tableWrap}>
          <View style={S.tableHead}>
            <Text style={S.thFeature}>項目</Text>
            <Text style={S.thHours}>工数</Text>
            <Text style={S.thCost}>費用（概算）</Text>
          </View>
          {estimate.breakdown.map((row, i) => (
            <View key={i} style={[S.tableRow, i % 2 !== 0 ? S.tableRowAlt : {}]}>
              <Text style={S.tdFeature}>{row.feature}</Text>
              <Text style={S.tdHours}>{row.hours}</Text>
              <Text style={S.tdCost}>{row.cost}</Text>
            </View>
          ))}
        </View>

        {/* 合計 */}
        <View style={S.totalRow}>
          <View style={S.totalLeft}>
            <Text style={S.totalHoursText}>合計工数：{estimate.totalHours}</Text>
            <Text style={S.totalLabel}>合計金額（税抜）</Text>
          </View>
          <Text style={S.totalAmount}>
            {estimate.totalMin} 〜 {estimate.totalMax}
          </Text>
        </View>

        <Footer date={date} />
      </Page>

      {/* ===== 備考・次のステップ ===== */}
      <Page size="A4" style={S.contentPage}>
        <View style={S.pageHeader} fixed>
          <Text style={S.pageHeaderLogo}>HOTOKAZE</Text>
          <Text style={S.pageHeaderDate}>{date}</Text>
        </View>

        <Text style={S.sectionLabel}>備考・前提条件</Text>
        <Text style={[S.sectionTitle, { fontSize: 14, marginBottom: 14 }]}>
          前提条件・ご確認事項
        </Text>
        <View style={{ marginBottom: 24 }}>
          {estimate.notes.map((note, i) => (
            <View key={i} style={S.noteRow}>
              <Text style={S.noteBullet}>・</Text>
              <Text style={S.noteText}>{note}</Text>
            </View>
          ))}
        </View>

        <Text style={S.sectionLabel}>次のステップ</Text>
        <View style={S.nextBox}>
          <Text style={S.nextTitle}>無料相談のご案内</Text>
          <Text style={S.nextText}>
            上記はAIによる概算見積もりです。より正確な金額・スケジュールは、
            詳細なヒアリングの上でご提案いたします。{"\n"}
            まずはお気軽に初回無料相談（60分）をご活用ください。
          </Text>
        </View>

        <Text style={S.disclaimer}>
          ※ 本資料はAIが自動生成した参考値であり、正式な見積書ではありません。{"\n"}
          ※ 実際の費用は詳細要件・デザイン・コンテンツ量・機能仕様等によって変動します。
        </Text>

        <Footer date={date} />
      </Page>
    </Document>
  );
}

// ============================================================
// PDF Buffer生成ヘルパー
// ============================================================
export async function generateEstimatePdf(
  systemType: string,
  estimate: EstimateData,
  contact: { name: string; company?: string; email: string; phone?: string },
  date: string
): Promise<Buffer> {
  const element = React.createElement(EstimatePdfDocument, {
    systemType,
    estimate,
    contact,
    date,
  });

  // toBuffer() の戻り値は環境によって Buffer or ReadableStream になるため両方対応
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const result = await (pdf as any)(element).toBuffer();

  if (Buffer.isBuffer(result)) return result;

  // ReadableStream の場合はチャンクを結合してBufferに変換
  const chunks: Uint8Array[] = [];
  for await (const chunk of result as AsyncIterable<Uint8Array>) {
    chunks.push(chunk);
  }
  return Buffer.concat(chunks);
}
