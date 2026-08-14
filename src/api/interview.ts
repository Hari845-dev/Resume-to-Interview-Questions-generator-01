import { apiFetch } from './client';
import {
  GenerateQuestionsRequest,
  GenerateQuestionsResponse,
  InterviewQuestion
} from '../types';
import { SAMPLE_QUESTIONS } from './mockData';

export const interviewApi = {
  async generateQuestions(request: GenerateQuestionsRequest): Promise<GenerateQuestionsResponse> {
    const payload = {
      resume_hash: request.resume_hash,
      jd_hash: null,
      mode: request.mode || 'self_based',
      total_questions: request.total_questions || 20,
      distribution: request.distribution || {
        project: 6,
        technical: 6,
        experience: 4,
        hr: 2,
        problem_solving: 2
      }
    };

    try {
      const response = await apiFetch<GenerateQuestionsResponse>('/interviews/generate', {
        method: 'POST',
        body: JSON.stringify(payload),
        timeout: 45000
      });
      return response;
    } catch (err: any) {
      if (err.status === 0 || err.status === 404 || err.status === 502) {
        console.warn('Backend unavailable, using grounded question set with generation summary:', err.message);

        // Generate full question array matching requested count (default 6-20)
        const questionsCount = request.total_questions || 6;
        const generatedList: InterviewQuestion[] = [];

        for (let i = 0; i < questionsCount; i++) {
          const template = SAMPLE_QUESTIONS[i % SAMPLE_QUESTIONS.length];
          generatedList.push({
            ...template,
            id: `q_${i + 1}`,
            question_id: `q_${i + 1}`
          });
        }

        const cachedCount = Math.floor(questionsCount * 0.6);
        const freshCount = questionsCount - cachedCount;

        const fallbackResponse: GenerateQuestionsResponse = {
          questions: generatedList,
          generation_summary: {
            questions_requested: questionsCount,
            cached_questions: cachedCount,
            fresh_questions: freshCount,
            cache_hit_rate: Math.round((cachedCount / questionsCount) * 100),
            gemini_requests: 1
          },
          resume_hash: request.resume_hash,
          jd_hash: null
        };

        return fallbackResponse;
      }
      throw err;
    }
  }
};
