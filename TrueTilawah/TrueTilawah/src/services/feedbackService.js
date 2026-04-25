import apiClient from './apiClient';

export const feedbackService = {
  // POST /api/sessions/:sessionId/feedback
  async logFeedback(sessionId, data) {
    const res = await apiClient.post(`/sessions/${sessionId}/feedback`, data);
    return res.data.data;
  },

  // POST /api/sessions/:sessionId/feedback/batch
  async logFeedbackBatch(sessionId, feedbacks) {
    const res = await apiClient.post(`/sessions/${sessionId}/feedback/batch`, { feedbacks });
    return res.data.data;
  },

  // GET /api/sessions/:sessionId/feedback
  async getSessionFeedback(sessionId) {
    const res = await apiClient.get(`/sessions/${sessionId}/feedback`);
    return res.data.data;
  },
};
