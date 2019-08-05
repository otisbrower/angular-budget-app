import { Injectable, OnInit } from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';
import {DatePipe} from '@angular/common';
import * as firebase from 'firebase';
import { Account } from '../Common/models/account';
import {AngularFireDatabase} from '@angular/fire/database';
import {Observable} from 'rxjs';
import FieldValue = firebase.firestore.FieldValue;

@Injectable({
  providedIn: 'root'
})
export class FirebaseService implements OnInit{

  private accounts: object = {};
  private accountTypes: object;
  private transactionTypes: object;
  private transactionList: Observable<object>;
  private categoryList: Array<any> = [];
  private budgetCategories: object;
  private transactionIndex = 0;

  constructor(public db: AngularFirestore,
              public datePipe: DatePipe,
              public db2: AngularFireDatabase) {}

  ngOnInit(){
  }

  startService(){
    this.retrieveAccounts();
    this.retrieveAccountTypes();
    this.retrieveTransactionTypes();
    // this.retrieveTransactionList();
    this.retrieveBudgetCategories();
  }

  retrieveAccounts() {
    return this.db.collection('accounts').snapshotChanges().subscribe(resp => {
      if(resp){
        for(let account of resp) {
          let item = account.payload.doc.data() as Account;
          item.id = account.payload.doc.id;
          this.accounts[item.id] = item;
        }
      }
    });
  }

  retrieveAccountTypes(){
    this.db2.object('/account_type').query.once('value').then(resp => {
      this.accountTypes = resp.val();
    });
  }

  retrieveTransactionTypes(){
    this.db2.list('/transaction_type').query.once('value').then( resp => {
      this.transactionTypes = resp.val();
    })
  }

  retrieveTransactionList(){
    this.db.collection('transactionIndex').doc('P6hhRBHvC97LUx6HVqiG').valueChanges().subscribe(resp => {
      // console.log(resp);
      this.transactionIndex = resp['index'];
      console.log(this.transactionIndex);
    });
    let maxHistory = new firebase.firestore.Timestamp(firebase.firestore.Timestamp.now().seconds - (90*24*60*60), 0);
    return this.db.collection('transactions', ref => ref
      .where('transactionDate', '>=', maxHistory)
      .orderBy('transactionDate', 'desc')).valueChanges();
  }

  currentMonthTransactions(){
    let date = new Date();
    console.log(date);
    let day = parseInt(((date.getTime() - (date.getDate()*24*60*60*1000))/1000).toFixed(0));
    console.log(day);
    let timestamp = new firebase.firestore.Timestamp(day, 0);
    return this.db.collection('transactions', ref => ref.where('transactionDate', '>=',  timestamp)).valueChanges();
  }

  retrieveBudgetCategories(){
    this.db2.object('/budget_categories').query.once('value').then(resp => {
      this.budgetCategories = resp.val();
    });
  }

  retrieveBudgetPlan() {
    return this.db2.object('/budgetPlan').valueChanges();
  }

  setBudgetCategoryBudgetedAmount(mainCategory: string, category: string, value: number){
     return this.db2.object('/budgetPlan/' + mainCategory + '/' + category).set(value);
  }

  getUser(userKey){
    return this.db.collection('users').doc(userKey).snapshotChanges();
  }

  getAccountSummary() {
    return this.db.collection('accounts').snapshotChanges();
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

  deleteAccount(accountKey){
    console.log(accountKey);
    return this.db.collection('accounts').doc(accountKey).delete().then( res => {
      console.log(res);
    });
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
    if(value.fromAccountID != '') {
      this.updateFromAccount(value.fromAccountID, -value.transactionAmount);
    }
    if(value.toAccountID !== ''){
      this.updateToAccount(value.toAccountID, value.transactionAmount);
    }
    let batchAdd = [];
    if(value.fromAccountID !== '') {
      batchAdd.push({
        index: this.transactionIndex + batchAdd.length,
        userID: value.userID,
        transactionType: value.transactionType,
        mainCategory: value.mainCategory,
        subCategory: value.subCategory,
        fromAccount: value.fromAccount,
        toAccount: value.toAccount,
        transactionAmount: -value.transactionAmount,
        createDate: new Date().getDate(),
        transactionDate: value.transactionDate,
        description: value.description
      });
    }
    if(value.toAccountID !== '') {
      batchAdd.push({
        index: this.transactionIndex + batchAdd.length,
        userID: value.userID,
        transactionType: value.transactionType,
        mainCategory: value.mainCategory,
        subCategory: value.subCategory,
        fromAccount: value.fromAccount,
        toAccount: value.toAccount,
        transactionAmount: value.transactionAmount,
        createDate: new Date().getDate(),
        transactionDate: value.transactionDate,
        description: value.description
      });
    }

    let tempdb = firebase.firestore();
    let batch = tempdb.batch();
    batchAdd.forEach((doc) => {
      let ref = tempdb.collection('transactions').doc();
      this.db.doc('transactionIndex/P6hhRBHvC97LUx6HVqiG').update({index: FieldValue.increment(1)})
      batch.set(ref, doc);
    });

    batch.commit();
    return true;
    // let tempTrans = this.db.collection('transactions').add();
  }

  updateFromAccount(account, transactionAmount){

    return this.db.collection('accounts').doc(account).get().subscribe(resp => {
      let tempAcctData = resp.data();
      tempAcctData.currentBalance = tempAcctData.currentBalance + transactionAmount;
      this.db.collection('accounts').doc(account).set(tempAcctData);
    });
  }

  updateToAccount(account, transactionAmount){
    return this.db.collection('accounts').doc(account).get().subscribe( resp => {
      let tempAcctData = resp.data();
      tempAcctData.currentBalance = tempAcctData.currentBalance + transactionAmount;
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
  getBudgetCategoryTypes() {
    return this.budgetCategories;
  }

  getBudgetSubcategory(key) {
    return this.db.collection('budget_categories').doc(key).collection('subcategory', ref =>
      ref.orderBy('index')).snapshotChanges();
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
