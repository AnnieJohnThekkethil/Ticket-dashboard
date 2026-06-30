import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { Ticket } from '../../models/ticket.model';
import { AiAssistantService, AiMessage } from '../../services/ai-assistant.service';

@Component({
  selector: 'app-ai-assistant',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './ai-assistant.component.html',
  styleUrl: './ai-assistant.component.scss',
})
export class AiAssistantComponent {
  @Input({ required: true }) ticket!: Ticket;

  messages: AiMessage[] = [];
  question = '';
  thinking = false;

  readonly quickPrompts = [
    'Summarize this ticket',
    'What are the next steps?',
    'Suggest a reply',
  ];

  constructor(private readonly ai: AiAssistantService) {}

  send(text?: string): void {
    const content = (text ?? this.question).trim();
    if (!content || this.thinking) {
      return;
    }

    this.messages.push({ role: 'user', content });
    this.question = '';
    this.thinking = true;

    const lower = content.toLowerCase();
    const request$ = lower.includes('suggest a reply')
      ? this.ai.suggestReply(this.ticket)
      : lower.includes('summarize')
      ? this.ai.summarize(this.ticket)
      : this.ai.ask(this.ticket, content);

    request$.subscribe((reply) => {
      this.messages.push({ role: 'assistant', content: reply });
      this.thinking = false;
    });
  }

  clear(): void {
    this.messages = [];
  }
}
