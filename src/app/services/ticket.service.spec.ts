import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { firstValueFrom } from 'rxjs';

import { TicketService } from './ticket.service';
import { Ticket } from '../models/ticket.model';

const API_URL = 'assets/tickets.json';

const MOCK_RESPONSE: Ticket[] = [
  {
    id: 1001,
    title: 'Login page returns 500 error on submit',
    description: 'Users report a 500 error on login.',
    status: 'Open',
    priority: 'Critical',
    assignee: 'Priya Sharma',
    requester: 'Acme Corp',
    createdAt: '2026-06-21T09:14:00Z',
    updatedAt: '2026-06-28T11:02:00Z',
    tags: ['auth', 'backend'],
    comments: [],
  },
  {
    id: 1002,
    title: 'Dashboard charts not loading on Safari',
    description: 'Charts appear blank on Safari 17.',
    status: 'In Progress',
    priority: 'High',
    assignee: 'Liam Chen',
    requester: 'Globex',
    createdAt: '2026-06-19T16:40:00Z',
    updatedAt: '2026-06-27T08:30:00Z',
    tags: ['frontend', 'safari'],
    comments: [],
  },
];

describe('TicketService', () => {
  let service: TicketService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(TicketService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch all tickets from the API', async () => {
    const promise = firstValueFrom(service.getTickets());
    httpMock.expectOne(API_URL).flush(MOCK_RESPONSE);
    const tickets = await promise;
    expect(tickets.length).toBe(2);
  });

  it('should filter tickets by status', async () => {
    const promise = firstValueFrom(service.getTickets({ status: 'Open' }));
    httpMock.expectOne(API_URL).flush(MOCK_RESPONSE);
    const tickets = await promise;
    expect(tickets.every((t) => t.status === 'Open')).toBeTrue();
  });

  it('should search tickets by text', async () => {
    const promise = firstValueFrom(service.getTickets({ search: 'safari' }));
    httpMock.expectOne(API_URL).flush(MOCK_RESPONSE);
    const tickets = await promise;
    expect(tickets.length).toBe(1);
    expect(tickets[0].id).toBe(1002);
  });

  it('should return a ticket by id', async () => {
    const promise = firstValueFrom(service.getTicketById(1001));
    httpMock.expectOne(API_URL).flush(MOCK_RESPONSE);
    const ticket = await promise;
    expect(ticket?.id).toBe(1001);
  });

  it('should return undefined for an unknown id', async () => {
    const promise = firstValueFrom(service.getTicketById(999999));
    httpMock.expectOne(API_URL).flush(MOCK_RESPONSE);
    const ticket = await promise;
    expect(ticket).toBeUndefined();
  });
});
