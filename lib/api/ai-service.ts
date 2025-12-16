/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * AI Service for LM Studio Integration
 * Uses OpenAI-Compatible endpoints
 */

export interface AIGenerateRequest {
  prompt: string;
  temperature?: number;
  maxTokens?: number;
  model?: string;
}

export interface AIGenerateResponse {
  content: string;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

export class AIService {
  private baseUrl: string;
  private apiKey: string;
  private model: string;

  constructor(config?: {
    baseUrl?: string;
    apiKey?: string;
    model?: string;
  }) {
    // Default to LM Studio local endpoint
    this.baseUrl = config?.baseUrl || 'http://localhost:1234/v1';
    this.apiKey = config?.apiKey || 'lm-studio'; // LM Studio doesn't require real API key
    this.model = config?.model || 'qwen/qwen3-1.7b';
  }

  /**
   * Generate report data using AI
   */
  async generateReportData(request: AIGenerateRequest): Promise<AIGenerateResponse> {
    try {
      // Use Next.js API route as proxy to avoid CORS issues
      const response = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: request.prompt,
          temperature: request.temperature || 0.7,
          maxTokens: request.maxTokens || 4096,
          model: request.model || this.model,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('AI service error response:', errorData);
        throw new Error(errorData.error || `AI service error: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('AI service response received');

      return {
        content: data.content || '',
        usage: data.usage || {
          promptTokens: 0,
          completionTokens: 0,
          totalTokens: 0,
        },
      };
    } catch (error) {
      console.error('AI generation error:', error);
      throw error;
    }
  }

  /**
   * Build prompt for report generation
   */
  buildReportPrompt(params: {
    category: string;
    dataType: string;
    dateRangeStart: string;
    dateRangeEnd: string;
    reportData: any;
  }): string {
    const { category, dataType, dateRangeStart, dateRangeEnd, reportData } = params;

    const basePrompt = `Generate a ${dataType.toLowerCase()} ${category.toLowerCase()} report for the period from ${dateRangeStart} to ${dateRangeEnd}.

Based on the following data:
${JSON.stringify(reportData, null, 2)}

Provide a comprehensive analysis including:
1. Executive Summary
2. Key Statistics and Trends
3. Detailed Analysis
4. Risk Assessment
5. Recommendations
6. Conclusion

Return the response in the following JSON format:
{
  "executiveSummary": "...",
  "keyStatistics": {
    "totalIncidents": number,
    "trends": "...",
    "comparisonToPrevious": "..."
  },
  "detailedAnalysis": "...",
  "riskAssessment": {
    "level": "LOW|MEDIUM|HIGH|CRITICAL",
    "factors": ["..."]
  },
  "recommendations": ["..."],
  "conclusion": "..."
}`;

    return basePrompt;
  }
}

// Export singleton instance
export const aiService = new AIService();
