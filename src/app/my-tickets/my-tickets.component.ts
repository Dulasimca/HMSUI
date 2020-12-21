import { DatePipe } from '@angular/common';
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
  showDialog: boolean = true;
  selectedDocId: number;
  username: string;
  Assignee: any;
  DefaultCC: any;
  URL: any;
  Subject: any;
  TicketDescription: any;
  Status: any;
  bugStatusData: any = [];
  TDData: any = [];
  StatusOptions: SelectItem[];
  TicketID: any;

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
    if (this.TicketID !== null) {
      const params = {
        'UserName': this.username,
        'TicketID': "TD"
      }
      this.restApiService.getByParameters(PathConstants.MYTicket, params).subscribe(res => {
        if (res) {
          this.TDData = res;
        }
      });
      this.TDData.forEach(TD => {
        if (TD.ticket_id === this.TicketID) {
          this.TicketDescription = TD.description;
        }
      })
    }
  }

  onRowSelect(event) {
    console.log(event);
    this.showDialog = true;
    this.TicketID = event.data.TicketID;
    this.Assignee = event.data.Assignee;
    this.DefaultCC = event.data.DefaultCC;
    this.Subject = event.data.Subject;
    this.URL = event.data.URL;
    this.onTD();
    // this.TicketDescription = event.data.TicketDescription;
    this.selectedDocId = event.data.TicketID;
  }

  onUpdate() {

  }

  onCancel() {
    this.Assignee = this.TicketID = this.DefaultCC = this.Subject = this.URL = this.TicketDescription = null;
    this.showDialog = false;
  }

}
