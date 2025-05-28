import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    let query: string | undefined = undefined;
    try {
        const body = await request.json();
        query = body.query;

        if (!query) {
            return NextResponse.json({ error: 'Query is required' }, { status: 400 });
        }

        const geminiApiKey = process.env.GEMINI_API_KEY;
        if (!geminiApiKey) {
            return NextResponse.json({ error: 'Missing Gemini API key' }, { status: 500 });
        }

        const geminiEndpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${geminiApiKey}`;

        const geminiBody = {
            contents: [
                {
                    role: "user",
                    parts: [
                        { text: query }
                    ]
                }
            ]
        };

        const response = await fetch(geminiEndpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(geminiBody),
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Gemini API error details:', errorData, 'Status:', response.status, 'Query:', query);
            throw new Error(`Gemini API error: ${response.statusText}`);
        }

        const data = await response.json();
        const aiText = data.candidates?.[0]?.content?.parts?.[0]?.text || "Sorry, I couldn't generate a response.";
        return NextResponse.json({ response: aiText });
    } catch (error) {
        console.error('Error in AI route:', error, 'Query:', typeof query !== 'undefined' ? query : 'N/A');
        if (error instanceof Error) {
            console.error('Stack trace:', error.stack);
            return NextResponse.json(
                { error: 'Failed to generate AI response', details: error.message },
                { status: 500 }
            );
        } else {
            return NextResponse.json(
                { error: 'Failed to generate AI response', details: String(error) },
                { status: 500 }
            );
        }
    }
} 