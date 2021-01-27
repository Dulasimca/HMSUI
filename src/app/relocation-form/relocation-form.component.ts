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

  constructor(private restApiService: RestAPIService, private datepipe: DatePipe,
    private messageService: MessageService, private masterDataService: MasterDataService,
    private authService: AuthService) { }

  ngOnInit() {
    this.user = JSON.parse(this.authService.getCredentials()).user;
    this.districtsData = this.masterDataService.getDistricts();
    this.regionsData = this.masterDataService.getRegions();
    this.shopData = this.masterDataService.getShops();
    this.reasonData = this.masterDataService.getReasons();
    this.statusData = this.masterDataService.getBugStatus();
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
      'Dcode': this.dcode.value,
      'Rcode': this.rcode.value,
      'Status': this.status.value,
      'Reason': this.reason.value,
      'ShopCode': this.shopNo.value,
      'FromAddress': this.fromAddress,
      'ToAddress': this.toAddress,
      'DocDate': this.datepipe.transform(this.docDate, 'yyyy-MM-dd'),
      'CompletedDate': this.datepipe.transform(this.completedDate, 'yyyy-MM-dd'),
      'User': this.user
    }
    this.restApiService.post(PathConstants.RelocationDetailsPost, params).subscribe(res => {
      if (res.item1) {
        this.blockScreen = false;
        form.reset();
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
}
