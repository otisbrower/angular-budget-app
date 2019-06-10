import { Component, OnInit } from '@angular/core';
import {FirebaseService} from '../../../services/firebase.service';

@Component({
  selector: 'app-account-summary',
  templateUrl: './account-summary.component.html',
  styleUrls: ['./account-summary.component.css']
})
export class AccountSummaryComponent implements OnInit {

  accountData: object = {};
  depositAccounts: object;
  debtAccounts: object;
  retirementAccounts: object;
  otherAccounts: object;
  constructor(private firebaseService: FirebaseService) { }

  ngOnInit() {
    this.getAccountData();
  }

  getAccountData(){
    this.firebaseService.getAccountSummary().subscribe( resp => {
      if(resp){
        for(let acct of resp){
          let item = acct.payload.doc.data();
          item['id'] = acct.payload.doc.id;
          this.accountData[item['id']] = item;
        }
        this.seperateAccounts();
      }
    })
  }

  //Depsoit Accounts
  seperateAccounts(){
    let depositList = ['Checking', 'Savings', 'HSA'];
    let debtList = ['Auto Loan', 'Credit Card', 'Mortgage', 'Personal Loan', 'Student Loan'];
    let retireList = ['401K', 'IRA', 'Roth IRA'];

    this.clearLists();

    for (let account in this.accountData){
      if(depositList.indexOf(this.accountData[account]['accountType']) !== -1){
        this.depositAccounts[account] = this.accountData[account];
      }else if(debtList.indexOf(this.accountData[account]['accountType']) !== -1){
        this.debtAccounts[account] = this.accountData[account]
      }else if(retireList.indexOf(this.accountData[account]['accountType']) !== -1){
        this.retirementAccounts[account] = this.accountData[account];
      }else{
        this.otherAccounts[account] = this.accountData[account];
      }
    }
  }

  clearLists(){
    this.depositAccounts = {};
    this.debtAccounts = {};
    this.retirementAccounts = {};
    this.otherAccounts = {};
  }

  accountListLength(list: object){
    return Object.keys(list).length;
  }

}
