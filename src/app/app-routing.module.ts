import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomePageComponent } from './home-page/home-page.component';
import { LoginComponent } from './login/login.component';
import { NewTicketComponent } from './Ticket/new-ticket/new-ticket.component';
import { AuthGuard } from './services/auth.guard';
import { TicketReportComponent } from './reports/ticket-report/ticket-report.component';
import { MyTicketsComponent } from './reports/my-tickets/my-tickets.component';
import { SearchTicketComponent } from './search-ticket/search-ticket.component';
import { TicketUpdateComponent } from './ticket-update/ticket-update.component';
import { ChangePasswordComponent } from './profiles/change-password/change-password.component';
import { TicketReportBydateComponent } from './reports/ticket-report-bydate/ticket-report-bydate.component';
import { BugzillaReportComponent } from './reports/bugzilla-report/bugzilla-report.component';
import { AllTicketsReportComponent } from './reports/all-tickets-report/all-tickets-report.component';
import { RelocationFormComponent } from './relocation-form/relocation-form.component';
import { TheftFormComponent } from './theft-form/theft-form.component';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent, canActivate: [AuthGuard] },
  { path: 'home', component: HomePageComponent, canActivate: [AuthGuard] },
  { path: 'Bugzilla', component: BugzillaReportComponent, canActivate: [AuthGuard] },
  { path: 'MyTickets', component: MyTicketsComponent, canActivate: [AuthGuard] },
  { path: 'SearchTicket', component: SearchTicketComponent, canActivate: [AuthGuard] },
  { path: 'NewTicket', component: NewTicketComponent, canActivate: [AuthGuard] },
  { path: 'TicketReport', component: TicketReportComponent, canActivate: [AuthGuard] },
  { path: 'TicketUpdate', component: TicketUpdateComponent, canActivate: [AuthGuard] },
  { path: 'ChangePassword', component: ChangePasswordComponent, canActivate: [AuthGuard] },
  { path: 'TicketByDateReport', component: TicketReportBydateComponent, canActivate: [AuthGuard] },
  { path: 'AllTicketsReport', component: AllTicketsReportComponent, canActivate: [AuthGuard] },
  { path: 'RelocationForm', component: RelocationFormComponent, canActivate: [AuthGuard] },
  { path: 'TheftForm', component: TheftFormComponent, canActivate: [AuthGuard] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }
