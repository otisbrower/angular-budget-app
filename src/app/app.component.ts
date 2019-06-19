import { Component, OnInit } from '@angular/core';
import { FirebaseService } from './services/firebase.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{

  constructor(public firebaseService: FirebaseService, private router: Router){}
  ngOnInit(){
    this.router.navigate(['']);
    this.firebaseService.startService();
    console.clear();
  }
}
