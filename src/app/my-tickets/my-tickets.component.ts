import { DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MessageService, SelectItem } from 'primeng/api';
import { PathConstants } from '../Constants/PathConstants';
import { MasterDataService } from '../masters-services/master-data.service';
import { RestAPIService } from '../services/restAPI.service';

@Component({
  selector: 'app-my-tickets',
  templateUrl: './my-tickets.component.html',
  styleUrls: ['./my-tickets.component.css']
})
export class MyTicketsComponent implements OnInit {
  TicketReportCols: any = [];
  TicketReportData: any = [];
  showDialog: boolean = false;
  showComment: boolean = false;
  selectedDocId: number;
  username: string;
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

  constructor(private restApiService: RestAPIService, private datepipe: DatePipe,
    private messageService: MessageService, private masterDataService: MasterDataService) { }

  ngOnInit() {
    this.bugStatusData = this.masterDataService.getBugStatus();
    this.username = "42";
    const params = {
      'UserName': this.username,
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
    this.onTD();
    this.TicketReportCols = [
      { header: 'S.No', field: 'SlNo', width: '40px' },
      { field: 'TicketID', header: 'Ticket ID' },
      { field: 'TicketDate', header: 'Ticket Date' },
      { field: 'lastdiffed', header: 'Modified Date' },
      { field: 'Status', header: 'Status' },
      { field: 'location', header: 'Location' },
      { field: 'ComponentName', header: 'Component Name' },
      { field: 'REGNNAME', header: 'Region' },
      { field: 'Dname', header: 'District' },
      { field: 'shop_number', header: 'Shop_Number' },
      { field: 'Subject', header: 'Subject' },
      { field: 'Assignee', header: 'Assignee' },
      { field: 'DefaultCC', header: 'DefaultCC' },
      { field: 'URL', header: 'URL' },
      { field: 'reporter', header: 'Reporter' },
    ];
    this.TDCols = [
      { field: 'TicketID', header: 'TicketID' },
      { field: 'reporter', header: 'Reporter' },
      { field: 'ticketTime', header: 'Comment Date' },
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

  onTD() {
    const params = {
      'UserName': this.username,
      'TicketID': "TD"
    }
    this.restApiService.getByParameters(PathConstants.MYTicket, params).subscribe(res => {
      if (res) {
        this.AllTD = res;
      }
    });
  }

  onRowSelect(event, selectedRow) {
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
    if (this.TicketID !== undefined) {
      let ATD = [];
      ATD = this.AllTD;
      ATD.forEach(AllTD => {
        if (this.TicketID === AllTD.ticket_id) {
          this.TD.push({ TicketID: AllTD.ticket_id, description: AllTD.description, reporter: AllTD.reporter, ticketTime: AllTD.ticketTime });
        }
      });
    }
    this.TDData = this.TD
    this.showDialog = true;
  }

  onComment() {
    this.showComment = true;
  }

  onUpdate() {
    const params = {
      'ticketID': this.TicketID,
      'reporter': 42,
      'ticketdescription': this.TicketDescription
    }
    this.restApiService.post(PathConstants.TicketDescription, params).subscribe(res => {
      if (res.item1) {
        this.blockScreen = false;
        this.messageService.clear();
        this.messageService.add({
          key: 't-err', severity: 'success',
          summary: 'Success Message', detail: 'Ticket ID: ' + this.TicketID + ' Updated Successfully !'
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

  onSave() { }

  onResetTable() {
    this.TDData = [];
    this.TD = [];
  }

  onCancel() {
    this.Assignee = this.TicketID = this.DefaultCC = this.Subject = this.URL = this.TicketDescription = null;
    this.showDialog = this.showComment = false;
  }
}
