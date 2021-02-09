import { Component, OnInit } from '@angular/core';
import {ApiService} from '../../../Service/api.service';
import {MatDialogRef} from '@angular/material/dialog';
import {Router} from '@angular/router';
import {Role} from '../../../Models/User';

@Component({
  selector: 'app-create-role-dialog',
  templateUrl: './create-role-dialog.component.html',
  styleUrls: ['./create-role-dialog.component.css']
})
export class CreateRoleDialogComponent implements OnInit {

  constructor(private apiService: ApiService,private matDialogRef:MatDialogRef<CreateRoleDialogComponent>,private router: Router) { }

  permissions = [
    {name: 'Everything', permission: '*'},
    {name: 'Display orders', permission: 'display_orders'},
    {name: 'Update order', permission: 'update_order'},
    {name: 'Display users', permission: 'display_users'},
    {name: 'Lock user', permission: 'lock_user'},
    {name: 'Update user', permission: 'update_user'},
    {name: 'Send email', permission: 'send_email'},
    {name: 'Display roles', permission: 'display_roles'},
    {name: 'Update role', permission: 'update_role'},
    {name: 'Create role', permission: 'create_role'},
    {name: 'Asign role', permission: 'asign_role'},
    {name: 'Delete role', permission: 'delete_role'},
    {name: 'Display brands', permission: 'display_brands'},
    {name: 'Update brand', permission: 'update_brand'},
    {name: 'Add brand', permission: 'add_brand'},
    {name: 'Delete brand', permission: 'delete_brand'},
    {name: 'Display products', permission: 'display_products'},
    {name: 'Discount products', permission: 'discount_product'},
    {name: 'Update product', permission: 'update_product'},
    {name: 'Create product', permission: 'create_product'},
    {name: 'Display categories', permission: 'display_categories'},
    {name: 'Add category', permission: 'add_category'},
    {name: 'Update category', permission: 'update_category'},
    {name: 'Delete category', permission: 'delete_category'},
    {name: 'Display coupons', permission: 'display_coupons'},
    {name: 'Create coupon', permission: 'create_coupon'},
    {name: 'Update coupon', permission: 'update_coupon'},
    {name: 'Display others', permission: 'display_others'},
    {name: 'Add carousel', permission: 'add_carousel'},
    {name: 'Update carousel', permission: 'update_carousel'},
    {name: 'Delete carousel', permission: 'delete_carousel'},
    {name: 'Add alert', permission: 'add_alert'},
    {name: 'Update alert', permission: 'update_alert'},
    {name: 'Delete alert', permission: 'delete_alert'},
    {name: 'Update payment', permission: 'update_payment'},
    {name: 'Update delivery', permission: 'update_delivery'},
  ];

  request: any = {
    'name': '',
    'color': '',
    'permissions': ''
  };

  ngOnInit(): void {
  }

  create(){
    this.apiService.createRole(this.request).subscribe(
      res=>{
        this.apiService.successSnackBar(res);
        this.matDialogRef.close(res);
      });
  }

  change(request,permission){
    if(request.permissions.includes(permission+",")){
      request.permissions = request.permissions.replace(permission+",","")
    }else if(request.permissions.includes(","+permission)){
      request.permissions = request.permissions.replace(","+permission,"")
    }else if(request.permissions.includes(permission)){
      request.permissions = request.permissions.replace(permission,"")
    } else if(!request.permissions.includes(permission)){
      request.permissions = request.permissions ? request.permissions+","+permission : permission;
    }
  }

}
