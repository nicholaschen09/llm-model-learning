import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const { question } = await req.json();
    if (!question) {
        return NextResponse.json({ error: "No question provided." }, { status: 400 });
    }

    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
    const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent";

    const HINT_PROMPT = `
You are a helpful assistant. When given a question, you must never provide the direct answer. Instead, give only hints, clues, or guiding questions that help the user figure out the answer themselves. Do not reveal the answer directly.

Question: ${question}
`;

    try {
        const geminiRes = await fetch(
            `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: HINT_PROMPT }] }],
                }),
            }
        );
        if (!geminiRes.ok) {
            const text = await geminiRes.text();
            return NextResponse.json({ error: "Failed to get response from Gemini API.", details: text }, { status: 500 });
        }
        const geminiData = await geminiRes.json();
        const hint =
            geminiData?.candidates?.[0]?.content?.parts?.[0]?.text ||
            "(No hint received)";
        return NextResponse.json({ hint });
    } catch (e: any) {
        return NextResponse.json({ error: "Error contacting Gemini API.", details: e.message }, { status: 500 });
    }
} 