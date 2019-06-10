import {AfterContentInit, Component, OnInit} from '@angular/core';
import {FirebaseService} from '../../services/firebase.service';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {CurrencyPipe} from '@angular/common';
import {Router} from '@angular/router';
import {MatSnackBar} from '@angular/material';


@Component({
  selector: 'app-main-transactions',
  templateUrl: './main-transactions.component.html',
  styleUrls: ['./main-transactions.component.css']
})
export class MainTransactionsComponent implements OnInit, AfterContentInit {
  transactionForm: FormGroup;
  accountList: any = [];
  transactionTypes: object;
  budgetCategories: object;
  filteredCategories: object = {};
  subCategories: Array<any>;
  fromAccounts: object;
  toAccounts: object;
  debitDepositFlag: boolean = false;
  amountInput = 0.00;


  validateMessages = {
    'transactionType': [
      { type: 'required', message: 'Transaction Type is required.'},
    ],
    'mainCategory': [
      { type: 'required', message: 'Main Category is required.'},
    ],
    'subCategory': [
      { type: 'required', message: 'Subcategory is required'},
    ],
    'fromAccount': [
      { type: 'required', message: 'From Account is required.'},
    ],
    'toAccount': [
      { type: 'required', message: 'To Account is required.'},
    ],
    'transactionAmount': [
      { type: 'required', message: 'Transaction Amount is required.'},
    ],
    'transactionDate': [
      { type: 'required', message: 'Transaction Date is required.'},
    ],
    'description': [
      { type: 'required', message: 'Description is required.'},
    ]
  };

  constructor(public firebaseService: FirebaseService,
              private formBuilder: FormBuilder,
              private currencyPipe: CurrencyPipe,
              private router: Router,
              private snackBar: MatSnackBar) { }

  ngOnInit() {
    this.createForm();
    this.accountList = this.firebaseService.getAccounts();
    this.transactionTypes = this.firebaseService.getTransactionTypes();
    this.budgetCategories = this.firebaseService.getBudgetCategoryTypes();
  }

  ngAfterContentInit() {
    this.onTransactionTypeSelect(this.transactionForm.getRawValue()['transactionType']);
  }

  createForm() {
    this.transactionForm = this.formBuilder.group({
      userID: new FormControl(''),
      transactionType: new FormControl( '', Validators.required),
      mainCategory: new FormControl( '', Validators.required),
      subCategory: new FormControl( '', Validators.required),
      fromAccount: new FormControl(''),
      fromAccountID: new FormControl(''),
      toAccount: new FormControl(''),
      toAccountID: new FormControl(''),
      transactionAmount: new FormControl( 0.00, Validators.required),
      createDate: new FormControl(''),
      transactionDate: new FormControl('', Validators.required),
      description: new FormControl('', Validators.required)
    });
  }

  onCategorySelect(mainCategory){
    this.subCategories = this.budgetCategories[mainCategory];
  }

  onTransactionTypeSelect(type) {
    if(type === 'Debit'){
      this.transactionForm.controls['toAccount'].setValue('');
      this.transactionForm.controls['toAccountID'].setValue('');
      this.transactionForm.markAsPristine();
      this.debitDepositFlag = false;
    } else if(type === 'Deposit'){
      this.transactionForm.controls['fromAccount'].setValue('');
      this.transactionForm.controls['fromAccountID'].setValue('');
      this.transactionForm.markAsPristine();
      this.debitDepositFlag = true;
    } else {
      this.debitDepositFlag = false;
    }
    if(type === 'Transfer'){
      this.filteredCategories = {};
      for(let category in this.budgetCategories){
        if(category === 'Transfer'){
          this.filteredCategories[category] = this.budgetCategories[category];
        }
      }
    } else if(!this.debitDepositFlag) {
      this.filteredCategories = {};
      for (let category in this.budgetCategories) {
        if(category !== 'Income'){
          this.filteredCategories[category] = this.budgetCategories[category];
        }
      }
    }else{
      this.filteredCategories = {};
      for(let category in this.budgetCategories){
        if(category === 'Income'){
          this.filteredCategories[category] = this.budgetCategories[category];
        }
      }
    }
    this.transactionForm.controls['mainCategory'].setValue('');
    this.transactionForm.controls['subCategory'].setValue('');
    let from = 'from' + type;
    let to = 'to' + type;
    this.fromAccounts = {};
    this.toAccounts = {};
    for(let account in this.accountList){
      if(this.accountList[account][from] === true){
        this.fromAccounts[account] = this.accountList[account];
      }
      if(this.accountList[account][to] === true){
        this.toAccounts[account] = this.accountList[account];
      }
    }
  }

  updateAmount($event) {
    this.transactionForm.get('transactionAmount').setValue(this.currencyPipe.transform($event, 'USD', '', '0.2-2'));
  }

  setFromToAccounts(value: string) {
    if(value === ''){
      return '';
    }
    return this.accountList[value]['accountName'];
  }

  onSubmit(value: object){
    value['fromAccount'] = this.setFromToAccounts(value['fromAccountID']);
    value['toAccount'] = this.setFromToAccounts(value['toAccountID']);
    value['transactionAmount'] = Math.abs(parseFloat(value['transactionAmount']));
    if(this.firebaseService.createTransaction(value)){
      this.transactionForm.reset();
      this.snackBar.open('Transaction Added!');
      this.router.navigateByUrl('transactions', {skipLocationChange: true});
    }
  }
}
