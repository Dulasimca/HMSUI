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
        label: 'Ticket', icon: 'pi pi-fw pi-file',
        items: [
          {
            label: 'New Ticket', routerLink: '/NewTicket'
          },
          {
            label: 'Update Ticket', routerLink: '/TicketUpdate'
          }
        ]
      },
      { label: 'Browse', icon: 'pi pi-fw pi-comments', routerLink: '/' },
      { label: 'Search', icon: 'pi pi-fw pi-chart-line' },
      {
        label: 'Report', icon: 'pi pi-fw pi-file',
        items: [
          {
            label: 'All Tickets', routerLink: '/TicketReport'
          },
          {
            label: 'My Report', routerLink: '/TicketReport'
          }
        ]
      }
    ];
  }

}
