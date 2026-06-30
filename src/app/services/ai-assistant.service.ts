import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Ticket } from '../models/ticket.model';

export interface AiMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface AiResponse {
  reply: string;
}

/**
 * Client for the AI assistant mock API. Calls the `/api/ai/*` HTTP endpoints,
 * which are served by the aiMockInterceptor (the mock backend). Point these
 * URLs at a real AI service and nothing else needs to change.
 */
@Injectable({ providedIn: 'root' })
export class AiAssistantService {
  private readonly baseUrl = '/api/ai';

  constructor(private readonly http: HttpClient) {}

  /** POST /api/ai/ask */
  ask(ticket: Ticket, question: string): Observable<string> {
    return this.http
      .post<AiResponse>(`${this.baseUrl}/ask`, { ticket, question })
      .pipe(map((res) => res.reply));
  }

  /** POST /api/ai/summarize */
  summarize(ticket: Ticket): Observable<string> {
    return this.http
      .post<AiResponse>(`${this.baseUrl}/summarize`, { ticket })
      .pipe(map((res) => res.reply));
  }

  /** POST /api/ai/suggest-reply */
  suggestReply(ticket: Ticket): Observable<string> {
    return this.http
      .post<AiResponse>(`${this.baseUrl}/suggest-reply`, { ticket })
      .pipe(map((res) => res.reply));
  }
}
