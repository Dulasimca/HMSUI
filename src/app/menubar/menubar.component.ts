import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { AuthService } from '../services/auth.service';


@Component({
  selector: 'app-menubar',
  templateUrl: './menubar.component.html',
  styleUrls: ['./menubar.component.css']
})
export class MenubarComponent implements OnInit {
  items: MenuItem[];
  showNavBar: boolean;
  roleId: any;

  constructor(private authService: AuthService) { }

  ngOnInit() {
    this.showNavBar = false;
    this.roleId = this.authService.getLoggedUser().RoleId;
    const showMenu = true;
    this.items = [
      { label: 'Home', icon: 'pi pi-fw pi-home', routerLink: '/home' },
      {
        label: 'Ticket', icon: 'pi pi-ticket', visible: showMenu,
        items: [
          { label: 'New Ticket', icon: '', routerLink: '/NewTicket' },
          { label: 'Update Ticket', routerLink: '/TicketUpdate' },
          { label: 'Search', icon: '', routerLink: '/SearchTicket' },
        ]
      },
      {
        label: 'Request', icon: 'pi pi-file', visible: showMenu,
        items: [
          { label: 'Relocation', routerLink: '/RelocationForm' },
        ]
      },
      {
        label: 'Incident', icon: 'pi pi-file', visible: showMenu,
        items: [
          { label: 'Theft', routerLink: '/TheftForm' },
        ]
      },
      {
        label: 'Reports', icon: 'pi pi-fw pi-file', visible: showMenu,
        items: [
          {
            label: 'My Tickets', routerLink: '/MyTickets'
          },
          {
            label: 'All Tickets', routerLink: '/TicketReport'
          },
          {
            label: 'Tickets By Date', routerLink: '/TicketByDateReport'
          },
          {
            label: 'Theft', routerLink: '/TheftReport'
          },
          {
            label: 'Relocation', routerLink: '/RelocationReport'
          }
        ]
      },
      {
        label: 'User', icon: 'pi pi-fw pi-comments', visible: showMenu,
        items: [
          {
            label: 'User Profile', routerLink: 'UserProfile'
          },
          {
            label: 'Change Password', routerLink: '/ChangePassword'
          },
        ]
      }
    ];
  }

}
