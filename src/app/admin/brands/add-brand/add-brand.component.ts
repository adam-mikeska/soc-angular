import {Component, OnInit, ViewChild} from '@angular/core';
import {ApiService} from '../../../Service/api.service';
import {MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'app-add-brand',
  templateUrl: './add-brand.component.html',
  styleUrls: ['./add-brand.component.css']
})
export class AddBrandComponent implements OnInit {
  selectedFiles: File[] = [];
  imgURL: any;
  name:string="";
  constructor(private apiService: ApiService,private matDialogRef: MatDialogRef<AddBrandComponent>) { }

  ngOnInit(): void {
  }

  addBrand(){
    const formData = new FormData();
    formData.append('name', this.name);
    if(this.selectedFiles[0]) {
      formData.append('image', this.selectedFiles[0]);
    }
    this.apiService.addBrand(formData).subscribe(
      res=>{
        this.matDialogRef.close(res);
        this.apiService.successSnackBar(res);
      }
    )
  }

  selectFile(event) {
    this.selectedFiles[0] = event.target.files[0];
    var reader = new FileReader();
    reader.readAsDataURL(event.target.files[0]);
    reader.onload = (_event) => {
      this.imgURL= (_event.target.result);
    };
  }

  openInput() {
    document.getElementById('fileInput').click();
  }
}
