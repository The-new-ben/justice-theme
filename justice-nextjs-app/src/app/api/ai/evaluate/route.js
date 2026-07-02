import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const { details, caseType } = await req.json();

    if (!details || !caseType) {
      return NextResponse.json({ success: false, error: 'Missing details or caseType' }, { status: 400 });
    }

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({
        success: false,
        error: 'OPENAI_API_KEY is missing in environment variables. Please add it to .env.local'
      }, { status: 500 });
    }

    const systemPrompt = `You are an expert Israeli legal AI evaluator. Your job is to analyze the user's case description and provide an objective assessment. 
The case type is: ${caseType}.
You must respond in Hebrew in a JSON format containing the following fields:
1. "score": An integer from 0 to 100 representing the probability of a successful legal outcome.
2. "estValue": A string representing the estimated monetary value or outcome (e.g., "₪45,000 - ₪75,000" or "ייעוץ פלילי נדרש").
3. "analysisText": A concise 2-3 sentence legal analysis in Hebrew explaining the score and the primary legal grounds.
Respond ONLY with the JSON object.`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: details }
        ],
        response_format: { type: 'json_object' }
      })
    });

    const data = await response.json();

    if (data.error) {
      return NextResponse.json({ success: false, error: data.error.message }, { status: 500 });
    }

    const resultStr = data.choices[0].message.content;
    const parsedResult = JSON.parse(resultStr);

    return NextResponse.json({
      success: true,
      data: parsedResult
    });

  } catch (error) {
    console.error('OpenAI Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
