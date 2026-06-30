import { TestBed } from '@angular/core/testing';
import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

import { aiMockInterceptor } from './ai-mock.interceptor';
import { Ticket } from '../models/ticket.model';

const SAMPLE_TICKET: Ticket = {
  id: 42,
  title: 'Payment webhook failing',
  description: 'Webhooks return 401.',
  status: 'In Progress',
  priority: 'Critical',
  assignee: 'Sam',
  requester: 'Globex',
  createdAt: '2026-06-01T00:00:00Z',
  updatedAt: '2026-06-05T00:00:00Z',
  tags: ['payments', 'webhooks'],
  comments: [],
};

interface AiResponse {
  reply: string;
}

describe('aiMockInterceptor (mock AI API)', () => {
  let http: HttpClient;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(withInterceptors([aiMockInterceptor]))],
    });
    http = TestBed.inject(HttpClient);
  });

  it('should answer a status question from the mock backend', async () => {
    const res = await firstValueFrom(
      http.post<AiResponse>('/api/ai/ask', {
        ticket: SAMPLE_TICKET,
        question: 'what is the status?',
      })
    );
    expect(res.reply).toContain('In Progress');
    expect(res.reply).toContain('#42');
  });

  it('should generate a summary mentioning the requester', async () => {
    const res = await firstValueFrom(
      http.post<AiResponse>('/api/ai/summarize', { ticket: SAMPLE_TICKET })
    );
    expect(res.reply).toContain('Globex');
  });

  it('should generate a suggested reply addressed to the requester', async () => {
    const res = await firstValueFrom(
      http.post<AiResponse>('/api/ai/suggest-reply', { ticket: SAMPLE_TICKET })
    );
    expect(res.reply).toContain('Globex');
  });
});
