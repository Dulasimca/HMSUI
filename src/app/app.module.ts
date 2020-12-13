import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { TabMenuModule } from 'primeng/tabmenu';
import { ChartModule } from 'primeng/chart';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { DropdownModule } from 'primeng/dropdown';
import { CheckboxModule } from 'primeng/checkbox';
import { SidebarModule } from 'primeng/sidebar';
import { RadioButtonModule } from 'primeng/radiobutton';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { CalendarModule } from 'primeng/calendar';
import { ToastModule } from 'primeng/toast';
import { SelectButtonModule } from 'primeng/selectbutton';
import { BlockUIModule } from 'primeng/blockui';
import { SplitButtonModule } from 'primeng/splitbutton';
import { MenubarModule } from 'primeng/menubar';
import { DialogModule } from 'primeng/dialog';
import { PanelModule } from 'primeng/panel';

import { AppComponent } from './app.component';
import { TopbarComponent } from './topbar/topbar.component';
import { FooterComponent } from './footer/footer.component';
import { LoginComponent } from './login/login.component';
import { AppRoutingModule } from './app-routing.module';
import { TableModule } from 'primeng/table';
import { AuthService } from './services/auth.service';
import { RestAPIService } from './services/restAPI.service';
import { MessageService } from 'primeng/api';
import { DatePipe } from '@angular/common';
import { MasterDataService } from './masters-services/master-data.service';
import { NewTicketComponent } from './Ticket/new-ticket/new-ticket.component';
import { TicketReportComponent } from './reports/ticket-report/ticket-report.component';
import { MenubarComponent } from './menubar/menubar.component';



@NgModule({
  declarations: [
    AppComponent,
    TopbarComponent,
    FooterComponent,
    LoginComponent,
    NewTicketComponent,
    TicketReportComponent,
    MenubarComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    DropdownModule,
    CheckboxModule,
    TabMenuModule,
    TableModule,
    ChartModule,
    FormsModule,
    InputTextModule,
    InputTextareaModule,
    RadioButtonModule,
    PanelModule,
    ButtonModule,
    ReactiveFormsModule,
    SidebarModule,
    ProgressSpinnerModule,
    CalendarModule,
    OverlayPanelModule,
    ToastModule,
    SelectButtonModule,
    BlockUIModule,
    SplitButtonModule,
    MenubarModule,
    DialogModule
  ],
  providers: [AuthService, RestAPIService, DatePipe, MessageService, MasterDataService],
  bootstrap: [AppComponent]
})
export class AppModule { }
