import {Component, OnInit} from '@angular/core';
import {ApiService} from '../../Service/api.service';
import {Role, User} from '../../Models/User';
import {Router} from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import {CreateRoleDialogComponent} from './create-role-dialog/create-role-dialog.component';

import {ConfirmDeleteComponent} from '../../confirm-delete/confirm-delete.component';

@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.css']
})
export class RolesComponent implements OnInit {
  user: User;
  roles: Role[];

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
  canUpdateRole: boolean;


  constructor(private apiService: ApiService, private router: Router, private matDialog: MatDialog) {
  }

  ngOnInit(): void {
    this.getRoles();
    this.apiService.cast.subscribe(
      res => {
        this.canUpdateRole = res?.role?.permissions.includes('update_role') || res?.role?.permissions.includes('*');
        this.user = res;
      }
    );
  }

  updateRole(role: Role) {
    role['permissionList']=undefined;
    this.apiService.updateRole(role, role.id).subscribe(
      res => {
        this.getRoles();
        this.apiService.successSnackBar(res);
      });
  }

  getRoles() {
    this.apiService.getRoles().subscribe(
      res => {
        this.roles = res;
      }
    );
  }

  createRole() {
    this.matDialog.open(CreateRoleDialogComponent, {
      width: '500px',
    }).afterClosed().subscribe(
      res => {
        if (res) {
          this.getRoles();
        }
      }
    );
  }

  confirmDelete(id) {
    this.matDialog.open(ConfirmDeleteComponent, {
      data: {
        case: 'role',
        id: id
      },
      width: '450px',
    }).afterClosed().subscribe(
      res => {
        if (res) {
          this.getRoles();
        }
      }
    );
  }

  change(role:Role,permission){
    if(role.permissions.includes(permission+",")){
      role.permissions = role.permissions.replace(permission+",","")
    }else if(role.permissions.includes(","+permission)){
      role.permissions = role.permissions.replace(","+permission,"")
    }else if(role.permissions.includes(permission)){
      role.permissions = role.permissions.replace(permission,"")
    } else if(!role.permissions.includes(permission)){
      role.permissions = role.permissions ? role.permissions+","+permission : permission;
    }
  }

}
