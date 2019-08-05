import {Component, Inject, OnInit} from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';

class data{
  category: string;
  value: number;
}
@Component({
  selector: 'app-edit-popup',
  templateUrl: './edit-popup.component.html',
  styleUrls: ['./edit-popup.component.scss']
})
export class EditPopupComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<EditPopupComponent>,
              @Inject(MAT_DIALOG_DATA) public data: data) { }

  ngOnInit() {
  }

  onCancel(){
    this.dialogRef.close();
  }

}
