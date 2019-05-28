import { Component, OnInit } from '@angular/core';
import { FirebaseService } from './services/firebase.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{

  constructor(public firebaseService: FirebaseService){}
  ngOnInit(){
    this.firebaseService.startService();
  }
  title = 'BudgetFire';
}
