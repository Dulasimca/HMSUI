import { Component, OnInit } from '@angular/core';
import { SelectItem, MessageService } from 'primeng/api';
import { RestAPIService } from '../services/restAPI.service';
import { AuthService } from '../services/auth.service';
import { DatePipe } from '@angular/common';
import { MasterDataService } from '../masters-services/master-data.service';
import { PathConstants } from '../helper/PathConstants';
import { HttpErrorResponse } from '@angular/common/http';
import { NgForm } from '@angular/forms';
import { format } from 'path';

@Component({
  selector: 'app-theft-form',
  templateUrl: './theft-form.component.html',
  styleUrls: ['./theft-form.component.css']
})
export class TheftFormComponent implements OnInit {
  shopOptions: SelectItem[];
  shopNo: any;
  regionOptions: SelectItem[];
  rcode: any;
  districtOptions: SelectItem[];
  dcode: any;
  reason: string;
  statusOptions: SelectItem[];
  status: any;
  issueTypeOptions: SelectItem[];
  issueType: any;
  address: string;
  docDate: any;
  completedDate: any;
  maxDate: Date = new Date();
  user: any;
  blockScreen: boolean;
  districtsData: any;
  regionsData: any;
  shopData: any;
  statusData: any;
  issuesData: any;
  urlPath: string;
  isEditClicked: boolean;
  viewDate: any;
  theftDetailsCols: any;
  theftDetailsData: any = [];
  Theft_Id: any;

  constructor(private restApiService: RestAPIService, private datepipe: DatePipe,
    private messageService: MessageService, private masterDataService: MasterDataService,
    private authService: AuthService) { }

  ngOnInit() {
    this.user = JSON.parse(this.authService.getCredentials()).user;
    this.districtsData = this.masterDataService.getDistricts();
    this.regionsData = this.masterDataService.getRegions();
    this.shopData = this.masterDataService.getShops();
    this.statusData = this.masterDataService.getBugStatus();
    this.issuesData = this.masterDataService.getIssuesType();
    this.assignDefaultValues();
    this.theftDetailsCols = [
      { field: 'SlNo', header: 'S.No.' },
      { field: 'REGNNAME', header: 'Region Name' },
      { field: 'Dname', header: 'District Name' },
      { field: 'Shopcode', header: 'Shop Code' },
      { field: 'Reason', header: 'Reason' },
      { field: 'IssueName', header: 'Issue Type' },
      { field: 'StatusName', header: 'Status' },
      { field: 'DocDate', header: 'Doc.Date.' },
      { field: 'Address', header: 'Address' },
      { field: 'URL', header: 'Video URL' },
      { field: 'CompletedDate', header: 'Completed Date' }
    ];
  }

  assignDefaultValues() {
    this.statusOptions = [{ label: 'OPEN', value: 2 }];
    this.status = { label: 'OPEN', value: 2 };
    this.isEditClicked = false;
    this.theftDetailsData = [];
    this.blockScreen = false;
  }

  onSelect(type) {
    let regionSelection = [];
    let districtSeletion = [];
    let shopSeletion = [];
    let statusSelection = [];
    let issueTypeSelection = [];
    switch (type) {
      case 'RM':
        if (this.regionsData.length !== 0) {
          this.regionsData.forEach(r => {
            regionSelection.push({ label: r.name, value: r.code });
          })
          this.regionOptions = regionSelection;
          this.regionOptions.unshift({ label: '-select-', value: null });
        }
        break;
      case 'DM':
        if (this.districtsData.length !== 0) {
          this.districtsData.forEach(d => {
            if (this.rcode.value === d.rcode) {
              districtSeletion.push({ label: d.name, value: d.code });
            }
          })
          this.districtOptions = districtSeletion;
          this.districtOptions.unshift({ label: '-select-', value: null });
        }
        break;
      case 'SH':
        if (this.shopData.length !== 0) {
          this.shopData.forEach(s => {
            if (this.dcode.value === s.dcode) {
              shopSeletion.push({ label: s.shop_num, value: s.dcode });
            }
          })
          this.shopOptions = shopSeletion;
          this.shopOptions.unshift({ label: '-select-', value: null });
        }
        break;
      case 'ST':
        if (this.statusData.length !== 0) {
          this.statusData.forEach(st => {
            const id = (st.id * 1);
            if (id === 2 || id === 7 || id === 3) {
              statusSelection.push({ label: st.name, value: st.id });
            }
          })
          this.statusOptions = statusSelection;
          this.statusOptions.unshift({ label: '-select-', value: null });
        }
        break;
      case 'IT':
        if (this.issuesData.length !== 0) {
          this.issuesData.forEach(it => {
            issueTypeSelection.push({ label: it.type, value: it.id });
          })
          this.issueTypeOptions = issueTypeSelection;
          this.issueTypeOptions.unshift({ label: '-select-', value: null });
        }
        break;
    }
  }

