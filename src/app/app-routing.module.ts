import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { NewUserComponent } from './new-user/new-user.component';
import { EditUserComponent } from './edit-user/edit-user.component';
import { EditUserResolver } from './edit-user/edit-user.resolver';
import {NewAccountComponent} from './account/new-account/new-account.component';
import {AccountListComponent} from './account/account-list/account-list.component';
import {UpdateAccountComponent} from './account/update-account/update-account.component';
import {MainTransactionsComponent} from './transaction/main-transactions/main-transactions.component';

export const rootRouterConfig: Routes = [
  { path: '', component: HomeComponent },
  { path: 'home', component: HomeComponent },
  { path: 'newUser', component: NewUserComponent },
  { path: 'details/:id', component: EditUserComponent, resolve:{data : EditUserResolver}},
  { path: 'newAccount', component: NewAccountComponent },
  { path: 'accountList', component: AccountListComponent},
  { path: 'updateAccount/:id', component: UpdateAccountComponent},
  { path: 'transactions', component: MainTransactionsComponent}
];
