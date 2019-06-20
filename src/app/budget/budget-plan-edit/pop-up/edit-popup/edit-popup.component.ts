import {Component, Inject, OnInit} from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';

@Component({
  selector: 'app-edit-popup',
  templateUrl: './edit-popup.component.html',
  styleUrls: ['./edit-popup.component.scss']
})
export class EditPopupComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<EditPopupComponent>,
              @Inject(MAT_DIALOG_DATA) public data: object) { }

  ngOnInit() {
  }

  onCancel(){
    this.dialogRef.close();
  }

}
