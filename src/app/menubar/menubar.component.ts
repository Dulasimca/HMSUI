import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';


@Component({
  selector: 'app-menubar',
  templateUrl: './menubar.component.html',
  styleUrls: ['./menubar.component.css']
})
export class MenubarComponent implements OnInit {
  items: MenuItem[];
  showNavBar: boolean;

  constructor() { }

  ngOnInit() {
    this.showNavBar = false;
    this.items = [
      { label: 'Home', icon: 'pi pi-fw pi-home', routerLink: '/home' },
      {
        label: 'Ticket', icon: 'pi pi-ticket',
        items: [
          { label: 'New Ticket', icon: '', routerLink: '/NewTicket' },
          { label: 'Update Ticket', routerLink: '/TicketUpdate' },
        ]
      },
      { label: 'Search', icon: 'pi pi-search', routerLink: '/SearchTicket' },
      {
        label: 'Profile', icon: 'pi pi-fw pi-comments',
        items: [
          {
            label: 'Change Password', routerLink: '/ChangePassword'
          },
        ]
      },
      {
        label: 'Report', icon: 'pi pi-fw pi-file',
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
        ]
      }
    ];
  }

}
