import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {ApiService} from '../../../../Service/api.service';

@Component({
  selector: 'app-add-order-item',
  templateUrl: './add-order-item.component.html',
  styleUrls: ['./add-order-item.component.css']
})
export class AddOrderItemComponent implements OnInit {
  request : any = {
    'product':'',
    'underTitle':'',
    'size':'',
    'quantity':''
  }
  constructor(@Inject(MAT_DIALOG_DATA) public data: any,private apiService:ApiService,private matDialogRef: MatDialogRef<AddOrderItemComponent>) { }

  ngOnInit(): void {
  }

  addOrderItem(){
    this.apiService.addOrderItem(this.data.orderId,this.request).subscribe(
      res=>{
        this.matDialogRef.close(res);
        this.apiService.successSnackBar(res);
      }
    )
  }

}
