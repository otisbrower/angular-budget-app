import { Routes } from '@angular/router';
import { HomeComponent } from './home/components/home/home.component';
import {NewAccountComponent} from './account/new-account/new-account.component';
import {AccountListComponent} from './account/account-list/account-list.component';
import {UpdateAccountComponent} from './account/update-account/update-account.component';
import {MainTransactionsComponent} from './transaction/main-transactions/main-transactions.component';
import {BudgetPlanComponent} from './budget/budget-plan/budget-plan.component';
import {BudgetCategorySummaryComponent} from './budget/budget-category-summary/budget-category-summary.component';

export const rootRouterConfig: Routes = [
  { path: '', component: HomeComponent },
  { path: 'home', component: HomeComponent },
  { path: 'newAccount', component: NewAccountComponent },
  { path: 'accountList', component: AccountListComponent},
  { path: 'updateAccount/:id', component: UpdateAccountComponent},
  { path: 'transactions', component: MainTransactionsComponent},
  { path: 'budgetplan', component: BudgetPlanComponent},
  { path: 'budgetsummary', component: BudgetCategorySummaryComponent}
];
