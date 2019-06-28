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
  totalBudgeted: number = 0;
  projectedIncome: number;
  mainCategories: object = {};
  constructor(private firebaseService: FirebaseService,
              public dialog: MatDialog) { }

  ngOnInit() {
    this.firebaseService.retrieveBudgetPlan().subscribe(resp => {
      console.log(resp);
      this.budgetPlan = resp;
      console.log(this.budgetPlan);
      this.projectedIncome = resp['Income'];
    });
    // this.firebaseService.retrieveBudgetPlan().subscribe(resp => {
    //   this.budgetPlan = resp;
    //   console.log(resp);
    //   this.projectedIncome = resp['Income'];
    //   console.log(this.budgetPlan);
    //   this.calcBudgetTotal();
    //   console.log(this.projectedIncome);
    // });
  }

  calcBudgetTotal(){
    this.totalBudgeted = 0;
    for(let mainCategory in this.budgetPlan) {
      // console.log(mainCategory);
      this.budgetPlan[mainCategory] = 0;
      for(let subCategory of this.budgetPlan[mainCategory]) {
        console.log(subCategory);
        // console.log(this.budgetPlan[mainCategory][subCategory]);
        this.totalBudgeted += parseFloat(this.budgetPlan[mainCategory][subCategory]);
        // console.log(this.totalBudgeted);
        this.mainCategories[mainCategory] += parseFloat(this.budgetPlan[mainCategory][subCategory]);
      }
    }

    // console.log(this.totalBudgeted);
  }

  updateBudgetAmount(category: string, value: number){
    const dialogRef = this.dialog.open(EditPopupComponent, {
      width: '225px',
      height: '275px',
      data: {category: category, value: value}
    });
    dialogRef.afterClosed().subscribe(resp => {
      console.log('Dialog Popup Closed');
      console.log(resp);
      if(resp) {
        this.firebaseService.setBudgetCategoryBudgetedAmount(category, resp);
      }
    });
    this.calcBudgetTotal();
  }

}
