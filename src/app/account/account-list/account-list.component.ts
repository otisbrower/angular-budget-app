import {AfterContentChecked, Component, OnInit} from '@angular/core';
import {FirebaseService} from '../../services/firebase.service';
import {Router} from '@angular/router';
import {DomSanitizer} from '@angular/platform-browser';
import {forEach} from '@angular/router/src/utils/collection';
import {FirebaseObjectObservable} from '@angular/fire/database-deprecated';

import { Account } from '../../Common/models/account';
import { AccountType } from '../../Common/models/account-type';

@Component({
  selector: 'app-account-list',
  templateUrl: './account-list.component.html',
  styleUrls: ['./account-list.component.scss']
})
export class AccountListComponent implements OnInit{

  ageValue: number = 0;
  searchValue: string = "";
  accounts: Array<Account>;
  filtered_accounts: Array<Account>;
  accountTypes: object;
  icons: Array<AccountType>;

  constructor(
    public firebaseService: FirebaseService,
    private router: Router,
    private sanitizer: DomSanitizer
  ) { }

  ngOnInit() {
    this.getAccounts();
    this.accountTypes = this.firebaseService.getAccountTypes();
    console.log(this.accountTypes['401K']['image']);
  }


  getAccounts(){
    this.accounts = this.firebaseService.getAccounts();
    this.filtered_accounts = this.firebaseService.getAccounts();
  }

  viewDetails(item){
    this.router.navigate(['/updateAccount/'+ item.id]);
  }

  capitalizeFirstLetter(value){
    return value.charAt(0).toUpperCase() + value.slice(1);
  }

  searchByName(){

  }

  rangeChange(event){
    this.filtered_accounts = this.accounts.filter(item => item.accountName.toLowerCase().includes(event));
  }




  sanitize(asset: string){
    return this.accountTypes[asset]['image'];
  }
}
