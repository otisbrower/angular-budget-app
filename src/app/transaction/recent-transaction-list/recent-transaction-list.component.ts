import { Component, OnInit } from '@angular/core';
import {FirebaseService} from '../../services/firebase.service';
import { DatePipe} from '@angular/common';
import {Transaction} from '../../Common/models/transaction';
// import Timestamp = firebase.firestore.Timestamp;

@Component({
  selector: 'app-recent-transaction-list',
  templateUrl: './recent-transaction-list.component.html',
  styleUrls: ['./recent-transaction-list.component.css']
})
export class RecentTransactionListComponent implements OnInit {
  historyDays = [5, 15, 30, 60, 90];

  transactionList: Array<Transaction>;
  filteredTransactionList: Array<Transaction>;

  constructor(private firebaseService: FirebaseService,
              public datePipe: DatePipe) { }

  ngOnInit() {
    this.getTransactions();
    this.onSelectDateRange(30);
  }

  getTransactions(){
    this.transactionList = this.firebaseService.getRecentTransactions();
    this.filteredTransactionList = this.firebaseService.getRecentTransactions();

  }
  onSelectDateRange(days){
    let range = new Date().getTime() - (days * 24* 60 * 60 * 1000);
    // let searchDate = Timestamp.fromMillis(range);
  }

}
