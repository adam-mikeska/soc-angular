import {AfterViewInit, Component, Inject, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import * as Editor from 'CKeditor/build/ckeditor';
import {Category, Product, ProductOption, ProductSize} from '../../../Models/Product';
import {ApiService} from '../../../Service/api.service';
import {AbstractControl, NgForm, NgModel, Validators} from '@angular/forms';

import {ConfirmDeleteComponent} from '../../../confirm-delete/confirm-delete.component';
import {environment} from '../../../../environments/environment';

@Component({
  selector: 'app-edit-product',
  templateUrl: './edit-product.component.html',
  styleUrls: ['./edit-product.component.css']
})
export class EditProductComponent implements OnInit, AfterViewInit, OnDestroy {

  public Editor = Editor;
  rqst = {
    'title': this.data.product.title,
    'underTitle': this.data.underTitle,
    'price': this.data.price,
    'discount': this.data.discount,
    'category': (this.data.product.category === null ? '' : this.data.product.category.name),
    'brand': (this.data.product.brand === null ? '' : this.data.product.brand.name),
    'description': this.data.description
  };
  finalCategory: number;

  filteredProducts: Product[];
  filteredBrands: string[];
  filteredCategories: Category[];

  images: File[] = [];
  editorConfig = this.apiService.editorConfig;
  @ViewChild('discount', {static: true}) discount: NgModel;
  @ViewChild('myFileInput', {static: true}) myFileInput;
  @ViewChild('f', {static: true}) noteForm: NgForm;

  changed;
  currUser;
  selectedFiles: File[] = [];
  ctgr = '';
  formFields = [];

  apiUrl=environment.baseUrl;

  constructor(@Inject(MAT_DIALOG_DATA) public data: ProductOption, private apiService: ApiService, private matDialogRef: MatDialogRef<EditProductComponent>, private matDialog: MatDialog) {
  }

  ngOnInit(): void {
    for (let i = 0; i < this.data.productSizes.length; i++) {
      this.formFields.push({productSize: this.data.productSizes[i], isNew: false});
    }
    if (this.data.product.category) {
      this.ctgr = this.setUpperCateg(this.wrd(this.data.product.category, this.data.product.category.name));
      this.finalCategory = this.data.product.category.id;
    }

    this.data.productSizes.sort(function(a, b) {
      return a.size > b.size ? 1 : a.size < b.size ? -1 : 0;
    });
    this.apiService.cast.subscribe(
      res => {
        this.currUser = res;
      }
    );
  }

  ngAfterViewInit(): void {
    this.discount.control.setValidators([
      (control: AbstractControl) => Validators.max(this.rqst.price)(control),]);
    this.noteForm.addControl(this.discount);
  }

  ngOnDestroy() {
    this.matDialogRef.close(this.changed);
  }


  selectFiles(event) {
    for (let i = 0; i < event.target.files.length; i++) {
      this.images.push(event.target.files[i]);
    }

    this.uploadImages();

    this.myFileInput.nativeElement.value = '';
    this.images = [];
  }

  changeImage(productOptionId,id, image) {
    const img = new FormData();
    img.append('image', image);
    this.apiService.changeImageProductOption(productOptionId,id, img).subscribe(
      res => {
        this.apiService.successSnackBar('Successfully changed image');
        this.data = res;
        this.changed = 'Image changed!';
      }
    );
  }

  updateProduct(id, request) {
    let temp = this.rqst.category;
    if (request.category && this.finalCategory) {
      request.category = this.finalCategory.toString();
    }else {
      request.category=null;
    }

    this.apiService.updateProduct(id, request).subscribe(
      res => {
        this.apiService.successSnackBar(res);
        this.changed = res;
        this.matDialogRef.close(res);
      }
    );
    request.category=temp;
  }

  ConfirmDeleteImage(imageId) {
    this.matDialog.open(ConfirmDeleteComponent, {
      data: {
        case: 'image',
        productOptionId: this.data.id,
        imageId: imageId,
      }, width: '500px'
    }).afterClosed().subscribe(
      res => {
        if (res) {
          this.getProductOption();
        }
      }
    );
  }

  uploadImages() {
    const formData = new FormData();
    for (let i = 0; i < this.images.length; i++) {
      formData.append('images', this.images[i]);
    }
    this.apiService.uploadImageToProduct(this.data.id, formData).subscribe(
      res => {
        this.data = res;
        this.changed = 'Images uploaded';
        this.apiService.successSnackBar('Successfully uploaded images!');
      }
    );
  }

  getBrands(brand) {
    this.apiService.getBrandsName(brand).subscribe(
      res => {
        this.filteredBrands = res;
      }
    );
  }

  getProducts(product) {
    this.apiService.getProduct(product).subscribe(
      res => {
        this.filteredProducts = res;
        if (res.length > 0) {
          if (this.rqst.title.toUpperCase() === this.filteredProducts[0].title.toUpperCase() && this.filteredProducts.length === 1) {
            this.rqst.category = this.filteredProducts[0].category.name;
            this.finalCategory = this.filteredProducts[0].category.id;
            this.ctgr = this.setUpperCateg(this.wrd(this.filteredProducts[0].category, this.filteredProducts[0].category.name));
            this.rqst.brand = this.filteredProducts[0].brand.name;
          } else {
            this.rqst.category = '';
            this.finalCategory = undefined;
            this.ctgr = '';
            this.rqst.brand = '';
          }
        }
      }
    );
  }

  getCategories(category) {
    this.apiService.getCategories(category).subscribe(
      res => {
        this.filteredCategories = res;
        this.ctgr = '';
        if (res.length > 0) {
          if (this.rqst.category.toUpperCase() === this.filteredCategories[0].name.toUpperCase() && this.filteredCategories.length === 1) {
            this.rqst.category = this.filteredCategories[0].name;
            this.finalCategory = this.filteredCategories[0].id;
            this.ctgr = this.setUpperCateg(this.wrd(this.filteredCategories[0], this.filteredCategories[0].name));
          }else {
            this.finalCategory=undefined;
            this.ctgr = "";
          }
        }
      }
    );
  }

  updateProductSize(productOptionId,id, size, onStock) {
    let request = {
      'size': size,
      'onStock': onStock,
      'product':this.data
    };
    this.apiService.updateProductSize(productOptionId,id, request).subscribe(
      res => {
        this.apiService.successSnackBar(res);
        this.getProductOption();
        this.changed = res;
      }
    );
  }

  addProductSize(id, size, onStock) {
    let request = {
      'size': size,
      'onStock': onStock,
      'product':this.data
    };
    this.apiService.addProductSize(id,request).subscribe(
      res => {
        this.apiService.successSnackBar(res);
        this.getProductOption();
        this.changed = res;
      }
    );
  }

  confirmDeleteProductSize(id, underTitle, title, formField) {
    if (formField.isNew) {
      this.formFields.splice(this.formFields.indexOf(this.formFields), 1);
    } else {
      this.matDialog.open(ConfirmDeleteComponent, {
        data: {
          case: 'product size',
          productOptionId: this.data.id,
          id: id,
          underTitle: underTitle,
          title: title,
        }, width: '500px'
      }).afterClosed().subscribe(
        res => {
          if (res) {
            this.getProductOption();
          }
        }
      );
    }
  }


  getProductOption() {
    this.apiService.getProductOption(this.data.product.title,this.data.underTitle).subscribe(
      res => {
        this.formFields = [];
        for (let i = 0; i < res.productSizes.length; i++) {
          this.formFields.push({productSize: res.productSizes[i], isNew: false});
        }
        this.data = res;
        this.data.productSizes.sort(function(a, b) {
          return a.size > b.size ? 1 : a.size < b.size ? -1 : 0;
        });
      }
    );
  }

  enableDisableSale(id) {
    this.apiService.enableDisableSale(id).subscribe(
      res => {
        this.apiService.successSnackBar(res);
        this.changed = res;
      }
    );
  }

  wrd(category: Category, wrd) {
    if (!category.parent) {
      return wrd;
    } else {
      wrd += ' - ' + category.parent.name;
      return this.wrd(category.parent, wrd);
    }
  }

  setUpperCateg(word) {
    if (word.split('-')[1]) {
      word = word.replace(word.split(' - ')[0] + ' - ', '');
    } else {
      word = '';
    }
    return word;
  }

  update() {
    let wordSearch = this.rqst.title;
    setTimeout(() => {
      if (wordSearch == this.rqst.title) {
        this.getProducts(this.rqst.title);
      }
    }, 300);
  }

  updateBrands() {
    let wordSearch = this.rqst.brand;
    setTimeout(() => {
      if (wordSearch == this.rqst.brand) {
        this.getBrands(this.rqst.brand);
      }
    }, 300);
  }

  updateCategories() {
    let wordSearch = this.rqst.category;
    setTimeout(() => {
      if (wordSearch == this.rqst.category) {
        this.getCategories(this.rqst.category);
      }
    }, 300);
  }

  onReady(event) {
    return this.apiService.onReady(event);
  }

  add() {
    this.formFields.push({productSize: {id: null, productOption: this.data, size: null, onStock: null}, isNew: true});
  }

  openInput(i) {
    document.getElementById('fileInput' + i).click();
  }

  selectFile(productOptionId,id, event) {
    this.selectedFiles = event.target.files[0];
    this.changeImage(productOptionId,id, this.selectedFiles);
  }

  onProductSelect(product) {
    if(product.category){
      this.rqst.category = this.wrd(product.category, product.category.name).split('-')[0].trim();
      this.ctgr = this.setUpperCateg(this.wrd(product.category, product.category.name).trim());
      this.finalCategory = product.category.id;
    }
    this.rqst.brand = (product.brand ? product.brand.name : '');
  }

  onCategorySelect(category){
    this.rqst.category=this.wrd(category,category.name).split('-')[0].trim();
    this.ctgr=this.setUpperCateg(this.wrd(category,category.name).trim());
    this.finalCategory=category.id
  }

}
