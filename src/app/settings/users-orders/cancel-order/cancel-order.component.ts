import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {ApiService} from '../../../Service/api.service';

@Component({
  selector: 'app-cancel-order',
  templateUrl: './cancel-order.component.html',
  styleUrls: ['./cancel-order.component.css']
})
export class CancelOrderComponent implements OnInit {

  constructor(private matDialogRef:MatDialogRef<CancelOrderComponent>,private apiService: ApiService,@Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
  }
  cancelOrder() {
    this.apiService.cancelOrder(this.data).subscribe(
      res => {
        this.matDialogRef.close(res);
        this.apiService.errorSnackBar(res);
      }
    );
  }
}
