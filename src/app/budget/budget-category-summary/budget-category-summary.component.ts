import { Component, OnInit } from '@angular/core';
import {FirebaseService} from '../../services/firebase.service';

@Component({
  selector: 'app-budget-category-summary',
  templateUrl: './budget-category-summary.component.html',
  styleUrls: ['./budget-category-summary.component.scss']
})
export class BudgetCategorySummaryComponent implements OnInit {

  budgetCategories: object;

  transactions: object;
  constructor(private firebaseService: FirebaseService) {}

  ngOnInit() {
    this.budgetCategories = this.firebaseService.getBudgetCategoryTypes();
    console.log(this.budgetCategories);
    this.getCurrentMonthTransactions();
  }

  getCurrentMonthTransactions(){
    this.firebaseService.currentMonthTransactions().subscribe(resp => {
      if(resp){
        console.log(resp);
      }
      this.sortBudget();
    })
  }

  sortBudget() {

  }
}
