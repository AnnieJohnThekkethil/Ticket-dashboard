import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';

import { Ticket, TicketStatus } from '../models/ticket.model';

export interface TicketQuery {
  search?: string;
  status?: TicketStatus | 'All';
}

/**
 * Talks to the tickets API over HTTP. The endpoint is served as a static JSON
 * resource here, but `apiUrl` can be pointed at any real REST backend that
 * returns the same Ticket[] shape without changing the rest of the app.
 */
@Injectable({ providedIn: 'root' })
export class TicketService {
  private readonly apiUrl = 'assets/tickets.json';

  /** Cache the in-flight/last response so we don't refetch on every keystroke. */
  private tickets$?: Observable<Ticket[]>;

  constructor(private readonly http: HttpClient) {}

  /** GET /api/tickets — fetched from the API, then filtered by search/status. */
  getTickets(query: TicketQuery = {}): Observable<Ticket[]> {
    const search = (query.search ?? '').trim().toLowerCase();
    const status = query.status ?? 'All';

    return this.fetchTickets().pipe(
      map((tickets) =>
        tickets.filter((ticket) => {
          const matchesStatus = status === 'All' || ticket.status === status;
          const matchesSearch =
            !search ||
            ticket.title.toLowerCase().includes(search) ||
            ticket.description.toLowerCase().includes(search) ||
            ticket.requester.toLowerCase().includes(search) ||
            ticket.assignee.toLowerCase().includes(search) ||
            String(ticket.id).includes(search) ||
            ticket.tags.some((tag) => tag.toLowerCase().includes(search));
          return matchesStatus && matchesSearch;
        })
      )
    );
  }

  /** GET /api/tickets/:id */
  getTicketById(id: number): Observable<Ticket | undefined> {
    return this.fetchTickets().pipe(
      map((tickets) => tickets.find((ticket) => ticket.id === id))
    );
  }

  private fetchTickets(): Observable<Ticket[]> {
    if (!this.tickets$) {
      this.tickets$ = this.http
        .get<Ticket[]>(this.apiUrl)
        .pipe(shareReplay({ bufferSize: 1, refCount: false }));
    }
    return this.tickets$;
  }
}
