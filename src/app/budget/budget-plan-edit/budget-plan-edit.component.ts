import { Component, OnInit } from '@angular/core';
import {FirebaseService} from '../../services/firebase.service';
import {MatDialog, MatDialogRef} from '@angular/material';
import {EditPopupComponent} from './pop-up/edit-popup/edit-popup.component';

@Component({
  selector: 'app-budget-plan-edit',
  templateUrl: './budget-plan-edit.component.html',
  styleUrls: ['./budget-plan-edit.component.css']
})
export class BudgetPlanEditComponent implements OnInit {

  budgetPlan: object;
  totalBudgeted: number;
  projectedIncome: number;
  mainCategories: object = {};
  incomeTotal: number;
  constructor(private firebaseService: FirebaseService,
              public dialog: MatDialog) { }

  ngOnInit() {
    this.firebaseService.retrieveBudgetPlan().subscribe(resp => {
      console.log(resp);
      this.budgetPlan = resp as object;
      console.log(this.budgetPlan);
      this.projectedIncome = resp['Income'];
      this.calcBudgetTotal();
    });
  }

  calcBudgetTotal(){
    this.totalBudgeted = 0;
    this.incomeTotal = 0;
    for(let mainCategory in this.budgetPlan) {
      console.log(mainCategory);
      this.mainCategories[mainCategory] = 0;
      for(let subCategory in this.budgetPlan[mainCategory]) {
        console.log(subCategory);
        if(mainCategory !== 'Income'){
          this.totalBudgeted += parseFloat(this.budgetPlan[mainCategory][subCategory]);
        }else{
          this.incomeTotal += parseFloat(this.budgetPlan[mainCategory][subCategory]);
        }
        this.mainCategories[mainCategory] += parseFloat(this.budgetPlan[mainCategory][subCategory]);
      }
    }
  }

  updateBudgetAmount(mainCategory: string, category: string, value: number){
    const dialogRef = this.dialog.open(EditPopupComponent, {
      width: '225px',
      height: '275px',
      data: {category: category, value: value}
    });
    dialogRef.afterClosed().subscribe(resp => {
      if(resp) {
        this.firebaseService.setBudgetCategoryBudgetedAmount(mainCategory, category, resp);
      }
    });
    this.calcBudgetTotal();
  }

}
