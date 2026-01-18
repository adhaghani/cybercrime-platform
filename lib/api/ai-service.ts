/* eslint-disable @typescript-eslint/no-explicit-any */
import { prepareDataForAI, compactDate } from '../process';

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
    this.model = config?.model || 'google/gemma-3-1b';
  }

  /**
   * Strip markdown code blocks from AI response
   */
  private stripMarkdownCodeBlocks(content: string): string {

    let cleaned = content.trim();

    if (cleaned.startsWith('```')) {

      cleaned = cleaned.replace(/^```(?:json|JSON)?[\s\n\r]*/, '');

      cleaned = cleaned.replace(/[\s\n\r]*```\s*$/, '');
    }
    
    return cleaned.trim();
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
          temperature: request.temperature || 0.0,
          maxTokens: request.maxTokens || 16000,
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

      // Strip markdown code blocks if present
      const cleanedContent = this.stripMarkdownCodeBlocks(data.content || '');

      return {
        content: cleanedContent,
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
   * Build prompt for report generation with optimized data
   */
  buildReportPrompt(params: {
    category: string;
    dataType: string;
    dateRangeStart: string;
    dateRangeEnd: string;
    reportData: any;
  }): string {
    const { category, dataType, dateRangeStart, dateRangeEnd, reportData } = params;

    // Process data for AI to reduce token usage
    const processedData = prepareDataForAI(reportData, {
      includeDescription: dataType === 'DETAILED',
      maxDescriptionLength: dataType === 'SUMMARY' ? 50 : 150,
      logSavings: true, // Log token savings to console
    });

    // Compact dates for the date range
    const startCompact = compactDate(dateRangeStart);
    const endCompact = compactDate(dateRangeEnd);

    const basePrompt = `Generate a ${dataType.toLowerCase()} ${category.toLowerCase()} report for the period from ${startCompact} to ${endCompact}.

PROCESSED DATA:
${JSON.stringify(processedData, null, 2)}`;

    return basePrompt;
  }
}

// Export singleton instance
export const aiService = new AIService();
