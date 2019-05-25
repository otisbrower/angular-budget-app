import { Injectable} from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { FirebaseService} from '../../services/firebase.service';

@Injectable()
export class updateAccountResolver implements Resolve<any> {
  constructor(public firebaseService: FirebaseService) {  }

  resolve(route: ActivatedRouteSnapshot){
    return new Promise((resolve, reject) => {
      this.firebaseService.getAccount('id').subscribe(resp => {
        resolve(resp);
      })
    })
  }
}
