import { Component, OnInit } from '@angular/core';
import {FirebaseService} from '../../services/firebase.service';

@Component({
  selector: 'app-budget-category-summary',
  templateUrl: './budget-category-summary.component.html',
  styleUrls: ['./budget-category-summary.component.scss']
})
export class BudgetCategorySummaryComponent implements OnInit {

  budgetCategories: object;
  categoryAcordian: object = {};
  transactions: object;
  budgetPlan: object;
  budgetTotal = {totalBudgeted: 0, totalSpent: 0, totalRemaining: 0};
  constructor(private firebaseService: FirebaseService) {}

  ngOnInit() {
    this.budgetCategories = this.firebaseService.getBudgetCategoryTypes();
    this.createPlanObject();
    this.getCurrentMonthTransactions();
  }

  getCurrentMonthTransactions(){
    this.firebaseService.currentMonthTransactions().subscribe(resp => {
      if(resp) {

        this.firebaseService.retrieveBudgetPlan().subscribe(budgetResp => {
          this.budgetTotal['totalBudgeted'] = budgetResp['Income'];
          console.log(this.budgetTotal);
          this.sortBudget(resp);
        });
      }
    });
  }

  createPlanObject(){
    for(let cat in this.budgetCategories){
      let categoryName = cat;
      let subCats: object = {};
      for(let sub in this.budgetCategories[cat]){
        subCats[this.budgetCategories[cat][sub]] = 0;
      }

      this.categoryAcordian[categoryName] = {
        'categoryTotal': 0,
          'subcategories': subCats
        }
    }
  }

  sortBudget(resp: object) {
      for(let trans in resp){
        this.budgetTotal['totalSpent'] += resp[trans]['transactionAmount'];
        this.categoryAcordian[resp[trans]['mainCategory']]['categoryTotal'] += resp[trans]['transactionAmount'];
        this.categoryAcordian[resp[trans]['mainCategory']]['subcategories'][resp[trans]['subCategory']] += resp[trans]['transactionAmount'];
      }
      console.log(this.categoryAcordian);
      this.budgetTotal['totalRemaining'] = this.budgetTotal['totalBudgeted'] + this.budgetTotal['totalSpent'];
      console.log(this.budgetTotal);
  }
}
