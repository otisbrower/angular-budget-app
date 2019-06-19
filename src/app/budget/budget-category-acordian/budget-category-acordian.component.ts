import {Component, Input, OnInit} from '@angular/core';
import {FirebaseService} from '../../services/firebase.service';

@Component({
  selector: 'app-budget-category-acordian',
  templateUrl: './budget-category-acordian.component.html',
  styleUrls: ['./budget-category-acordian.component.scss']
})
export class BudgetCategoryAcordianComponent implements OnInit {

  @Input() categoryAcordian: object;
  @Input() budgetTotal: object;
  budgetPlan: object;
  constructor(private firebaseService: FirebaseService) { }

  ngOnInit() {
    this.firebaseService.retrieveBudgetPlan().subscribe(resp => {
      this.budgetPlan = resp;
    })
  }

}
