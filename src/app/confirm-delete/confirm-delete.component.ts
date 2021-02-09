import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {ApiService} from '../Service/api.service';

@Component({
  selector: 'app-confirm-delete',
  templateUrl: './confirm-delete.component.html',
  styleUrls: ['./confirm-delete.component.css']
})
export class ConfirmDeleteComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,private apiService:ApiService,private matDialogRef: MatDialogRef<ConfirmDeleteComponent>) { }

  ngOnInit(): void {
  }

  delete(){
    if(this.data.case==='image'){
      this.deleteImage();
    }else if(this.data.case==='product size'){
      this.deleteProductSize();
    }else if(this.data.case==='role'){
      this.deleteRole();
    }else if(this.data.case==='order item'){
      this.deleteOrderItem();
    }else if(this.data.case==='category'){
      this.deleteCategory();
    }else if(this.data.case==='brand'){
      this.deleteBrand();
    }else if(this.data.case==='alert'){
      this.deleteAlert();
    }else if(this.data.case==='carousel'){
      this.deleteCarousel();
    }
  }

  deleteImage() {
    this.apiService.deleteImage(this.data.productOptionId,this.data.imageId).subscribe(
      res => {
        this.matDialogRef.close(res);
        this.apiService.successSnackBar('Successfully deleted image!');
      }
    );
  }

  deleteProductSize() {
    this.apiService.deleteProductSize(this.data.productOptionId,this.data.id).subscribe(
      res => {
        this.matDialogRef.close(res);
        this.apiService.successSnackBar(res);
      }
    );
  }

  deleteRole() {
    this.apiService.deleteRole(this.data.id).subscribe(
      res => {
        this.matDialogRef.close(res);
        this.apiService.successSnackBar(res);
      }
    );
  }
  deleteOrderItem(){
    this.apiService.deleteOrderItem(this.data.orderId,this.data.orderItemId).subscribe(
      res=>{
        this.matDialogRef.close(res);
        this.apiService.successSnackBar(res);
      }
    )
  }

  deleteCategory(){
    this.apiService.deleteCategory(this.data.id).subscribe(
      res=>{
        this.matDialogRef.close(this.data);
        this.apiService.successSnackBar(res);
      }
    )
  }

  deleteBrand(){
    this.apiService.deleteBrand(this.data.id).subscribe(
      res=>{
        this.matDialogRef.close(res);
        this.apiService.successSnackBar(res);
      }
    )
  }

  private deleteCarousel() {
    this.apiService.deleteCarousel(this.data.id).subscribe(
      res=>{
        this.matDialogRef.close(res);
        this.apiService.successSnackBar(res);
      }
    )
  }

  private deleteAlert() {
    this.apiService.deleteAlert(this.data.id).subscribe(
      res=>{
        this.matDialogRef.close(res);
        this.apiService.successSnackBar(res);
      }
    )
  }
}
