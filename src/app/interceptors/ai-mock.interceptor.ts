import { HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { delay } from 'rxjs/operators';

import { Ticket } from '../models/ticket.model';

/**
 * Mock AI backend. Intercepts HTTP calls to the `/api/ai/*` endpoints and
 * returns generated, context-aware responses with a realistic delay — so the
 * AI Assistant Panel talks to a real (mocked) HTTP API instead of calling
 * local methods directly. Swap this out for a real AI service and the
 * AiAssistantService stays unchanged.
 */
export const aiMockInterceptor: HttpInterceptorFn = (req, next) => {
  const AI_LATENCY = 700;

  if (!req.url.startsWith('/api/ai/') || req.method !== 'POST') {
    return next(req);
  }

  const body = (req.body ?? {}) as { ticket?: Ticket; question?: string };
  const ticket = body.ticket;

  if (!ticket) {
    return throwError(
      () => new Error('Mock AI API: "ticket" is required in the request body.')
    ) as Observable<never>;
  }

  let reply: string;
  switch (req.url) {
    case '/api/ai/summarize':
      reply = summarize(ticket);
      break;
    case '/api/ai/suggest-reply':
      reply = suggestReply(ticket);
      break;
    case '/api/ai/ask':
    default:
      reply = answer(ticket, body.question ?? '');
      break;
  }

  return of(new HttpResponse({ status: 200, body: { reply } })).pipe(
    delay(AI_LATENCY)
  );
};

function summarize(ticket: Ticket): string {
  return (
    `This ${ticket.priority.toLowerCase()}-priority ticket from ${ticket.requester} ` +
    `is currently "${ticket.status}". It concerns: ${ticket.title}. ` +
    `${ticket.comments.length} update(s) have been logged so far, ` +
    `and it is assigned to ${ticket.assignee}.`
  );
}

function suggestReply(ticket: Ticket): string {
  return (
    `Hi ${ticket.requester},\n\n` +
    `Thanks for reaching out about "${ticket.title}". ` +
    `We've logged this as ${ticket.priority.toLowerCase()} priority and ` +
    `${ticket.assignee} is looking into it. ` +
    `We'll keep you posted with the next update shortly.\n\n` +
    `Best regards,\nSupport Team`
  );
}

function answer(ticket: Ticket, question: string): string {
  const q = question.toLowerCase();

  if (q.includes('status') || q.includes('update')) {
    return `Ticket #${ticket.id} is currently "${ticket.status}" and assigned to ${ticket.assignee}. Last updated on ${new Date(
      ticket.updatedAt
    ).toLocaleDateString()}.`;
  }

  if (q.includes('priority') || q.includes('urgent')) {
    return `This ticket is marked as ${ticket.priority} priority. ${
      ticket.priority === 'Critical' || ticket.priority === 'High'
        ? 'It should be addressed promptly.'
        : 'It can be scheduled in the normal queue.'
    }`;
  }

  if (q.includes('summary') || q.includes('summarize') || q.includes('about')) {
    return `In short: ${ticket.title}. ${ticket.description}`;
  }

  if (q.includes('who') || q.includes('assignee') || q.includes('owner')) {
    return `${ticket.assignee} is responsible for this ticket, raised by ${ticket.requester}.`;
  }

  if (
    q.includes('next') ||
    q.includes('do') ||
    q.includes('action') ||
    q.includes('resolve')
  ) {
    return `Suggested next steps for #${ticket.id}: 1) Reproduce the issue, 2) Review related logs/components (${ticket.tags.join(
      ', '
    )}), 3) Apply a fix and notify ${ticket.requester}.`;
  }

  return `Regarding "${ticket.title}" (#${ticket.id}, ${ticket.status}): ${ticket.description} If you need a status update, suggested reply, or next steps, just ask.`;
}
