import {AfterContentInit, AfterViewChecked, Component, Input, OnInit} from '@angular/core';
import {FirebaseService} from '../../services/firebase.service';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {CurrencyPipe} from '@angular/common';
import {main} from '@angular/compiler-cli/src/main';


@Component({
  selector: 'app-main-transactions',
  templateUrl: './main-transactions.component.html',
  styleUrls: ['./main-transactions.component.css']
})
export class MainTransactionsComponent implements OnInit, AfterContentInit {
  transactionForm: FormGroup;
  accountList: any = [];
  transactionTypes: object;
  budgetCategories: Array<any>;
  subCategories: Array<any>;
  fromAccounts: Array<any>;
  toAccounts: Array<any>;
  debitDepositFlag: boolean = false;

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

  constructor(private firebaseService: FirebaseService,
              private formBuilder: FormBuilder,
              private currencyPipe: CurrencyPipe) { }

  ngOnInit() {
    this.createForm();
    this.firebaseService.getAccounts().subscribe(resp => {
      this.accountList = resp;
    });
    this.firebaseService.getTransactionTypes().subscribe( resp => {
      this.transactionTypes = resp;
    });
    this.getMainCategories();
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
      transactionAmount: new FormControl( '', Validators.required),
      createDate: new FormControl(''),
      transactionDate: new FormControl('', Validators.required),
      description: new FormControl('', Validators.required)
    });
  }

  onCategorySelect(mainCategory){
    console.log(mainCategory);
    for(let mainCat of this.budgetCategories){
      if (mainCat.payload.doc.data().main_category === mainCategory){
        this.firebaseService.getBudgetSubcategory(mainCat.payload.doc.id).subscribe( resp => {
          this.subCategories = resp;
          for(let cat of this.subCategories){
          console.log(cat.payload.doc.data().category);
          }
        })
      }
    }
  }

  getMainCategories(flag: boolean = false) {
    this.firebaseService.getBudgetCategoryTypes(flag).subscribe(resp => {
      this.budgetCategories = resp;
    });
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
    this.transactionForm.controls['mainCategory'].setValue('');
    this.transactionForm.controls['subCategory'].setValue('');
    this.getMainCategories(this.debitDepositFlag);
    this.firebaseService.getFromAccounts(type).subscribe(resp => this.fromAccounts = resp);

    this.firebaseService.getToAccounts(type).subscribe( resp => this.toAccounts = resp);
  }

  updateAmount($event) {
    this.transactionForm.get('transactionAmount').setValue(this.currencyPipe.transform($event, 'USD', 'symbol', '0.2-2'));
  }

  setFromAccount(value) {
    this.firebaseService.getAccount(value).subscribe(resp => {
      let item = resp.payload.data();
      console.log(item['accountName']);
      this.transactionForm.controls['fromAccount'].setValue(item['accountName']);
    });
  }

  setToAccount(value) {
    this.firebaseService.getAccount(value).subscribe( resp => {
      let item = resp.payload.data();
      console.log(item['accountName']);
      this.transactionForm.controls['toAccount'].setValue(item['accountName']);
    })
  }

  onSubmit(value: object){
    this.firebaseService.createTransaction(value).then(resp =>{
      if(resp){
        this.transactionForm.reset();
        alert('Transaction Added');
      }
    });
  }
}
