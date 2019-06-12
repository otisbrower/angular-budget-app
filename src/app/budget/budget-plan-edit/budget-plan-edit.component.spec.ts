import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BudgetPlanEditComponent } from './budget-plan-edit.component';

describe('BudgetPlanEditComponent', () => {
  let component: BudgetPlanEditComponent;
  let fixture: ComponentFixture<BudgetPlanEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BudgetPlanEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BudgetPlanEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
