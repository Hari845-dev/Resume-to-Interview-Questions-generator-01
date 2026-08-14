import { apiFetch } from './client';
import { DashboardMetrics } from '../types';
import { SAMPLE_DASHBOARD_METRICS } from './mockData';

export const dashboardApi = {
  async getDashboardMetrics(): Promise<DashboardMetrics> {
    try {
      const response = await apiFetch<DashboardMetrics>('/dashboard');
      return response;
    } catch (err: any) {
      if (err.status === 0 || err.status === 404 || err.status === 502) {
        console.warn('Backend unavailable, providing dashboard telemetry fallback:', err.message);
        return SAMPLE_DASHBOARD_METRICS;
      }
      throw err;
    }
  }
};
