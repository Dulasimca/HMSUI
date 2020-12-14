import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { LoginComponent } from './login/login.component';
import { AuthService } from './services/auth.service';
import { RestAPIService } from './services/restAPI.service';
import { ReactiveFormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';
import { PanelModule } from 'primeng/panel';
import { BlockUIModule } from 'primeng/blockui';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { MenubarModule } from 'primeng/menubar';
import { ChartModule } from 'primeng/chart';


import { AppComponent } from './app.component';
import { TopbarComponent } from './topbar/topbar.component';
import { FooterComponent } from './footer/footer.component';
import { HomePageComponent } from './home-page/home-page.component';
import { MenubarComponent } from './menu-bar/menubar.component';



@NgModule({
  declarations: [
    AppComponent,
    TopbarComponent,
    FooterComponent,
    LoginComponent,
    HomePageComponent,
    MenubarComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    ToastModule,
    FormsModule,
    InputTextModule,
    PanelModule,
    ButtonModule,
    ReactiveFormsModule,
    ButtonModule,
    BlockUIModule,
    ProgressSpinnerModule,
    MenubarModule,
    ChartModule
  ],
  providers: [AuthService, RestAPIService, MessageService],
  bootstrap: [AppComponent]
})
export class AppModule { }
