import {AfterViewInit, Component, ElementRef, OnInit, QueryList, ViewChild, ViewChildren} from '@angular/core';
import {AbstractControl, FormControl, FormGroup, NgForm, NgModel, Validators} from '@angular/forms';
import {ApiService} from '../../../Service/api.service';
import {MatDialogRef} from '@angular/material/dialog';
import * as Editor from 'CKeditor/build/ckeditor';
import {Category, Product} from '../../../Models/Product';

@Component({
  selector: 'app-create-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.css']
})
export class AddProductComponent implements OnInit, AfterViewInit {
  public Editor = Editor;
  nod = [
    {size: undefined, onStock: undefined}
  ];
  imgURL: any[] = [];
  images: File[] = [];
  rqst = {
    'title': '',
    'underTitle': '',
    'price': undefined,
    'discount': '',
    'category': '',
    'brand': '',
    'enabled':true,
    'description': 'Description'
  };
  ctgr = '';
  finalCategory: number;
  filteredProducts: Product[];
  filteredBrands: string[];
  filteredCategories: Category[];
  editorConfig = this.apiService.editorConfig;

  @ViewChild('f', {static: true}) noteForm: NgForm;
  @ViewChild('myFileInput', {static: true}) myFileInput;
  @ViewChild('discount', {static: true}) discount: NgModel;

  constructor(private apiService: ApiService, private matDialogRef: MatDialogRef<AddProductComponent>) {
  }

  ngOnInit(): void {
  }

  selectFile(i, event) {
    this.images[i] = (event.target.files[i]);
    var reader = new FileReader();
    reader.readAsDataURL(event.target.files[i]);
    reader.onload = (_event) => {
      this.imgURL[i] = (_event.target.result);
    };
    this.myFileInput.nativeElement.value = '';
  }

  ngAfterViewInit(): void {
    this.discount.control.setValidators([
      (control: AbstractControl) => Validators.max(this.rqst.price)(control),]);
    this.noteForm.addControl(this.discount);
  }

  openInput(i) {
    document.getElementById('fileInput' + i).click();
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
          } else {
            this.finalCategory = undefined;
            this.ctgr = '';
          }
        }
      }
    );
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
    this.ctgr = '';
    setTimeout(() => {
      if (wordSearch == this.rqst.category) {
        this.getCategories(this.rqst.category);
      }
    }, 300);
  }

  wrd(category: Category, wrd) {
    if (!category.parent) {
      return wrd;
    } else {
      wrd += ' - ' + category.parent.name;
      return this.wrd(category.parent, wrd);
    }
  }

  createProduct() {
    const formData = new FormData();
    formData.append('title', this.rqst.title);
    formData.append('underTitle', this.rqst.underTitle);
    formData.append('price', this.rqst.price);
    formData.append('discount', this.rqst.discount);
    formData.append('brand', this.rqst.brand);
    if (this.finalCategory && this.rqst.category && !Number.isNaN(this.finalCategory)) {
      formData.append('category', this.finalCategory.toString());
    }
    for (let i = 0; i < this.nod.length; i++) {
      formData.append('productSizes', JSON.stringify(this.nod[i]));
    }
    for (let i = 0; i < this.images.length; i++) {
      formData.append('images', this.images[i]);
    }
    formData.append('description', this.rqst.description);
    this.apiService.createProduct(formData).subscribe(
      res => {
        this.matDialogRef.close(res);
        this.apiService.successSnackBar(res);
      }
    );
  }

  selectFiles(event) {
    for (let i = 0; i < event.target.files.length; i++) {
      this.images.push(event.target.files[i]);

      var reader = new FileReader();
      reader.readAsDataURL(event.target.files[i]);
      reader.onload = (_event) => {
        this.imgURL.push(_event.target.result);
      };
    }
    this.myFileInput.nativeElement.value = '';
  }

  removeSelectedFile(index) {
    this.images.splice(index, 1);
    this.imgURL.splice(index, 1);
  }

  onReady(event) {
    return this.apiService.onReady(event);
  }

  add() {
    this.nod.push({size: undefined, onStock: undefined});
    this.nod.sort(function(a, b) {
      return a.size > b.size ? 1 : a.size < b.size ? -1 : 0;
    });
  }

  delete(i) {
    this.nod.splice(i, 1);
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
