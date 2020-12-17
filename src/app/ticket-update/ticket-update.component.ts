import { Component, OnInit } from '@angular/core';
import { SelectItem } from 'primeng/api/selectitem';
import { NewTicketComponent } from '../Ticket/new-ticket/new-ticket.component';
import { RestAPIService } from '../services/restAPI.service';
import { DatePipe } from '@angular/common';
import { MessageService } from 'primeng/api';
import { MasterDataService } from '../masters-services/master-data.service';
import { Router } from '@angular/router';
import { PathConstants } from '../helper/PathConstants';
import { HttpErrorResponse } from '@angular/common/http';
// import { PrimeNGConfig } from 'primeng/api';

@Component({
  selector: 'app-ticket-update',
  templateUrl: './ticket-update.component.html',
  styleUrls: ['./ticket-update.component.css']
})
export class TicketUpdateComponent implements OnInit {
  // products: Product[];
  product: any;
  ticketView: NewTicketComponent;

  sortOptions: SelectItem[];

  sortOrder: number;

  sortField: string;
  bugStatusData: any = [];
  StatusOptions: SelectItem[];
  TicketDescription: any;
  blockScreen: boolean;

  constructor(private restApiService: RestAPIService, private datepipe: DatePipe,
    private messageService: MessageService, private masterDataService: MasterDataService, private router: Router) { }

  ngOnInit() {
    this.bugStatusData = this.masterDataService.getBugStatus();
    // this.primengConfig.ripple = true;
    // this.productService.getProducts().then(data => this.products = data);

    this.sortOptions = [
      { label: 'Price High to Low', value: '!price' },
      { label: 'Price Low to High', value: 'price' }
    ];
  }

  onSelect(type) {
    let statusSeletion = [];
    switch (type) {
      case 'Status':
        if (this.bugStatusData.length !== 0) {
          this.bugStatusData.forEach(bs => {
            statusSeletion.push({ label: bs.name, id: bs.id });
          });
          this.StatusOptions = statusSeletion;
          this.StatusOptions.unshift({ label: 'All', value: 'All' });
        }
        break;
    }
  }

  onView() { }

  onUpdate() { }

  Ticket_Description() {
    const params = {
      'ticketID': '',
      'reporter': '42',
      'ticketdescription': this.TicketDescription
    }
    this.restApiService.post(PathConstants.TicketDescription, params).subscribe(res => {
      if (res.item1) {
        this.blockScreen = false;
        this.messageService.clear();
        this.messageService.add({
          key: 't-err', severity: 'success',
          summary: 'Success Message', detail: 'Status & Comment Saved !'
        });
        // this.router.navigate(['/TicketDescription']);
      } else {
        this.blockScreen = false;
        this.messageService.clear();
        this.messageService.add({
          key: 't-err', severity: 'error',
          summary: 'Error Message', detail: res.item2
        });
      }
    }, (err: HttpErrorResponse) => {
      this.blockScreen = false;
      if (err.status === 0 || err.status === 400) {
        this.messageService.clear();
        this.messageService.add({
          key: 't-err', severity: 'error',
          summary: 'Error Message', detail: 'Please Contact Administrator!'
        });
      }
    });
  }

  onSortChange(event) {
    let value = event.value;

    if (value.indexOf('!') === 0) {
      this.sortOrder = -1;
      this.sortField = value.substring(1, value.length);
    }
    else {
      this.sortOrder = 1;
      this.sortField = value;
    }
  }
}
