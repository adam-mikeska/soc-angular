import {Component, OnInit} from '@angular/core';
import {ApiService} from '../../Service/api.service';
import {Alert, Carousel, Delivery, Payment} from '../../Models/Product';
import {ConfirmDeleteComponent} from '../../confirm-delete/confirm-delete.component';
import {MatDialog} from '@angular/material/dialog';
import {AddCarouselComponent} from './add-carousel/add-carousel.component';
import {AddAlertComponent} from './add-alert/add-alert.component';
import {User} from '../../Models/User';

@Component({
  selector: 'app-ui',
  templateUrl: './ui.component.html',
  styleUrls: ['./ui.component.css']
})
export class UiComponent implements OnInit {
  carousel: Carousel[] = [];
  alerts: Alert[] = [];
  payments: Payment[] = [];
  deliveries: Delivery[] = [];
  user:User;

  apiUrl=this.apiService.baseUrl;


  constructor(private apiService: ApiService,private matDialog:MatDialog) {
  }

  ngOnInit(): void {
    this.apiService.cast.subscribe(
      res=>{
        console.log(res)
        this.user=res;
      }
    )
    this.getAlerts();
    this.getCarousel();
    this.getDeliveries();
    this.getPayments();
  }

  getCarousel() {
    this.apiService.getCarousel().subscribe(
      res => {
        this.carousel=res;
      }
    );
  }

  getAlerts() {
    this.apiService.getAlerts().subscribe(
      res => {
        this.alerts=res;
      }
    );
  }

  getPayments() {
    this.apiService.getPayments().subscribe(
      res => {
        this.payments = res;
      }
    );
  }

  getDeliveries() {
    this.apiService.getDeliveries().subscribe(
      res => {
        this.deliveries = res;
      }
    );
  }

  updatePayment(id,price){
    this.apiService.changePriceOfPayment(id,price).subscribe(
      res=>{
        this.apiService.successSnackBar(res);
      }
    )
  }

  updateDelivery(id,price){
    this.apiService.changePriceOfDelivery(id,price).subscribe(
      res=>{
        this.apiService.successSnackBar(res);
      }
    )
  }

  updateCarousel(id,carousel){
    this.apiService.updateCarousel(id,carousel).subscribe(
      res=>{
        this.apiService.successSnackBar(res);
      }
    )
  }

  updateAlert(id,alert){
    this.apiService.updateAlert(id,alert).subscribe(
      res=>{
        this.apiService.successSnackBar(res);
      }
    )
  }

  confirmDeleteCarousel(id){
    this.matDialog.open(ConfirmDeleteComponent, {
      data: {
        case: 'carousel',
        id: id
      },
      width: '450px',
    }).afterClosed().subscribe(
      res => {
        if (res) {
          this.getCarousel();
        }
      }
    );
  }

  confirmDeleteAlert(id){
    this.matDialog.open(ConfirmDeleteComponent, {
      data: {
        case: 'alert',
        id: id
      },
      width: '450px',
    }).afterClosed().subscribe(
      res => {
        if (res) {
          this.getAlerts();
        }
      }
    );
  }

  addCarousel(){
    this.matDialog.open(AddCarouselComponent, {
      width: '450px',
    }).afterClosed().subscribe(
      res => {
        if (res) {
          this.getCarousel();
        }
      }
    );
  }

  addAlert(){
    this.matDialog.open(AddAlertComponent, {
      width: '450px',
    }).afterClosed().subscribe(
      res => {
        if (res) {
          this.getAlerts();
        }
      }
    );
  }


}
