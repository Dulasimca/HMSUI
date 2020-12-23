import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { PathConstants } from '../Constants/PathConstants';
import { MasterDataService } from '../masters-services/master-data.service';
import { RestAPIService } from '../services/restAPI.service';

@Component({
  selector: 'app-search-ticket',
  templateUrl: './search-ticket.component.html',
  styleUrls: ['./search-ticket.component.css']
})
export class SearchTicketComponent implements OnInit {
  TicketReportData: any = [];
  TicketReportCols: any = [];
  TicketID: any;
  ShowTable: boolean = false;

  constructor(private restApiService: RestAPIService, private datepipe: DatePipe,
    private messageService: MessageService, private masterDataService: MasterDataService) { }

  ngOnInit() {
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
  }

  onView() {
    const params = {
      'UserName': "ST",
      'TicketID': this.TicketID
    }
    this.restApiService.getByParameters(PathConstants.MYTicket, params).subscribe(res => {
      if (res) {
        this.ShowTable = true;
        this.TicketReportData = res;
        let sno = 0;
        this.TicketReportData.forEach(result => {
          sno += 1;
          result.SlNo = sno;
        });
      }
    });
  }
}
