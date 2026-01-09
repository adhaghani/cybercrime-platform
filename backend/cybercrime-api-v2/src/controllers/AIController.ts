/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from 'express';
import { Logger } from '../utils/Logger';

const logger = new Logger('AIController');

export class AIController {
  /**
   * POST /api/v2/ai/generate
   * Proxy to LM Studio for AI generation
   */
  generate = async (req: Request, res: Response): Promise<void> => {
    try {
      const { prompt, temperature = 0.7, maxTokens = 4096, model = 'liquid/lfm-1.2b' } = req.body;

      if (!prompt) {
        res.status(400).json({ error: 'Prompt is required' });
        return;
      }

      logger.info(`AI generation request with model: ${model}`);

      // LM Studio local endpoint
      const lmStudioUrl = process.env.LM_STUDIO_URL || 'http://localhost:1234/v1/chat/completions';

      // Make request to LM Studio
      const response = await fetch(lmStudioUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer lm-studio', // LM Studio doesn't require real API key
        },
        body: JSON.stringify({
          model,
          messages: [
            {
              role: 'user',
              content: prompt,
            },
          ],
          temperature,
          max_tokens: maxTokens,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        logger.error('LM Studio error:', errorData);
        res.status(response.status).json({
          error: 'AI generation failed',
          details: errorData,
        });
        return;
      }

      const data: any = await response.json();
      const content = data.choices?.[0]?.message?.content || '';

      logger.info('AI generation completed successfully');

      res.json({
        content,
        usage: {
          promptTokens: data.usage?.prompt_tokens || 0,
          completionTokens: data.usage?.completion_tokens || 0,
          totalTokens: data.usage?.total_tokens || 0,
        },
      });
    } catch (error) {
      logger.error('AI generation error:', error);
      res.status(500).json({
        error: 'Failed to generate AI response',
        details: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  };
}
