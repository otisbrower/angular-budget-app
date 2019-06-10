import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {MatDialog} from '@angular/material';
import {FirebaseService} from '../../services/firebase.service';
import {Router} from '@angular/router';
import {accountTypes} from '../../Common/Globals/AccountTypes';
import {FirebaseObjectObservable} from '@angular/fire/database-deprecated';
import {Observable} from 'rxjs';
import { AccountType } from '../../Common/models/account-type';

@Component({
  selector: 'app-new-account',
  templateUrl: './new-account.component.html',
  styleUrls: ['./new-account.component.css']
})
export class NewAccountComponent implements OnInit {

  accountForm: FormGroup;
  objectKeys = Object.keys;
  accountTypeList: object;
  accountNeg = ['Credit Card', 'Mortgage', 'Personal Loan', 'Student Loan', 'Auto Loan'];
  validationMessages = {
    'accountName': [
      { type: 'required', message: 'Account Name is required'}
    ],
    'accountType': [
      {type: 'required', message: 'Account Type is required'}
    ],
    'currentBalance': [
      { type: 'required', message: 'Current Account Balance is Required'}
    ],
    'monthEndBalance': [
      {type: 'required', message: 'Month End Balance is required'}
    ],
    'ytdDeposit': [
      {type: 'required', message: 'Year-To-Date Deposit is required'}
    ],
    'ytdDebit': [
      { type: 'required', message: 'Year-To-Date Debit Total is required'}
      ]
  }
  constructor(private fb: FormBuilder,
              public dialog: MatDialog,
              private router: Router,
              public firebaseService: FirebaseService) { }

  ngOnInit() {
    this.createForm();
     this.accountTypeList = this.firebaseService.getAccountTypes();
  }

  createForm() {
    this.accountForm = this.fb.group({
      accountName: ['', Validators.required],
      accountType: ['', Validators.required],
      currentBalance: ['', Validators.required],
      monthEndBalance: 0,
      ytdDeposit: 0,
      ytdDebit: 0
    });
  }

  resetFields() {
    this.accountForm = this.fb.group({
      accountName: new FormControl('', Validators.required),
      accountType: new FormControl('', Validators.required),
      currentBalance: new FormControl('', Validators.required),
      monthEndBalance: new FormControl(0, Validators.required),
      ytdDeposit: new FormControl(0, Validators.required),
      ytdDebit: new FormControl(0, Validators.required)
    })
  }

  onSubmit(value) {
    if( this.accountNeg.indexOf(value.accountType) !== -1 && value.currentBalance > 0){
      value.currentBalance = (-1) * value.currentBalance;
    }
    let accountType = this.accountTypeList[value.accountType];
    value.toDebit = accountType.toDebit;
    value.fromDebit = accountType.fromDebit;
    value.toDeposit = accountType.toDeposit;
    value.fromDeposit = accountType.fromDeposit;
    value.toPayment = accountType.toPayment;
    value.fromPayment = accountType.fromPayment;
    value.toTransfer = accountType.toTransfer;
    value.fromTransfer = accountType.fromTransfer;
    value.currentBalance = parseFloat(value.currentBalance);

    console.log(value);

    this.firebaseService.createAccount(value).then(res => {
      this.resetFields();
      this.router.navigate(['/accountList']);
      }
    );
  }

}
