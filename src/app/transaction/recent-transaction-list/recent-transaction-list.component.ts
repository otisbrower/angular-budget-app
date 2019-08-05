import {Component, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {FirebaseService} from '../../services/firebase.service';
import { DatePipe} from '@angular/common';
import * as firebase from 'firebase';

@Component({
  selector: 'app-recent-transaction-list',
  templateUrl: './recent-transaction-list.component.html',
  styleUrls: ['./recent-transaction-list.component.css']
})
export class RecentTransactionListComponent implements OnInit {
  historyDays = [5, 15, 30, 60, 90];

  transactionList: Array<object> = [];
  filteredTransactionList: Array<object> = [];
  private firstPass = true;
  public days = 30;


  constructor(private firebaseService: FirebaseService,
              public datePipe: DatePipe) { }

  ngOnInit() {
    this.getTransactions();
  }

  getTransactions(){
    this.firebaseService.retrieveTransactionList().subscribe(resp => {
      if(resp){
        this.transactionList = [];
        for(let trans of resp){
          this.transactionList.push(trans);
        }
        if(this.firstPass){
          this.onSelectDateRange(30);
          this.firstPass = false;
        }else{
          this.onSelectDateRange(this.days);
        }
      }
    });
  }

  onSelectDateRange(days){
    let range = new Date().getTime() - (days * 24* 60 * 60 * 1000);
    this.filteredTransactionList = [];
    for(let trans of this.transactionList){
      if((trans['transactionDate'] as firebase.firestore.Timestamp).seconds * 1000 > range){
        this.filteredTransactionList.push(trans);
      }
    }

    this.filteredTransactionList.sort((trans1, trans2) => trans2['transactionDate'].seconds - trans1['transactionDate'].seconds);
  }

}
