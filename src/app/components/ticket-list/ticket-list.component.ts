import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap, startWith } from 'rxjs/operators';

import { Ticket, TicketStatus, TICKET_STATUSES } from '../../models/ticket.model';
import { TicketService } from '../../services/ticket.service';

@Component({
  selector: 'app-ticket-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './ticket-list.component.html',
  styleUrl: './ticket-list.component.scss',
})
export class TicketListComponent implements OnInit {
  tickets: Ticket[] = [];
  loading = true;

  searchTerm = '';
  selectedStatus: TicketStatus | 'All' = 'All';
  readonly statuses: (TicketStatus | 'All')[] = ['All', ...TICKET_STATUSES];

  private readonly query$ = new Subject<string>();

  constructor(private readonly ticketService: TicketService) {}

  ngOnInit(): void {
    this.query$
      .pipe(
        startWith(this.queryKey()),
        debounceTime(250),
        distinctUntilChanged(),
        switchMap(() => {
          this.loading = true;
          return this.ticketService.getTickets({
            search: this.searchTerm,
            status: this.selectedStatus,
          });
        })
      )
      .subscribe((tickets) => {
        this.tickets = tickets;
        this.loading = false;
      });
  }

  onFilterChange(): void {
    this.query$.next(this.queryKey());
  }

  private queryKey(): string {
    return `${this.selectedStatus}::${this.searchTerm.trim().toLowerCase()}`;
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.selectedStatus = 'All';
    this.onFilterChange();
  }

  statusClass(status: TicketStatus): string {
    return 'status-' + status.toLowerCase().replace(/\s+/g, '-');
  }

  priorityClass(priority: string): string {
    return 'priority-' + priority.toLowerCase();
  }

  trackById(_index: number, ticket: Ticket): number {
    return ticket.id;
  }
}
