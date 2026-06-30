import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { firstValueFrom } from 'rxjs';

import { AiAssistantService } from './ai-assistant.service';
import { Ticket } from '../models/ticket.model';

const SAMPLE_TICKET: Ticket = {
  id: 1,
  title: 'Sample issue',
  description: 'Something is broken.',
  status: 'Open',
  priority: 'High',
  assignee: 'Alex',
  requester: 'Customer A',
  createdAt: '2026-06-01T00:00:00Z',
  updatedAt: '2026-06-02T00:00:00Z',
  tags: ['bug'],
  comments: [],
};

describe('AiAssistantService', () => {
  let service: AiAssistantService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(AiAssistantService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should POST a question to the ask endpoint and return the reply', async () => {
    const promise = firstValueFrom(service.ask(SAMPLE_TICKET, 'what is the status?'));
    const req = httpMock.expectOne('/api/ai/ask');
    expect(req.request.method).toBe('POST');
    expect(req.request.body.question).toBe('what is the status?');
    req.flush({ reply: 'Ticket #1 is currently "Open".' });
    expect(await promise).toContain('Open');
  });

  it('should POST to the summarize endpoint', async () => {
    const promise = firstValueFrom(service.summarize(SAMPLE_TICKET));
    const req = httpMock.expectOne('/api/ai/summarize');
    expect(req.request.method).toBe('POST');
    req.flush({ reply: 'Summary for Customer A.' });
    expect(await promise).toContain('Customer A');
  });

  it('should POST to the suggest-reply endpoint', async () => {
    const promise = firstValueFrom(service.suggestReply(SAMPLE_TICKET));
    const req = httpMock.expectOne('/api/ai/suggest-reply');
    expect(req.request.method).toBe('POST');
    req.flush({ reply: 'Hi Customer A, thanks for reaching out.' });
    expect(await promise).toContain('Customer A');
  });
});
