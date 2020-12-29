import { Component, OnInit } from '@angular/core';
import { SelectItem } from 'primeng/api/selectitem';
import { NewTicketComponent } from '../Ticket/new-ticket/new-ticket.component';
import { RestAPIService } from '../services/restAPI.service';
import { DatePipe } from '@angular/common';
import { MessageService } from 'primeng/api';
import { MasterDataService } from '../masters-services/master-data.service';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { PathConstants } from '../Constants/PathConstants';
import { AuthService } from '../services/auth.service';
// import { PrimeNGConfig } from 'primeng/api';

@Component({
  selector: 'app-ticket-update',
  templateUrl: './ticket-update.component.html',
  styleUrls: ['./ticket-update.component.css']
})
export class TicketUpdateComponent implements OnInit {
  TicketReportCols: any = [];
  TicketReportData: any = [];
  showDialog: boolean = false;
  showComment: boolean = false;
  selectedDocId: number;
  userName: string;
  Assignee: any;
  DefaultCC: any;
  URL: any;
  Subject: any;
  TicketDescription: any;
  Status: any;
  reporter: any;
  bugStatusData: any = [];
  TDData: any = [];
  TDCols: any = [];
  StatusOptions: SelectItem[];
  TicketID: any;
  TD: any = [];
  AllTD: any = [];
  blockScreen: boolean;
  showTicketGrid: boolean = true;
  TT: [];
  login_User: any;
  loading: boolean;
  selected: any;

  constructor(private restApiService: RestAPIService, private datepipe: DatePipe,
    private messageService: MessageService, private masterDataService: MasterDataService, private authService: AuthService) { }

  ngOnInit() {
    this.bugStatusData = this.masterDataService.getBugStatus();
    this.login_User = JSON.parse(this.authService.getCredentials()).user;
    this.userName = this.login_User;
    this.onTicket();
    this.onTD();
    this.TicketReportCols = [
      { header: 'S.No', field: 'SlNo', width: '40px' },
      { field: 'TicketID', header: 'Ticket ID' },
      { field: 'TicketDate', header: 'Ticket Date' },
      { field: 'lastdiffed', header: 'Modified Date' },
      { field: 'Status', header: 'Status' },
      { field: 'location', header: 'Location' },
      { field: 'ComponentName', header: 'Component Name' },
      { field: 'Subject', header: 'Subject' },
      { field: 'Assignee', header: 'Assignee' },
      { field: 'DefaultCC', header: 'DefaultCC' },
      { field: 'URL', header: 'URL' },
      { field: 'reporter', header: 'Reporter' },
      { field: 'REGNNAME', header: 'Region' },
      { field: 'Dname', header: 'District' },
      { field: 'shop_number', header: 'Shop_Number' },
    ];
    this.TDCols = [
      // { field: 'TicketID', header: 'TicketID' },
      // { field: 'reporter', header: 'Reporter' },
      // { field: 'ticketTime', header: 'Comment Date' },
      { field: 'description', header: 'Description' },
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
          this.StatusOptions.unshift({ label: '-select-', value: null });
        }
        break;
    }
  }

  onTicket() {
    const params = {
      'UserName': this.userName,
      'TicketID': "A"
    }
    this.restApiService.getByParameters(PathConstants.MYTicket, params).subscribe(res => {
      if (res) {
        this.TicketReportData = res;
        let sno = 0;
        this.TicketReportData.forEach(result => {
          sno += 1;
          result.SlNo = sno;
        });
      }
    });
  }

  onTD() {
    const params = {
      'UserName': this.userName,
      'TicketID': "TD"
    }
    this.restApiService.getByParameters(PathConstants.MYTicket, params).subscribe(res => {
      if (res) {
        this.AllTD = res;
        if (this.TicketID !== undefined) {
          let ATD = [];
          ATD = this.AllTD;
          ATD.forEach(AllTD => {
            if (this.TicketID === AllTD.ticket_id) {
              this.TD.push({ TicketID: AllTD.ticket_id, description: AllTD.description, reporter: AllTD.reporter, ticketTime: AllTD.ticketTime });
            }
          });
        }
      }
    });
  }

  onRowSelect(event) {
    this.onResetTable();
    console.log(event);
    this.TicketID = event.data.TicketID;
    this.Assignee = event.data.Assignee;
    this.DefaultCC = event.data.DefaultCC;
    this.reporter = event.data.reporter;
    this.Subject = event.data.Subject;
    this.URL = event.data.URL;
    this.StatusOptions = [{ label: event.data.Status, value: event.data.Status }];
    this.Status = event.data.Status;
    this.onTD();
    this.showDialog = true;
    this.showTicketGrid = false;
  }

  onUpdate() {
    if (this.TicketID !== undefined) {
      const params = {
        'ticketID': this.TicketID,
        'reporter': this.userName,
        'ticketdescription': this.TicketDescription,
        'Status': (this.Status.label === undefined) ? this.Status : this.Status.label
      }
      this.restApiService.post(PathConstants.TicketDescription, params).subscribe(res => {
        if (res) {
          this.blockScreen = false;
          this.onTicket();
          this.messageService.clear();
          this.messageService.add({
            key: 't-err', severity: 'success',
            summary: 'Success Message', detail: 'Ticket ID: ' + this.TicketID + ' Updated Successfully !'
          });
          this.CancelTD();
          this.onTD();
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

  onSave() {
    this.blockScreen = true;
    if (this.TicketID !== undefined) {
      const params = {
        'ticket_id': this.TicketID,
        'assingedTo': this.userName,
        'Ticketstatus': (this.Status.label === undefined) ? this.Status : this.Status.label,
        'short_desc': this.Subject,
        'URL': "Tasmac-hms.com",
        'CC': this.DefaultCC
      }
      this.restApiService.put(PathConstants.UpdateTicket, params).subscribe(res => {
        if (res) {
          this.onUpdate();
          this.blockScreen = false;
          this.messageService.clear();
          this.messageService.add({
            key: 't-err', severity: 'success',
            summary: 'Success Message', detail: 'Ticket Updated Successfully !'
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

  ticketUpdate() {
    let ticketSelection = [];
    ticketSelection.forEach(res => {
      ticketSelection.push({
        TicketID: this.TicketID, AssignedTo: this.Assignee, Status: this.Status, Subject: this.Subject,
        Reporter: this.Assignee, URL: this.URL
      });
    })
  }

  onResetTable() {
    this.TDData = [];
    this.TD = [];
  }

  onCancel() {
    this.Status = this.Assignee = this.TicketID = this.DefaultCC = this.Subject = this.URL = this.TicketDescription = null;
    this.StatusOptions = [];
  }

  CancelTD() {
    this.TD = [];
    this.TicketDescription = null;
  }

  onBack() {
    this.showTicketGrid = true;
    this.showDialog = false;
  }
}