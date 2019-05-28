import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {FirebaseService} from '../../services/firebase.service';
import {ActivatedRoute, ParamMap, Router} from '@angular/router';
import {MatDialog} from '@angular/material';
import {switchMap} from 'rxjs/operators';

@Component({
  selector: 'app-update-account',
  templateUrl: './update-account.component.html',
  styleUrls: ['./update-account.component.scss']
})
export class UpdateAccountComponent implements OnInit {

  updateForm: FormGroup;
  accountTypeList: object;
  item: any;


  validation_messages = {
    'accountName' : [
      {type: 'required', message: 'Account Name is required.'}
    ],
    'accountType': [
      {type: 'required', message: 'Account Type is required.'}
    ],
    'currentBalance': [
      {type: 'required', message: 'Account Balance is required.'}
    ]

  };

  constructor(public firebaseService: FirebaseService,
              private route: ActivatedRoute,
              private formBuilder: FormBuilder,
              private router: Router,
              private dialog: MatDialog) { }

  ngOnInit() {
    this.getRouteData();
    this.getAccountList();
  }

  createForm() {
    this.updateForm = this.formBuilder.group({
      accountName: [this.item.accountName, Validators.required],
      accountType: [this.item.accountType, Validators.required],
      currentBalance: [this.item.currentBalance, Validators.required]
    });
  }

  onSubmit(value) {
    value.currentBalance = Number(value.currentBalance);
    value.accountNameToSearch = this.item.accountNameToSearch.toLowerCase();
    value.monthEndBalance = this.item.monthEndBalance;
    value.ytdDebit = this.item.ytdDebit;
    value.ytdDeposit = this.item.ytdDeposit;
    this.firebaseService.updateAccount(this.item.id, value).then( res => {
      this.router.navigate(['/accountList']);
    })
  }

  getAccountList() {
    this.accountTypeList = this.firebaseService.getAccountTypes();
  }

  getRouteData() {

    let tempData = this.route.snapshot.paramMap.get('id');

    console.log(tempData);
    this.firebaseService.getAccount(tempData).subscribe(resp => {
      this.item = resp.payload.data();
      this.item.id = resp.payload.id;
      console.log(this.item);
      this.createForm();
    });
  }
}
