import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {ApiService} from '../../../../Service/api.service';

@Component({
  selector: 'app-confirm-update-orderitem',
  templateUrl: './confirm-update-orderitem.component.html',
  styleUrls: ['./confirm-update-orderitem.component.css']
})
export class ConfirmUpdateOrderitemComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,private apiService:ApiService,private matDialogRef: MatDialogRef<ConfirmUpdateOrderitemComponent>) { }

  ngOnInit(): void {
  }

  updateOrderItem(){
    this.apiService.updateOrderItem(this.data.orderId,this.data.orderItemId,this.data.quantity).subscribe(
      res=>{
        this.matDialogRef.close(res);
        this.apiService.successSnackBar(res);
      }
    )

  }

}
