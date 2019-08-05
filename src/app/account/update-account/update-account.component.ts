import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {FirebaseService} from '../../services/firebase.service';
import {ActivatedRoute, ParamMap, Router} from '@angular/router';
import {MatDialog} from '@angular/material';
import {switchMap} from 'rxjs/operators';
import {CurrencyPipe} from '@angular/common';

@Component({
  selector: 'app-update-account',
  templateUrl: './update-account.component.html',
  styleUrls: ['./update-account.component.scss']
})
export class UpdateAccountComponent implements OnInit {

  updateForm: FormGroup;
  accountTypeList: object;
  item: any;
  accountBalance: number;
  accountNeg = ['Credit Card', 'Mortgage', 'Personal Loan', 'Student Loan', 'Auto Loan'];


  validation_messages = {
    'accountName' : [
      {type: 'required', message: 'Account Name is required.'}
    ],
    'accountType': [
      {type: 'required', message: 'Account Type is required.'}
    ],
    'currentBalance': [
      {type: 'required', message: 'Account Balance is required.'}
    ]

  };

  constructor(public firebaseService: FirebaseService,
              private route: ActivatedRoute,
              private formBuilder: FormBuilder,
              private router: Router,
              private dialog: MatDialog,
              private currencyPipe: CurrencyPipe) { }

  ngOnInit() {
    this.getRouteData();
    this.getAccountList();
  }

  createForm() {
    this.accountBalance = this.item.currentBalance;
    this.updateForm = this.formBuilder.group({
      accountName: [this.item.accountName, Validators.required],
      accountType: [this.item.accountType, Validators.required],
      currentBalance: [this.item.currentBalance, Validators.required]
    });
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
    value.currentBalance = Number(value.currentBalance);
    value.monthEndBalance = this.item.monthEndBalance;
    value.ytdDebit = this.item.ytdDebit;
    value.ytdDeposit = this.item.ytdDeposit;
    console.log(value);
    this.firebaseService.updateAccount(this.item.id, value).then( res => {
      this.router.navigate(['/accountList']);
    })
  }

  getAccountList() {
    this.accountTypeList = this.firebaseService.getAccountTypes();
  }

  getRouteData() {

    let tempData = this.route.snapshot.paramMap.get('id');

    this.firebaseService.getAccount(tempData).subscribe(resp => {
      this.item = resp.payload.data();
      this.item.id = resp.payload.id;
      this.createForm();
    });
  }
  updateAmount($event) {
    this.updateForm.get('currentBalance').setValue(this.currencyPipe.transform($event, 'USD', '', '0.2-2'));
  }

  deleteAccount(){
    console.log(this.item.id);
    this.firebaseService.deleteAccount(this.item.id).then(res => {
      console.log(res);
      this.router.navigate(['/accountList']);
    });
  }
}
