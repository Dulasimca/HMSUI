import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomePageComponent } from './home-page/home-page.component';
import { LoginComponent } from './login/login.component';
import { NewTicketComponent } from './Ticket/new-ticket/new-ticket.component';
import { AuthGuard } from './services/auth.guard';
import { TicketReportComponent } from './reports/ticket-report/ticket-report.component';
import { MyTicketsComponent } from './my-tickets/my-tickets.component';
import { SearchTicketComponent } from './search-ticket/search-ticket.component';
import { TicketUpdateComponent } from './ticket-update/ticket-update.component';
import { ChangePasswordComponent } from './profiles/change-password/change-password.component';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'home', component: HomePageComponent, canActivate: [AuthGuard]},
  { path: 'MyTickets', component: MyTicketsComponent, canActivate: [AuthGuard] },
  { path: 'SearchTicket', component: SearchTicketComponent, canActivate: [AuthGuard] },
  { path: 'NewTicket', component: NewTicketComponent },
  { path: 'TicketReport', component: TicketReportComponent },
  { path: 'TicketUpdate', component: TicketUpdateComponent },
  { path: 'ChangePassword', component: ChangePasswordComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }
