import {Component, OnInit, ViewChild} from '@angular/core';
import {ApiService} from '../../../Service/api.service';
import {MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'app-add-carousel',
  templateUrl: './add-carousel.component.html',
  styleUrls: ['./add-carousel.component.css']
})
export class AddCarouselComponent implements OnInit {
  request:any={
    'text':'',
    'link':''
  }
  image: File;
  imgURL: any;
  @ViewChild('myFileInput', {static: true}) myFileInput;
  constructor(private apiService:ApiService,private matDialogRef:MatDialogRef<AddCarouselComponent>) { }

  ngOnInit(): void {
  }

  selectFile( event) {
    this.image = event.target.files[0]
    var reader = new FileReader();
    reader.readAsDataURL(event.target.files[0]);
    reader.onload = (_event) => {
      this.imgURL= (_event.target.result);
    };
    this.myFileInput.nativeElement.value = '';
  }

  addCarousel(carousel,image){
    const formData: FormData = new FormData();
    formData.append('text', carousel.text);
    formData.append('link', carousel.link);
    formData.append('image', image);

    this.apiService.addCarousel(formData).subscribe(
      res=>{
        this.matDialogRef.close(res);
        this.apiService.successSnackBar(res);
      }
    )
  }

  openInput() {
    document.getElementById('fileInput').click();
  }


}
