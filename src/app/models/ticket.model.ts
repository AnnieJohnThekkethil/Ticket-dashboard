export type TicketStatus = 'Open' | 'In Progress' | 'Resolved' | 'Closed';

export type TicketPriority = 'Low' | 'Medium' | 'High' | 'Critical';

export interface TicketComment {
  author: string;
  message: string;
  timestamp: string;
}

export interface Ticket {
  id: number;
  title: string;
  description: string;
  status: TicketStatus;
  priority: TicketPriority;
  assignee: string;
  requester: string;
  createdAt: string;
  updatedAt: string;
  tags: string[];
  comments: TicketComment[];
}

export const TICKET_STATUSES: TicketStatus[] = [
  'Open',
  'In Progress',
  'Resolved',
  'Closed',
];
