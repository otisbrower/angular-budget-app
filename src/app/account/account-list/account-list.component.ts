import { Component, OnInit } from '@angular/core';
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
export class AccountListComponent implements OnInit {

  ageValue: number = 0;
  searchValue: string = "";
  accounts: Array<Account>;
  filtered_accounts: Array<Account>;
  icons: Array<AccountType>;

  constructor(
    public firebaseService: FirebaseService,
    private router: Router,
    private sanitizer: DomSanitizer
  ) { }

  ngOnInit() {
    this.getAccounts();
    this.icons = this.firebaseService.getAccountTypes();
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
    for(var item in this.icons){
      if(this.icons[item]['type'] === asset){
        return this.icons[item]['image'];
      }
    }
    return null;
  }
}
