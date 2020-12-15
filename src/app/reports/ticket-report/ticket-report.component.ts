import { Component, OnInit, ViewChild } from '@angular/core';
import { SelectItem } from 'primeng/api/selectitem';
import { RestAPIService } from 'src/app/services/restAPI.service';
import { DatePipe } from '@angular/common';
import { MenuItem, MessageService } from 'primeng/api';
import { MasterDataService } from 'src/app/masters-services/master-data.service';
import { PathConstants } from 'src/app/Constants/PathConstants';
import { Table } from 'primeng/table';

@Component({
  selector: 'app-ticket-report',
  templateUrl: './ticket-report.component.html',
  styleUrls: ['./ticket-report.component.css']
})
export class TicketReportComponent implements OnInit {
  maxDate: Date = new Date();
  TicketReportCols: any;
  TicketReportData: [];
  fromDate: any;
  toDate: any;
  showCloseDate: boolean;
  districtsData: any = [];
  regionsData: any = [];
  locationsData: any = [];
  regionOptions: SelectItem[];
  rcode: string;
  districtOptions: SelectItem[];
  dcode: string;
  locationOptions: SelectItem[];
  location: number;
  componentOptions: SelectItem[];
  compId: string;
  disableDM: boolean;
  disableRM: boolean;
  disableShop: boolean;
  componentsData: any[];
  items: MenuItem[];
  @ViewChild('dt', { static: false }) table: Table;

  constructor(private restApiService: RestAPIService, private datepipe: DatePipe,
    private messageService: MessageService, private masterDataService: MasterDataService) { }

  ngOnInit() {
    this.showCloseDate = false;
    this.items = [
      {
        label: 'Excel', icon: 'pi pi-file-excel', command: () => {
          this.table.exportCSV();
        }
      }
    ];
    this.districtsData = this.masterDataService.getDistricts();
    this.regionsData = this.masterDataService.getRegions();
    this.locationsData = this.masterDataService.getProducts();
    this.TicketReportCols = [
      { header: 'S.No', field: 'SlNo', width: '40px' },
      { field: 'TicketID', header: 'Ticket ID' },
      { field: 'TicketDate', header: 'Ticket Date' },
      { field: 'Status', header: 'Status' },
      { field: 'location', header: 'Location' },
      { field: 'Component', header: 'Component' },
      { field: 'Region', header: 'Region' },
      { field: 'District', header: 'District' },
      { field: 'shop_number', header: 'Shop_Number' },
      { field: 'Subject', header: 'Subject' },
      { field: 'Assignee', header: 'Assignee' },
      { field: 'DefaultCC', header: 'DefaultCC' },
      { field: 'URL', header: 'URL' },
    ];
  }

  onSelect(type) {
    let regionSelection = [];
    let districtSeletion = [];
    let locationSeletion = [];
    switch (type) {
      case 'R':
        if (this.regionsData.length !== 0) {
          this.regionsData.forEach(r => {
            regionSelection.push({ label: r.name, value: r.code });
          })
          this.regionOptions = regionSelection;
          this.regionOptions.unshift({ label: '-select-', value: null });
        }
        break;
      case 'D':
        if (this.districtsData.length !== 0) {
          this.districtsData.forEach(d => {
            if (this.rcode === d.rcode) {
              districtSeletion.push({ label: d.name, value: d.code });
            }
          })
          this.districtOptions = districtSeletion;
          this.districtOptions.unshift({ label: '-select-', value: null });
        }
        break;
      case 'L':
        if (this.locationsData.length !== 0) {
          this.locationsData.forEach(d => {
            locationSeletion.push({ label: d.name, value: d.id });
          })
          this.locationOptions = locationSeletion;
          this.locationOptions.unshift({ label: '-select-', value: null });
          if (this.location === 2) {
            this.disableDM = this.disableRM = this.disableShop = true;
          } else if (this.location === 5) {
            this.disableDM = this.disableRM = this.disableShop = false;
          } else if (this.location === 4) {
            this.disableDM = this.disableRM = false;
            this.disableShop = true;
          } else if (this.location === 3) {
            this.disableDM = this.disableShop = true;
            this.disableRM = false;
          }
        }
        break;
      case 'C':
        this.componentsData = [];
        this.restApiService.get(PathConstants.ComponentsURL).subscribe((res: any) => {
          res.forEach(x => {
            if (this.location === 3 && x.product_id === 3) {
              this.componentsData.push({ label: x.name, value: x.id, desc: x.description });
              this.disableShop = true;
            } else if (this.location === 4 && x.product_id === 4) {
              this.componentsData.push({ label: x.name, value: x.id, desc: x.description });
            } else if (this.location === 5 && x.product_id === 5) {
              this.componentsData.push({ label: x.name, value: x.id, desc: x.description });
            } else if (this.location === 2 && x.product_id === 5) {
              this.componentsData.push({ label: x.name, value: x.id, desc: x.description });
            }
          });
          this.componentOptions = this.componentsData;
          this.componentOptions.unshift({ label: '-select-', value: null });
        });
        break;
    }
  }

  checkValidDateSelection() {
    if (this.fromDate !== undefined && this.toDate !== undefined && this.fromDate !== '' && this.toDate !== '') {
      let selectedFromDate = this.fromDate.getDate();
      let selectedToDate = this.toDate.getDate();
      let selectedFromMonth = this.fromDate.getMonth();
      let selectedToMonth = this.toDate.getMonth();
      let selectedFromYear = this.fromDate.getFullYear();
      let selectedToYear = this.toDate.getFullYear();
      if ((selectedFromDate > selectedToDate && ((selectedFromMonth >= selectedToMonth && selectedFromYear >= selectedToYear) ||
        (selectedFromMonth === selectedToMonth && selectedFromYear === selectedToYear))) ||
        (selectedFromMonth > selectedToMonth && selectedFromYear === selectedToYear) || (selectedFromYear > selectedToYear)) {
        this.messageService.clear();
        this.messageService.add({
          key: 'msgKey', severity: 'warn', life: 5000
          , summary: 'Invalid Date!', detail: 'Please select the valid date'
        });
      }
      return this.fromDate, this.toDate;
    }
  }

}
