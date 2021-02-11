import { DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { SelectItem } from 'primeng/api/selectitem';
import { PathConstants } from 'src/app/helper/PathConstants';
import { MasterDataService } from 'src/app/masters-services/master-data.service';
import { AuthService } from 'src/app/services/auth.service';
import { RestAPIService } from 'src/app/services/restAPI.service';
import { FileUploadModule } from 'primeng/fileupload';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-my-profile',
  templateUrl: './my-profile.component.html',
  styleUrls: ['./my-profile.component.css']
})
export class MyProfileComponent implements OnInit {
  Name: any;
  Phone: any;
  Email: any;
  FileName: any;
  regionOptions: SelectItem[];
  rcode: any;
  districtOptions: SelectItem[];
  dcode: any;
  Address: string;
  LocationURL: string;
  maxDate: Date = new Date();
  blockScreen: boolean;
  districtsData: any;
  regionsData: any;
  User_Id: any;
  viewDate: any;
  UserProfileData: any = [];
  UserProfileCols: any;
  isEditClicked: boolean;
  loading: Boolean;
  locationsData: any;
  locationOptions: SelectItem[];
  location: any;
  disableDM: boolean;
  disableRM: boolean;
  uploadedFiles: any[] = [];
  login_details: any;
  Username: any;
  RMName: string;
  RMDistrict: any;
  RMPhnNo: number;
  RMEmailId: string;
  isExists: boolean;

  constructor(private restApiService: RestAPIService, private datepipe: DatePipe,
    private messageService: MessageService, private masterDataService: MasterDataService,
    private authService: AuthService) { }

  ngOnInit() {
    this.login_details = this.authService.getLoggedUser();
    this.locationsData = this.masterDataService.getProducts();
    this.districtsData = this.masterDataService.getDistricts();
    this.regionsData = this.masterDataService.getRegions();
    this.assignDefaultValues();
    this.UserProfileCols = [
      { field: 'SlNo', header: 'S.No.' },
      { field: 'Name', header: 'Name' },
      { field: 'Address', header: 'Address' },
      { field: 'Phone', header: 'Phone Number' },
      { field: 'Email', header: 'Email' },
      { field: 'LocationURL', header: 'Location URL' },
      { field: 'Region', header: 'Region' },
      { field: 'District', header: 'District' },
    ]
  }

  assignDefaultValues() {
    this.isEditClicked = false;
    this.UserProfileData = [];
    this.blockScreen = false;
    this.Username = this.login_details.RealName;
  }

  onSelect(type) {
    let regionSelection = [];
    let districtSeletion = [];
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
    }
  }

  onResetFields(field) {
    if (field === 'RM') {
      this.dcode = null;
    }
  }

  onSave(form: NgForm) {
    this.blockScreen = true;
    const params = {
      'UserId': (this.User_Id !== null && this.User_Id !== undefined) ? this.User_Id : 0,
      'LocationURL': this.LocationURL,
      'Dcode': (this.dcode !== undefined && this.dcode !== null) ? this.dcode.value : 0,
      'Rcode': (this.rcode !== undefined && this.rcode !== null) ? this.rcode.value : 0,
      'Name': this.Name,
      'Address': this.Address,
      'Phone': this.Phone,
      'FileName': this.FileName
      // 'User': this.user
    }
    this.restApiService.post('', params).subscribe(res => {
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
    form.controls.user_name.reset();
    form.controls.user_phno.reset();
    form.controls.user_dname.reset();
    form.controls.user_addr.reset();
    form.controls.user_mailid.reset();
    form.controls.user_loc.reset();
    form.controls.rm_name.reset();
    form.controls.rm_dname.reset();
    form.controls.rm_phno.reset();
    form.controls.rm_email.reset();
    form.controls.prof_pic.reset();
  }

  getUserProfile() {
    this.UserProfileData = [];
    this.restApiService.get('').subscribe(res => {
      if (res !== undefined && res !== null && res.length !== 0) {
        this.UserProfileData = res;
        let sno = 1;
        this.UserProfileData.forEach(t => {
          t.SlNo = sno;
          sno += 1;
        })
      }
    })
  }


  onRowSelect(row, index, form: NgForm) {
    if (row !== undefined && row !== null) {
      this.resetFormFields(form);
      this.User_Id = row.TId;
      this.LocationURL = row.location;
      this.regionOptions = [{ label: row.REGNNAME, value: row.Rcode }];
      this.rcode = { label: row.REGNNAME, value: row.Rcode };
      this.districtOptions = [{ label: row.Dname, value: row.Dcode }];
      this.dcode = { label: row.Dname, value: row.Dcode };
      this.Name = row.Name;
      this.Address = row.Address;
      this.Phone = row.Phone;
      this.Email = row.Email;
    }
  }

  onUpload(event) {
    for (let file of event.files) {
      this.uploadedFiles.push(file);
    }

    this.messageService.add({ severity: 'info', summary: 'File Uploaded', detail: '' });
  }

  onClear(form: NgForm) {
    form.reset();
    this.assignDefaultValues();
  }
}