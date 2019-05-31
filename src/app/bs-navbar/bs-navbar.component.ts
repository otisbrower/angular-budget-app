import { Component, OnInit } from '@angular/core';
import {FirebaseService} from '../services/firebase.service';

@Component({
  selector: 'app-bs-navbar',
  templateUrl: './bs-navbar.component.html',
  styleUrls: ['./bs-navbar.component.css']
})
export class BsNavbarComponent implements OnInit {

  constructor(public firebaseService: FirebaseService) { }

  ngOnInit() {
    this.firebaseService.startService();
  }

}
