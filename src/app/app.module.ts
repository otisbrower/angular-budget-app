import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { NewUserComponent } from './new-user/new-user.component';
import { HomeComponent } from './home/home.component';

import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { environment } from '../environments/environment';
import { FirebaseService } from './services/firebase.service';

import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {
  MatButtonModule,
  MatInputModule,
  MatSliderModule,
  MatDialogModule,
  MatDatepickerModule,
  MatNativeDateModule, MAT_DATE_LOCALE, MAT_DATE_FORMATS, NativeDateModule
} from '@angular/material';
import {rootRouterConfig} from './app-routing.module';
import { NewAccountComponent } from './account/new-account/new-account.component';
import { AccountListComponent } from './account/account-list/account-list.component';
import { BsNavbarComponent } from './bs-navbar/bs-navbar.component';
import { UpdateAccountComponent } from './account/update-account/update-account.component';
import { DeleteAccountComponent } from './account/delete-account/delete-account.component';
import { MainTransactionsComponent } from './transaction/main-transactions/main-transactions.component';
import { CurrencyMaskPipe } from './Common/Globals/currency-mask.pipe';
import {CurrencyPipe, DatePipe} from '@angular/common';
import { RecentTransactionListComponent } from './transaction/recent-transaction-list/recent-transaction-list.component';
import {AngularFireDatabaseModule} from '@angular/fire/database';


@NgModule({
  declarations: [
    AppComponent,
    NewUserComponent,
    HomeComponent,
    NewAccountComponent,
    AccountListComponent,
    BsNavbarComponent,
    UpdateAccountComponent,
    DeleteAccountComponent,
    MainTransactionsComponent,
    CurrencyMaskPipe,
    RecentTransactionListComponent
  ],
  entryComponents: [],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forRoot(rootRouterConfig, { useHash: false }),
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    AngularFireDatabaseModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatInputModule,
    MatSliderModule,
    MatDialogModule,
    MatDatepickerModule,
    MatNativeDateModule,
    NativeDateModule
  ],
  providers: [
    FirebaseService,
    CurrencyPipe,
    DatePipe,
    {provide: MAT_DATE_LOCALE, useValue:'en-US'}
    // {provide: MAT_DATE_FORMATS, useValue: MY_NATIVE_DATE_FORMATS}
  ],
  bootstrap: [
    AppComponent
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ]
})
export class AppModule { }
