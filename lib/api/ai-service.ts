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
    this.model = config?.model || 'liquid/lfm2-1.2b';
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

DATA FORMAT LEGEND:
- Status: P=Pending, IP=InProgress, R=Resolved, RJ=Rejected
- Type: C=Crime, F=Facility
- Keys: tot=total, bySt=byStatus, rpts=reports, ttl=title, loc=location, st=status, typ=type, sub=submittedAt
- Dates: YYYYMMDD format (e.g., 20241215 = Dec 15, 2024)

PROCESSED DATA:
${JSON.stringify(processedData, null, 2)}

ANALYSIS REQUIREMENTS:
1. Executive Summary - Brief overview of key findings
2. Key Statistics and Trends - Highlight important metrics and patterns
3. Detailed Analysis - In-depth examination of the data
4. Risk Assessment - Evaluate security/safety risk level
5. Recommendations - Actionable suggestions for improvement
6. Conclusion - Final summary and outlook

CRITICAL INSTRUCTIONS:
- Return ONLY raw JSON, no markdown formatting
- Do NOT wrap your response in code blocks (no \`\`\`json or \`\`\`)
- Do NOT add any text before or after the JSON
- Start directly with { and end with }

RETURN THIS EXACT JSON FORMAT:
{
  "executiveSummary": "string",
  "keyStatistics": {
    "totalIncidents": number,
    "trends": "string",
    "comparisonToPrevious": "string"
  },
  "detailedAnalysis": "string",
  "riskAssessment": {
    "level": "LOW|MEDIUM|HIGH|CRITICAL",
    "factors": ["string", "string"]
  },
  "recommendations": ["string", "string"],
  "conclusion": "string"
}`;

    return basePrompt;
  }
}

// Export singleton instance
export const aiService = new AIService();
