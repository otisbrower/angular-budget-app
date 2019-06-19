import { Component, OnInit } from '@angular/core';
import {FirebaseService} from '../../services/firebase.service';

@Component({
  selector: 'app-budget-plan-edit',
  templateUrl: './budget-plan-edit.component.html',
  styleUrls: ['./budget-plan-edit.component.css']
})
export class BudgetPlanEditComponent implements OnInit {

  budgetPlan: object;
  constructor(private firebaseService: FirebaseService) { }

  ngOnInit() {
    this.firebaseService.retrieveBudgetPlan().subscribe( resp => {
      this.budgetPlan = resp;
      console.log(this.budgetPlan);
    })
  }

}
