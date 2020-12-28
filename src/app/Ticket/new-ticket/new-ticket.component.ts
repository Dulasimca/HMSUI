import { Component, OnInit } from '@angular/core';
import { SelectItem, MessageService } from 'primeng/api';
import { RestAPIService } from 'src/app/services/restAPI.service';
import { MasterDataService } from 'src/app/masters-services/master-data.service';
import { DatePipe } from '@angular/common';
import { NgForm } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { PathConstants } from 'src/app/helper/PathConstants';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-new-ticket',
  templateUrl: './new-ticket.component.html',
  styleUrls: ['./new-ticket.component.css']
})
export class NewTicketComponent implements OnInit {
  shopOptions: SelectItem[];
  shopCode: any;
  regionOptions: SelectItem[];
  rcode: string;
  districtOptions: SelectItem[];
  dcode: string;
  locationOptions: SelectItem[];
  location: any;
  componentOptions: SelectItem[];
  compId: any;
  reasonOptions: SelectItem[];
  ComponentDescription: any;
  Status: any = "UN - ASSIGNED"
  StatusOptions: SelectItem[];
  CCOptions: SelectItem[];
  Assignee: any;
  DefaultCC: any;
  URL: any;
  Subject: any;
  TicketDescription: any;
  reasonId: number;
  bug_id: number;
  closed_date: string;
  remarksTxt: string;
  selectedType: any = 1;
  maxDate: Date = new Date();
  fromDate: any;
  toDate: any;
  reasonData: any = [];
  regionsData: any = [];
  componentsData: any = [];
  districtsData: any = [];
  locationsData: any = [];
  bugStatusData: any = [];
  shopData: any = [];
  CCData: any = [];
  showCloseDate: boolean;
  isLocationSelected: boolean;
  disableShop: boolean;
  disableDM: boolean;
  disableRM: boolean;
  blockScreen: boolean;
  TicketID: any;
  ticketView: any[];
  login_User: any;
  user: any;

  constructor(private restApiService: RestAPIService, private datepipe: DatePipe,
    private messageService: MessageService, private masterDataService: MasterDataService, private router: Router,
    private authService: AuthService) { }

  ngOnInit() {
    this.showCloseDate = false;
    this.login_User = JSON.parse(this.authService.getCredentials()).user;
    this.user = this.login_User;
    // this.user = '42';
    this.districtsData = this.masterDataService.getDistricts();
    this.regionsData = this.masterDataService.getRegions();
    this.locationsData = this.masterDataService.getProducts();
    this.shopData = this.masterDataService.getShops();
    this.reasonData = this.masterDataService.getReasons();
    this.bugStatusData = this.masterDataService.getBugStatus();
    this.CCData = this.masterDataService.getComponentCC();
  }

