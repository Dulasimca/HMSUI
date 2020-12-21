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
  bugStatusData: any = [];
  StatusOptions: SelectItem[];
  Status: any;
  TicketDescription: any;
  blockScreen: boolean;
  showTable: boolean = false;
  TicketReportCols: any;
  TicketReportData: [];
  TicketID: any;

  constructor(private restApiService: RestAPIService, private datepipe: DatePipe,
    private messageService: MessageService, private masterDataService: MasterDataService, private router: Router) { }

  ngOnInit() {
    this.bugStatusData = this.masterDataService.getBugStatus();
    this.TicketReportCols = [
      { header: 'S.No', field: 'SlNo', width: '40px' },
      { field: 'TicketID', header: 'Ticket ID' },
      { field: 'TicketDate', header: 'Ticket Date' },
      { field: 'lastdiffed', header: 'Modified Date' },
      { field: 'Status', header: 'Status' },
      { field: 'location', header: 'Location' },
      { field: 'ComponentName', header: 'Component Name' },
      { field: 'shop_number', header: 'Shop_Number' },
      { field: 'Subject', header: 'Subject' },
      { field: 'Assignee', header: 'Assignee' },
      { field: 'URL', header: 'URL' },
      { field: 'reporter', header: 'Reporter' },
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

  onView() {
    const params = {
      'TicketID': this.TicketID
    }
    this.restApiService.getByParameters(PathConstants.TicketByID, params).subscribe(res => {
      if (res) {
        this.showTable = true;
        this.TicketReportData = res;
        this.TicketID = res.TicketID;
        this.Status = res.Status;
        let sno = 0;
        res.forEach(res => {
          if (res.shop_number === 0) {
            res.shop_number = 'No Shop';
          }
          sno += 1;
          res.SlNo = sno;
        })
        this.blockScreen = false;
        this.messageService.clear();
      } else {
        this.blockScreen = false;
        this.messageService.clear();
        this.messageService.add({
          key: 't-err', severity: 'error',
          summary: 'Error Message', detail: 'No Records Found'
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
    })
  }

  onUpdate() {
    const params = {
      'ticketID': this.TicketID,
      'reporter': '42',
      'ticketdescription': this.TicketDescription
    }
    this.restApiService.post(PathConstants.TicketDescription, params).subscribe(res => {
      if (res.item1) {
        this.blockScreen = false;
        this.messageService.clear();
        this.messageService.add({
          key: 't-err', severity: 'success',
          summary: 'Success Message', detail: 'Ticket ID: ' + this.TicketID + ' Saved Successfully !'
        });
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
}