  onResetFields(field) {
    if (field === 'RM') {
      this.dcode = null;
    } else if (field === 'DM') {
      this.shopNo = null;
    }
  }

  onSave(form: NgForm) {
    this.blockScreen = true;
    const params = {
      'Id': (this.Theft_Id !== null && this.Theft_Id !== undefined) ? this.Theft_Id : 0,
      'Dcode': this.dcode.value,
      'Rcode': this.rcode.value,
      'Status': this.status.value,
      'Reason': this.reason,
      'ShopCode': this.shopNo.value,
      'Address': this.address,
      'IssueType': this.issueType.value,
      'DocDate': this.docDate,
      'CompletedDate': (this.isEditClicked && this.completedDate !== undefined
        && this.completedDate !== null) ? this.datepipe.transform(this.completedDate, 'yyyy-MM-dd') : '-',
      'URL': this.urlPath,
      'User': this.user
    }
    this.restApiService.post(PathConstants.TheftDetailsPost, params).subscribe(res => {
      if (res.item1) {
        form.reset();
        this.assignDefaultValues();
        this.messageService.clear();
        this.messageService.add({
          key: 't-err', severity: 'success',
          summary: 'Success Message', detail: 'Saved Successfully !'
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

  resetFormFields(form) {
    form.controls.rname.reset();
    form.controls.dname.reset();
    form.controls.shop.reset();
    form.controls.issue.reset();
    form.controls.addr.reset();
    form.controls.reasonText.reset();
    form.controls.stats.reset();
    form.controls.ddate.reset();
    form.controls.url.reset();
  }

  getTheftDetails() {
    if (this.viewDate !== null && this.viewDate !== undefined && this.viewDate.toString().trim() !== '') {
      this.theftDetailsData = [];
      const params = {
        'FDate': this.datepipe.transform(this.viewDate, 'yyyy-MM-dd'),
        'TDate': this.datepipe.transform(this.viewDate, 'yyyy-MM-dd')
      }
      this.restApiService.getByParameters(PathConstants.TheftDetailsGet, params).subscribe(res => {
        if (res !== undefined && res !== null && res.length !== 0) {
          this.theftDetailsData = res;
          let sno = 1;
          this.theftDetailsData.forEach(t => {
            t.SlNo = sno;
            sno += 1;
          })
        }
      })
    }
  }

  onRowSelect(row, index, form: NgForm) {
    if (row !== undefined && row !== null) {
      this.resetFormFields(form);
      this.Theft_Id = row.TId;
      this.regionOptions = [{ label: row.REGNNAME, value: row.Rcode }];
      this.rcode = { label: row.REGNNAME, value: row.Rcode };
      this.districtOptions = [{ label: row.Dname, value: row.Dcode }];
      this.dcode = { label: row.Dname, value: row.Dcode };
      this.statusOptions = [{ label: row.StatusName, value: row.Status }];
      this.status = { label: row.StatusName, value: row.Status };
      this.issueTypeOptions = [{ label: row.IssueName, value: row.IssueType }];
      this.issueType = { label: row.IssueName, value: row.IssueType };
      this.shopOptions = [{ label: row.Shopcode, value: row.Shopcode }];
      this.shopNo = { label: row.Shopcode, value: row.Shopcode };
      this.reason = row.Reason;
      this.address = row.Address;
      this.urlPath = row.URL;
      this.completedDate = row.completedDate;
      this.docDate = row.DocDate;
    }
  }

  onClear(form: NgForm) {
    form.reset();
    this.assignDefaultValues();
  }
}
