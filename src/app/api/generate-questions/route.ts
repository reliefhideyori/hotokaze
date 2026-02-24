import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

const getGenAI = () => new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

export async function POST(req: NextRequest) {
  try {
    const { overview } = await req.json();

    if (!overview) {
      return NextResponse.json({ error: "入力が不足しています。" }, { status: 400 });
    }

    const prompt = `あなたはシステム開発会社の見積もり担当者です。
以下の情報をもとに、正確な見積もりを作成するために必要な追加情報を収集する質問リストをJSON形式で生成してください。

システム概要: ${overview}

【質問作成のルール】
- 見積もりに直接必要な情報に絞る（機能の詳細・規模感・納期・予算感・ユーザー数など）
- 概要から読み取れる情報は聞かない
- 各質問にtypeを設定する: "text"（自由記述）または "select"（選択肢）
- selectの場合は選択肢を3〜5個用意する
- 質問数は概要の明確さに応じて自動調整する

【出力形式】JSONのみを出力すること（説明文は不要）:
[
  {
    "question": "質問文",
    "type": "text",
    "options": null
  },
  {
    "question": "質問文",
    "type": "select",
    "options": ["選択肢1", "選択肢2", "選択肢3"]
  }
]`;

    const result = await getGenAI().models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt,
    });

    const text = result.text ?? "";
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (!jsonMatch) throw new Error("質問の生成に失敗しました。");

    const questions = JSON.parse(jsonMatch[0]);

    return NextResponse.json({ questions });
  } catch (error) {
    console.error("Error generating questions:", error);
    return NextResponse.json(
      { error: "質問の生成中にエラーが発生しました。" },
      { status: 500 }
    );
  }
}
