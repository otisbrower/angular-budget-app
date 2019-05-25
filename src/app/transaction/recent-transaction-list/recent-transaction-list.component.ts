import { Component, OnInit } from '@angular/core';
import {FirebaseService} from '../../services/firebase.service';
import { DatePipe} from '@angular/common';

@Component({
  selector: 'app-recent-transaction-list',
  templateUrl: './recent-transaction-list.component.html',
  styleUrls: ['./recent-transaction-list.component.css']
})
export class RecentTransactionListComponent implements OnInit {
  historyDays = [5, 15, 30, 60, 90];

  transactionList: Array<any>;

  constructor(private firebaseService: FirebaseService,
              public datePipe: DatePipe) { }

  ngOnInit() {
    this.onSelectDateRange(30);
  }

  onSelectDateRange(days){
    this.firebaseService.getRecentTransactions(days).subscribe(resp => {
      this.transactionList = resp;

      // for(let transaction of this.transactionList){
      //   console.log(transaction.payload.doc.data());
      // }
    });
  }

}
