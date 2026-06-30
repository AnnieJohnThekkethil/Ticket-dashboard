import { Routes } from '@angular/router';

import { TicketListComponent } from './components/ticket-list/ticket-list.component';
import { TicketDetailComponent } from './components/ticket-detail/ticket-detail.component';

export const routes: Routes = [
  { path: '', component: TicketListComponent, title: 'Ticket Dashboard' },
  {
    path: 'tickets/:id',
    component: TicketDetailComponent,
    title: 'Ticket Details',
  },
  { path: '**', redirectTo: '' },
];
