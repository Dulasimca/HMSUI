import { Component, OnInit } from '@angular/core';
import { SelectItem } from 'primeng/api/selectitem';
import { RestAPIService } from '../services/restAPI.service';
import { MessageService } from 'primeng/api';
import { DatePipe } from '@angular/common';
import { MasterDataService } from '../masters-services/master-data.service';
import { AuthService } from '../services/auth.service';
import { NgForm } from '@angular/forms';
import { PathConstants } from '../helper/PathConstants';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-relocation-form',
  templateUrl: './relocation-form.component.html',
  styleUrls: ['./relocation-form.component.css']
})
export class RelocationFormComponent implements OnInit {
  shopOptions: SelectItem[];
  shopNo: any;
  regionOptions: SelectItem[];
  rcode: any;
  districtOptions: SelectItem[];
  dcode: any;
  reasonOptions: SelectItem[];
  reason: any;
  statusOptions: SelectItem[];
  status: any;
  fromAddress: string;
  toAddress: string;
  docDate: any;
  completedDate: any;
  maxDate: Date = new Date();
  user: any;
  blockScreen: boolean;
  districtsData: any;
  regionsData: any;
  shopData: any;
  reasonData: any;
  statusData: any;
  Relocation_Id: any;
  viewDate: any;
  relocationDetailsData: any = [];
  relocationDetailsCols: any;
  isEditClicked: boolean;

  constructor(private restApiService: RestAPIService, private datepipe: DatePipe,
    private messageService: MessageService, private masterDataService: MasterDataService,
    private authService: AuthService) { }

  ngOnInit() {
    this.user = JSON.parse(this.authService.getCredentials()).user;
    this.districtsData = this.masterDataService.getDistricts();
    this.regionsData = this.masterDataService.getRegions();
    this.shopData = this.masterDataService.getShops();
    this.statusData = this.masterDataService.getBugStatus();
    this.assignDefaultValues();
    this.relocationDetailsCols = [
      { field: 'SlNo', header: 'S.No.' },
      { field: 'REGNNAME', header: 'Region Name' },
      { field: 'Dname', header: 'District Name' },
      { field: 'ShopCode', header: 'Shop Code' },
      { field: 'Reason', header: 'Reason' },
      { field: 'FromAddress', header: 'From Address' },
      { field: 'ToAddress', header: 'To Address' },
      { field: 'StatusName', header: 'Status' },
      { field: 'DocDate', header: 'Doc.Date.' },
      { field: 'CompletedDate', header: 'Completed Date' }
    ]
  }

  assignDefaultValues() {
    this.statusOptions = [{ label: 'OPEN', value: 2 }];
    this.status = { label: 'OPEN', value: 2 };
    this.isEditClicked = false;
    this.relocationDetailsData = [];
    this.blockScreen = false;
  }

  onSelect(type) {
    let regionSelection = [];
    let districtSeletion = [];
    let shopSeletion = [];
    let reasonSeletion = [];
    let statusSelection = [];
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
      case 'RE':
        if (this.reasonData.length !== 0) {
          this.reasonData.forEach(r => {
            if (r.type === 2) {
              reasonSeletion.push({ label: r.name, value: r.id });
            }
          })
          this.reasonOptions = reasonSeletion;
          this.reasonOptions.unshift({ label: '-select-', value: null });
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
      'Id': (this.Relocation_Id !== null && this.Relocation_Id !== undefined) ? this.Relocation_Id : 0,
      'Dcode': this.dcode.value,
      'Rcode': this.rcode.value,
      'Status': this.status.value,
      'Reason': this.reason,
      'ShopCode': this.shopNo.value,
      'FromAddress': this.fromAddress,
      'ToAddress': this.toAddress,
      'DocDate': this.docDate,
      'CompletedDate': (this.isEditClicked && this.completedDate !== undefined
        && this.completedDate !== null) ? this.datepipe.transform(this.completedDate, 'yyyy-MM-dd') : '-',
      'User': this.user
    }
    this.restApiService.post(PathConstants.RelocationDetailsPost, params).subscribe(res => {
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
    form.controls.fromAddr.reset();
    form.controls.toAddr.reset();
    form.controls.reasonText.reset();
    form.controls.stats.reset();
    form.controls.ddate.reset();
  }

  getRelocationDetails() {
    if (this.viewDate !== null && this.viewDate !== undefined && this.viewDate.toString().trim() !== '') {
      this.relocationDetailsData = [];
      const params = {
        'FDate': this.datepipe.transform(this.viewDate, 'yyyy-MM-dd'),
        'TDate': this.datepipe.transform(this.viewDate, 'yyyy-MM-dd')
      }
      this.restApiService.getByParameters(PathConstants.RelocationDetailsGet, params).subscribe(res => {
        if (res !== undefined && res !== null && res.length !== 0) {
          this.relocationDetailsData = res;
          let sno = 1;
          this.relocationDetailsData.forEach(t => {
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
      this.Relocation_Id = row.TId;
      this.regionOptions = [{ label: row.REGNNAME, value: row.Rcode }];
      this.rcode = { label: row.REGNNAME, value: row.Rcode };
      this.districtOptions = [{ label: row.Dname, value: row.Dcode }];
      this.dcode = { label: row.Dname, value: row.Dcode };
      this.statusOptions = [{ label: row.StatusName, value: row.Status }];
      this.status = { label: row.StatusName, value: row.Status };
      this.shopOptions = [{ label: row.ShopCode, value: row.ShopCode }];
      this.shopNo = { label: row.ShopCode, value: row.ShopCode };
      this.reason = row.Reason;
      this.fromAddress = row.FromAddress;
      this.toAddress = row.ToAddress;
      this.docDate = row.DocDate;
      this.completedDate = row.completedDate;
    }
  }

  onClear(form: NgForm) {
    form.reset();
    this.assignDefaultValues();
  }
}
