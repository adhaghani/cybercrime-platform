import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { prompt, temperature = 0.7, maxTokens = 2000, model = 'qwen/qwen3-1.7b' } = body;

    const requestBody = {
      model,
      messages: [
        {
          role: 'system',
          content: 'You are a data analyst assistant specialized in generating comprehensive campus safety reports. Provide detailed, structured analysis in JSON format.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature,
      max_tokens: maxTokens,
    };

    console.log('Proxying request to LM Studio:', requestBody);

    const response = await fetch('http://localhost:1234/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer lm-studio',
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('LM Studio error:', errorText);
      return NextResponse.json(
        { error: `LM Studio error: ${response.statusText}`, details: errorText },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log('LM Studio response received');

    return NextResponse.json({
      content: data.choices[0]?.message?.content || '',
      usage: {
        promptTokens: data.usage?.prompt_tokens || 0,
        completionTokens: data.usage?.completion_tokens || 0,
        totalTokens: data.usage?.total_tokens || 0,
      },
    });
  } catch (error) {
    console.error('API route error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to generate AI response', 
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
