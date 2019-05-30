import { Injectable, OnInit } from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';
import {DatePipe} from '@angular/common';
import * as firebase from 'firebase/app';
import Timestamp = firebase.firestore.Timestamp;
import { Account } from '../Common/models/account';
import { AccountType } from '../Common/models/account-type';
import { TransactionType } from '../Common/models/transaction-type';
import {Transaction} from '../Common/models/transaction';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService implements OnInit{

  private accounts: Array<Account> = [];
  private accountTypes: Array<AccountType> = [];
  private transactionTypes: Array<TransactionType> = [];
  private transactionList: Array<Transaction> = [];
  private categoryList: Array<any> = [];

  constructor(public db: AngularFirestore,
              public datePipe: DatePipe) {}

  ngOnInit(){
    this.retrieveAccounts();
  }

  startService(){
    this.retrieveAccounts();
    this.retrieveAccountTypes();
    this.retrieveTransactionTypes();
    this.retrieveTransactionList();
    this.retrieveBudgetCategories();
  }

  retrieveAccounts() {
    this.db.collection('accounts').snapshotChanges().subscribe(resp => {
      if(resp){
        for(let account of resp) {
          let item = account.payload.doc.data() as Account;
          item.id = account.payload.doc.id;
          this.accounts.push(item);
        }
      }
    });
  }

  retrieveAccountTypes(){
    return this.db.collection('account_type').snapshotChanges().subscribe(resp => {
      if(resp){
        for(let type of resp){
          let item = type.payload.doc.data() as AccountType;
          item.id = type.payload.doc.id;
          this.accountTypes.push(item);
        }
      }
    })
  }

  retrieveTransactionTypes(){
    return this.db.collection('transaction_type').snapshotChanges().subscribe( resp => {
      if(resp){
        for(let type of resp){
          let item = type.payload.doc.data() as TransactionType;
          item.id = type.payload.doc.id;
          this.transactionTypes.push(item);
        }
      }
    });
  }

  retrieveTransactionList(){
    this.db.collection('transactions', ref => ref.orderBy('transactionDate', 'desc'))
      .snapshotChanges().subscribe( resp => {
        if(resp){
          for(let trans of resp){
            let item = trans.payload.doc.data() as Transaction;
            item.id = trans.payload.doc.id;
            this.transactionList.push(item);
          }
        }
    });
  }

  retrieveBudgetCategories(){
    this.db.collection('budget_categories').snapshotChanges().subscribe(resp => {
      if(resp){
        for(let cat of resp){
          console.log(cat.payload.doc.data());
        }
      }
    })
  }

  getUser(userKey){
    return this.db.collection('users').doc(userKey).snapshotChanges();
  }

  getAccount(accountKey) {
    return this.db.collection('accounts').doc(accountKey).snapshotChanges();
  }

  updateUser(userKey, value){
    value.nameToSearch = value.name.toLowerCase();
    return this.db.collection('users').doc(userKey).set(value);
  }

  updateAccount(accountKey, value) {
    return this.db.collection('accounts').doc(accountKey).set(value);
  }

  deleteUser(userKey){
    return this.db.collection('users').doc(userKey).delete();
  }

  getUsers(){
    return this.db.collection('users').snapshotChanges();
  }

  searchUsers(searchValue){
    return this.db.collection('users',ref => ref.where('nameToSearch', '>=', searchValue)
      .where('nameToSearch', '<=', searchValue + '\uf8ff'))
      .snapshotChanges()
  }

  searchUsersByAge(value){
    return this.db.collection('users',ref => ref.orderBy('age').startAt(value)).snapshotChanges();
  }


  createUser(value, avatar){
    return this.db.collection('users').add({
      name: value.name,
      nameToSearch: value.name.toLowerCase(),
      surname: value.surname,
      age: parseInt(value.age),
      avatar: avatar
    });
  }

  createAccount(value){
    return this.db.collection('accounts').add(value);
  }

  createTransaction(value) {
    console.log(value);
    if(value.fromAccountID != '') {
      this.updateFromAccount(value.fromAccountID, value.transactionAmount);
    }
    if(value.toAccountID !== ''){
      this.updateToAccount(value.toAccountID, value.transactionAmount);
    }

    return this.db.collection('transactions').add({
      userID: value.userID,
      transactionType: value.transactionType,
      mainCategory: value.mainCategory,
      subCategory: value.subCategory,
      fromAccount: value.fromAccount,
      toAccount: value.toAccount,
      transactionAmount: value.transactionAmount.replace('$', '') as number,
      createDate: new Date().getDate(),
      transactionDate: value.transactionDate,
      description: value.description
    });
  }

  updateFromAccount(account, transactionAmount){

    return this.db.collection('accounts').doc(account).get().subscribe(resp => {
      let tempAcctData = resp.data();
      tempAcctData.currentBalance = tempAcctData.currentBalance - transactionAmount.replace('$', '');
      this.db.collection('accounts').doc(account).set(tempAcctData);
    });
  }

  updateToAccount(account, transactionAmount){
    return this.db.collection('accounts').doc(account).get().subscribe( resp => {
      let tempAcctData = resp.data();
      tempAcctData.currentBalance = tempAcctData.currentBalance + parseFloat(transactionAmount.replace('$', ''));
      this.db.collection('accounts').doc(account).set(tempAcctData);
    })
  }

  getAccounts(){
    return this.accounts;
  }

  getAccountTypes() {
    return this.accountTypes;
  }

  getTransactionTypes() {
    return this.transactionTypes;
  }
  getBudgetCategoryTypes(flag?: boolean) {
    if(flag === undefined){
      return this.db.collection('budget_categories', ref =>
        ref.orderBy('index')).snapshotChanges();
    }
    return this.db.collection('budget_categories', ref =>
      ref.where('debit_deposit', '==', flag).orderBy('index')).snapshotChanges();
  }

  getBudgetSubcategory(key) {
    return this.db.collection('budget_categories').doc(key).collection('subcategory', ref =>
      ref.orderBy('index')).snapshotChanges();
  }
  searchAccounts(value){
    return this.db.collection('accounts', ref => ref.where('accountNameToSearch', '>=', value)
      .where('accountNameToSearch', '<=', value + '\uf8ff')).snapshotChanges();
  }
  getFromAccounts(value){
    let searchPath = 'from' + value;
    return this.db.collection('accounts', ref => ref.where(searchPath, '==', true)).snapshotChanges();
  }

  getToAccounts(value){
    let searchPath = 'to' + value;
    return this.db.collection('accounts', ref => ref.where(searchPath, '==', true)).snapshotChanges();
  }

  getRecentTransactions(){


    return this.transactionList;
  }

}
