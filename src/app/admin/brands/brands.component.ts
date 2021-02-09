import {Component, OnInit, ViewChild} from '@angular/core';
import {ApiService} from '../../Service/api.service';
import {MatDialog} from '@angular/material/dialog';

import {Order, User} from '../../Models/User';

import {Brand} from '../../Models/Product';
import {AddBrandComponent} from './add-brand/add-brand.component';

import {ConfirmDeleteComponent} from '../../confirm-delete/confirm-delete.component';
import {environment} from '../../../environments/environment';

@Component({
  selector: 'app-brands',
  templateUrl: './brands.component.html',
  styleUrls: ['./brands.component.css']
})
export class BrandsComponent implements OnInit {
  brands: Brand[];
  selectedFile: File;
  user:User;
  apiUrl=environment.baseUrl;
  constructor(private apiService: ApiService,private matDialog:MatDialog) { }

  ngOnInit(): void {
    this.getBrands();
    this.apiService.cast.subscribe(
      res=>{
        this.user=res;
      }
    )
  }

  confirmDeleteBrand(id) {
    this.matDialog.open(ConfirmDeleteComponent, {
      data:{
        case:'brand',
        id:id
      },
      width: '450px',
    }).afterClosed().subscribe(
      res => {
        if (res) {
          this.getBrands();
        }
      }
    );
  }

  selectFile(id,event) {
    this.selectedFile = event.target.files[0];
    this.changeImageBrand(id,this.selectedFile);
  }

  openInput(i) {
    document.getElementById('fileInput' + i).click();
  }

  changeImageBrand(id,image){
    const img = new FormData();
    img.append('image', image);
    this.apiService.changeImageBrand(id,img).subscribe(
      res=>{
        this.apiService.successSnackBar(res);
        this.getBrands();
      }
    )
  }

  getBrands(){
    this.apiService.getBrands().subscribe(
      res=>{
        this.brands=res;
      }
    )
  }


  updateBrand(id,brand){
    this.apiService.updateBrand(id,brand).subscribe(
      res=>{
        this.apiService.successSnackBar(res);
        this.getBrands();
      }
    )
  }

  addBrand() {
    this.matDialog.open(AddBrandComponent, {
      width: '400px',
    }).afterClosed().subscribe(
      res => {
        if (res) {
          this.getBrands();
        }
      }
    );
  }

}
