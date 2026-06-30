import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { switchMap } from 'rxjs/operators';

import { Ticket, TicketStatus } from '../../models/ticket.model';
import { TicketService } from '../../services/ticket.service';
import { AiAssistantComponent } from '../ai-assistant/ai-assistant.component';

@Component({
  selector: 'app-ticket-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    AiAssistantComponent,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatDividerModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './ticket-detail.component.html',
  styleUrl: './ticket-detail.component.scss',
})
export class TicketDetailComponent implements OnInit {
  ticket?: Ticket;
  loading = true;
  notFound = false;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly ticketService: TicketService
  ) {}

  ngOnInit(): void {
    this.route.paramMap
      .pipe(
        switchMap((params) => {
          this.loading = true;
          this.notFound = false;
          const id = Number(params.get('id'));
          return this.ticketService.getTicketById(id);
        })
      )
      .subscribe((ticket) => {
        this.ticket = ticket;
        this.notFound = !ticket;
        this.loading = false;
      });
  }

  statusClass(status: TicketStatus): string {
    return 'status-' + status.toLowerCase().replace(/\s+/g, '-');
  }

  priorityClass(priority: string): string {
    return 'priority-' + priority.toLowerCase();
  }
}
