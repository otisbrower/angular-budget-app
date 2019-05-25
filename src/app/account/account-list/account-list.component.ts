import { Component, OnInit } from '@angular/core';
import {FirebaseService} from '../../services/firebase.service';
import {Router} from '@angular/router';
import {DomSanitizer} from '@angular/platform-browser';
import {forEach} from '@angular/router/src/utils/collection';
import {FirebaseObjectObservable} from '@angular/fire/database-deprecated';

@Component({
  selector: 'app-account-list',
  templateUrl: './account-list.component.html',
  styleUrls: ['./account-list.component.scss']
})
export class AccountListComponent implements OnInit {

  ageValue: number = 0;
  searchValue: string = "";
  items: Array<any>;
  age_filtered_items: Array<any>;
  name_filtered_items: Array<any>;
  icons: object;

  constructor(
    public firebaseService: FirebaseService,
    private router: Router,
    private sanitizer: DomSanitizer
  ) { }

  ngOnInit() {
    this.getAccounts();
    this.firebaseService.getAccountTypes().subscribe(resp => {
      this.icons = resp;
      if(this.icons){
        console.log(this.icons);
      }
    })
  }

  getAccounts(){
    this.firebaseService.getAccounts()
      .subscribe(result => {
        this.items = result;
        this.age_filtered_items = result;
        this.name_filtered_items = result;
        console.log(this.items);
      })
  }

  viewDetails(item){
    this.router.navigate(['/updateAccount/'+ item.payload.doc.id]);
  }

  capitalizeFirstLetter(value){
    return value.charAt(0).toUpperCase() + value.slice(1);
  }

  searchByName(){
    let value = this.searchValue.toLowerCase();
    this.firebaseService.searchAccounts(value)
      .subscribe(result => {
        this.name_filtered_items = result;
        this.items = this.combineLists(result, this.age_filtered_items);
      })
  }

  rangeChange(event){
    this.firebaseService.searchUsersByAge(event.value)
      .subscribe(result =>{
        this.age_filtered_items = result;
        this.items = this.combineLists(result, this.name_filtered_items);
      })
  }

  combineLists(a, b){
    let result = [];

    a.filter(x => {
      return b.filter(x2 =>{
        if(x2.payload.doc.id == x.payload.doc.id){
          result.push(x2);
        }
      });
    });
    return result;
  }

  sanitize(asset: string){
    for(var item in this.icons){
      if(this.icons[item]['type'] === asset){
        return this.icons[item]['image'];
      }
    }
    return null;
  }
}
