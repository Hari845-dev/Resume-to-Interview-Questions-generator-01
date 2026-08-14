import { apiFetch } from './client';
import { AptitudeQuestion } from '../types';
import { SAMPLE_APTITUDE_QUESTIONS } from './mockData';

export const aptitudeApi = {
  async getAptitudeQuestions(category?: string, difficulty?: string): Promise<AptitudeQuestion[]> {
    try {
      const params = new URLSearchParams();
      if (category) params.append('category', category);
      if (difficulty) params.append('difficulty', difficulty);

      const query = params.toString() ? `?${params.toString()}` : '';
      const response = await apiFetch<AptitudeQuestion[]>(`/aptitude${query}`);
      return response;
    } catch (err: any) {
      if (err.status === 0 || err.status === 404 || err.status === 502) {
        console.warn('Backend unavailable, using structured aptitude question bank:', err.message);
        let list = [...SAMPLE_APTITUDE_QUESTIONS];
        if (category && category !== 'All') {
          list = list.filter(q => q.category.toLowerCase() === category.toLowerCase());
        }
        if (difficulty && difficulty !== 'All') {
          list = list.filter(q => q.difficulty.toLowerCase() === difficulty.toLowerCase());
        }
        return list;
      }
      throw err;
    }
  }
};
