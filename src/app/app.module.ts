import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import firebase from '@firebase/app';
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { environment } from '../environments/environment';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { FillDetailsComponent } from './fill-details/fill-details.component';
import { ExcelSheetsComponent } from './excel-sheets/excel-sheets.component';
import { ReactiveFormsModule, FormsModule, FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { AgGridModule } from 'ag-grid-angular';

import { DataProviderService } from './data-provider.service';

@NgModule({
  declarations: [
    AppComponent,
    FillDetailsComponent,
    ExcelSheetsComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebasex),
    AngularFireDatabaseModule,
    FormsModule,
    ReactiveFormsModule,
    AgGridModule.withComponents([])
  ],
  providers: [DataProviderService],
  bootstrap: [AppComponent]
})
export class AppModule { }
