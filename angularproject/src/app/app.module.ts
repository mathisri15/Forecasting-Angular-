import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {HttpClientModule} from '@angular/common/http'
import { DropDownListModule } from '@syncfusion/ej2-angular-dropdowns';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations'
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import {MatInputModule} from '@angular/material/input';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { FileuploadComponent } from './fileupload/fileupload.component';
import { FormsModule } from '@angular/forms';

import { PredictComponent } from './predict/predict.component';
import { PagenotfoundComponent } from './pagenotfound/pagenotfound.component';
import {MatButtonModule} from '@angular/material/button'
import {MatToolbarModule} from '@angular/material/toolbar'
import {MatSidenavModule} from '@angular/material/sidenav'
import {MatListModule} from '@angular/material/list'
import {MatGridListModule} from '@angular/material/grid-list'
import {MatCardModule} from '@angular/material/card'
import {LayoutModule} from '@angular/cdk/layout'
import {MatMenuModule} from '@angular/material/menu'
import {MatSnackBarModule} from '@angular/material/snack-bar'
import {MatSlideToggleModule} from '@angular/material/slide-toggle'
import {MatButtonToggleModule} from '@angular/material/button-toggle'
import { AuthGuard } from './shared/auth.guard';



@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    FileuploadComponent,
   
    PredictComponent,
    PagenotfoundComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    RouterModule,
    HttpClientModule,
    DropDownListModule,
    BrowserModule,
    BrowserAnimationsModule,
    MatButtonModule,
    LayoutModule,
    MatToolbarModule,
    MatSidenavModule,
    MatListModule,
    MatGridListModule,
    MatCardModule,
    MatMenuModule,
    MatSnackBarModule,
    MatSlideToggleModule,
    ReactiveFormsModule,
    MatButtonToggleModule
  ],
  exports: [
    MatSlideToggleModule,
    

  ],
  providers: [AuthGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
