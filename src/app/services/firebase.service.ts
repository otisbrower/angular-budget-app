import { Injectable } from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';
import {DatePipe} from '@angular/common';
import * as firebase from 'firebase/app';
import Timestamp = firebase.firestore.Timestamp;

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  constructor(public db: AngularFirestore,
              public datePipe: DatePipe) {}

  getAvatars(){
    return this.db.collection('/avatar').valueChanges()
  }

  getUser(userKey){
    return this.db.collection('users').doc(userKey).snapshotChanges();
  }

  getAccount(accountKey) {
    return this.db.collection('accounts').doc(accountKey).snapshotChanges();
  }

  getCategorybyId(isSub: boolean, docKey: string, mainKey?: string){
    if(isSub){
      return this.db.collection('budget_categories').doc(mainKey).ref.collection('subCategory').doc(docKey).get();
    }
    this.db.collection('budget_categories').doc(docKey).snapshotChanges();
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
    if(value.fromAccount !== ''){
      this.updateFromAccount(value.fromAccount, value.transactionAmount);
    }
    if(value.toAccount !== '') {
      this.updateToAccount(value.toAccount, value.transactionAmount);
    }
    return this.db.collection('transactions').add({
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
    return this.db.collection('accounts').snapshotChanges();
  }

  getAccountTypes() {
    return this.db.collection('account_type').valueChanges();
  }

  getTransactionTypes() {
    return this.db.collection('transaction_type').valueChanges();
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

  getRecentTransactions(days: number){
    let range = new Date().getTime() - (days * 24* 60 * 60 * 1000);
    console.log(range);
    let searchDate = Timestamp.fromMillis(range);
    return this.db.collection('transactions', ref => ref.where('transactionDate', '>', searchDate).orderBy('transactionDate', 'desc')).snapshotChanges();
  }

}