  onSelect(type) {
    let regionSelection = [];
    let districtSeletion = [];
    let locationSeletion = [];
    let shopSeletion = [];
    switch (type) {
      case 'R':
        if (this.regionsData.length !== 0) {
          this.regionsData.forEach(r => {
            regionSelection.push({ label: r.name, value: r.code });
          })
          this.regionOptions = regionSelection;
          this.regionOptions.unshift({ label: '-Select-', value: 'All' });
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
          this.districtOptions.unshift({ label: '-Select-', value: 'All' });
        }
        break;
      case 'L':
        if (this.locationsData.length !== 0) {
          this.locationsData.forEach(d => {
            locationSeletion.push({ label: d.name, value: d.id });
          })
          this.locationOptions = locationSeletion;
          this.locationOptions.unshift({ label: '-Select-', value: 'All' });
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
          } else if (this.location === 9) {
            this.disableDM = this.disableShop = true;
            this.disableRM = false;
          }
        }
        break;
      case 'C':
        if (this.componentsData.length === 0) {
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
              } else if (this.location === 2 && x.product_id === 2) {
                this.componentsData.push({ label: x.name, value: x.id, desc: x.description });
              }
            });
            this.componentOptions = this.componentsData;
            this.componentOptions.unshift({ label: '-Select-', value: null });
          });
        }
        if (this.compId !== null) {
          this.componentsData.forEach(d => {
            if (this.compId.value === d.value) {
              this.ComponentDescription = d.desc;
            }
          });
          this.CCData.forEach(bs => {
            if (bs.id === this.compId.value) {
              this.DefaultCC = bs.name;
              this.Assignee = bs.assiginee;
            }
          });
        }
        break;
      case 'S':
        if (this.shopData.length !== 0) {
          this.shopData.forEach(s => {
            if (this.dcode === s.dcode) {
              shopSeletion.push({ label: s.shop_num, value: s.dcode });
            }
          });
          this.shopOptions = shopSeletion;
          this.shopOptions.unshift({ label: '-Select-', value: 'All' });
        }
        break;
      // case 'Status':
      //   if (this.bugStatusData.length !== 0) {
      //     this.bugStatusData.forEach(bs => {
      //       statusSeletion.push({ label: bs.name, id: bs.id });
      //     });
      //     this.StatusOptions = statusSeletion;
      //     this.StatusOptions.unshift({ label: '-Select-', value: null });
      //   }
      //   break;
    }
  }

  onResetFields(field) {
    if (field === 'RM') {
      this.dcode = null;
      this.shopCode = null;
    } else if (field === 'L') {
      this.compId = null;
      this.dcode = null;
      this.rcode = null;
      this.shopCode = null;
      this.componentsData = [];
    }
  }

  onSave() {
    this.blockScreen = true;
    if (this.location !== undefined) {
      const params = {
        'Region': (this.rcode !== undefined && this.rcode !== null) ? this.rcode : '0',
        'District': (this.dcode !== undefined && this.dcode !== null) ? this.dcode : '0',
        'Shops': (this.shopCode !== undefined && this.shopCode !== null) ? this.shopCode.label : '0',
        'assingedTo': this.Assignee,
        'Ticketseverity': "enhanced",
        'Ticketstatus': this.Status,
        'short_desc': this.Subject,
        'product': this.location,
        'component_id': this.compId.value,
        'reporter': this.user,
        'URL': this.URL,
        'everconfirmed': true,
        'reporter_accessible': true,
        'cclist_accessible': true,
        'CC': this.DefaultCC
        // 'FromDate': this.datepipe.transform(this.fromDate, 'yyyy-MM-dd h:mm:ss a'),
        // 'ToDate': this.datepipe.transform(this.toDate, 'yyyy-MM-dd h:mm:ss a'),
      }
      this.restApiService.post(PathConstants.NewTicket, params).subscribe(res => {
        if (res.item1) {
          this.TicketID = res.item3;
          this.ticketUpdate();
          this.Ticket_Description();
          this.blockScreen = false;
          this.messageService.clear();
          this.messageService.add({
            key: 't-err', severity: 'success',
            summary: 'Success Message', detail: 'Ticket Saved Successfully !'
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
    // this.router.navigate(['/TicketDescription']);
  }

  Ticket_Description() {
    if (this.TicketID !== undefined) {
      const params = {
        'ticketID': this.TicketID,
        'reporter': this.user,
        'ticketdescription': this.TicketDescription,
        'Status': this.Status
      }
      this.restApiService.post(PathConstants.TicketDescription, params).subscribe(res => {
        if (res.item1) {
          this.blockScreen = false;
          this.onClear();
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

  onClear(){
    this.location = this.rcode = this.dcode = this.shopCode = this.compId = this.Assignee = null;
    this.DefaultCC = this.ComponentDescription = this.URL = this.Subject = this.TicketDescription = null;
  }

  ticketUpdate() {
    let ticketSelection = [];
    ticketSelection.forEach(res => {
      ticketSelection.push({
        TicketID: this.TicketID, AssignedTo: this.Assignee, Region: this.rcode,
        District: this.dcode, Status: this.Status, Subject: this.Subject, location: this.location, component: this.compId,
        Reporter: this.Assignee, URL: this.URL
      });
    })
    this.ticketView = ticketSelection;
  }
}
