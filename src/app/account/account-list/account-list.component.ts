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
  accounts: object;
  filtered_accounts: object;
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
  }


  getAccounts(){
    this.accounts = this.firebaseService.getAccounts();
    console.log(this.accounts);
    this.filtered_accounts = this.accounts;
  }

  viewDetails(item){
    this.router.navigate(['/updateAccount/'+ item]);
  }

  capitalizeFirstLetter(value){
    return value.charAt(0).toUpperCase() + value.slice(1);
  }

  searchByName(){

  }

  rangeChange(event){
    this.filtered_accounts = {};
    for(let account in this.accounts){
      if(this.accounts[account].toLowerCase().includes(event.toLowerCase())){
        this.filtered_accounts[account] = this.accounts[account];
      }
    }
  }




  sanitize(asset: string){
    return this.accountTypes[asset]['image'];
  }
}
