import {Component, OnInit} from '@angular/core';
import {MatDialogRef} from '@angular/material/dialog';
import {ApiService} from '../../../Service/api.service';

@Component({
  selector: 'app-create-coupon',
  templateUrl: './create-coupon.component.html',
  styleUrls: ['./create-coupon.component.css']
})
export class CreateCouponComponent implements OnInit {
  req: any = {
    'code': '',
    'discount':'',
    'minCartPrice':'0',
    'discountType':'',
    'enabled': true
  };

  constructor(private matDialog: MatDialogRef<CreateCouponComponent>, private apiService: ApiService) {
  }

  ngOnInit(): void {

  }

  createCoupon(request) {
    this.apiService.createCoupon(request).subscribe(
      res=>{
        this.matDialog.close(res);
        this.apiService.successSnackBar(res);
      }
    )
  }

}
