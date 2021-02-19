import {Component, OnInit} from '@angular/core';
import {ApiService} from '../../Service/api.service';
import {Alert, CarouselImage, DashboardDTO, Delivery, Payment} from '../../Models/Product';
import {ConfirmDeleteComponent} from '../../confirm-delete/confirm-delete.component';
import {MatDialog} from '@angular/material/dialog';
import {AddCarouselComponent} from './add-carousel/add-carousel.component';
import {AddAlertComponent} from './add-alert/add-alert.component';
import {User} from '../../Models/User';
import Chart from 'chart.js';

@Component({
  selector: 'app-ui',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  chart;
  chart2;
  dashboardData: DashboardDTO;
  carousel: CarouselImage[] = [];
  alerts: Alert[] = [];
  payments: Payment[] = [];
  deliveries: Delivery[] = [];
  user: User;

  apiUrl = this.apiService.baseUrl;


  constructor(private apiService: ApiService, private matDialog: MatDialog) {
  }

  ngOnInit(): void {
    this.apiService.cast.subscribe(
      res => {
        this.user = res;
      }
    );
    this.getAlerts();
    this.getCarousel();
    this.getDeliveries();
    this.getPayments();
    this.getDashboard();
  }

  getCarousel() {
    this.apiService.getCarousel().subscribe(
      res => {
        this.carousel = res;
      }
    );
  }

  getAlerts() {
    this.apiService.getAlerts().subscribe(
      res => {
        this.alerts = res;
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

  updatePayment(id, price) {
    this.apiService.changePriceOfPayment(id, price).subscribe(
      res => {
        this.apiService.successSnackBar(res);
      }
    );
  }

  updateDelivery(id, price) {
    this.apiService.changePriceOfDelivery(id, price).subscribe(
      res => {
        this.apiService.successSnackBar(res);
      }
    );
  }

  updateCarousel(id, carousel) {
    this.apiService.updateCarousel(id, carousel).subscribe(
      res => {
        this.apiService.successSnackBar(res);
      }
    );
  }

  updateAlert(id, alert) {
    this.apiService.updateAlert(id, alert).subscribe(
      res => {
        this.apiService.successSnackBar(res);
      }
    );
  }

  confirmDeleteCarousel(id) {
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

  confirmDeleteAlert(id) {
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

  addCarousel() {
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

  addAlert() {
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

   animateValue(id, start, end) {
    if (start === end) return;
    var range = end;
    var current = start;
    var obj = document.getElementById(id);
    let sze=Math.ceil(end/20);

    var timer = setInterval(function() {
      if(range<sze){
        current += range;
        range=0;
      }else {
        current += sze;
        range-=sze;
      }
      obj.innerHTML = current;
      if (current == end) {
        clearInterval(timer);
      }
    }, 0);
  }

  getDashboard() {
    this.apiService.dashboardData().subscribe(
      res => {

        let date = [];

        let i =6;

        for(let k=0;k<7;k++){
          let dat = new Date();
          dat.setDate(dat.getDate() - i);
          date[k]=dat.toDateString();
          i--;
        }

        this.chart = new Chart('bar', {
          type: 'line',
          options: {
            responsive: true,
            scales: {
              xAxes: [{
                gridLines: {
                  display: false
                }
              }],
              yAxes: [{
                gridLines: {
                  drawBorder: false,
                  color: 'rgba(236,233,233,0.42)',
                  zeroLineColor: 'rgba(236,233,233,0.42)',
                },
                ticks: {
                  stepSize:1,
                  beginAtZero: true,
                }
              }]
            },
            legend: {display: false},
            animation: {
              duration: 2000,
              easing: 'easeOutQuart'
            },
          },
          data:{
            labels: date,
            datasets: [
              {
                type: 'line',
                label: 'Orders:',
                data: res.last7daysOrders,
                backgroundColor: '#9cc5e7',
                borderColor: '#0aa0e7',
                fill: true,
              },
            ]
          }
        });

        this.chart2 = new Chart('bar2', {
          type: 'line',
          options: {
            responsive: true,
            scales: {
              xAxes: [{
                gridLines: {
                  display: false
                }
              }],
              yAxes: [{
                gridLines: {
                  drawBorder: false,
                  color: 'rgba(236,233,233,0.42)',
                  zeroLineColor: 'rgba(236,233,233,0.42)',
                },
                ticks: {
                  stepSize:1,
                  beginAtZero: true,
                }
              }]
            },
            legend: {display: false},
            animation: {
              duration: 2000,
              easing: 'easeOutQuart'
            },
          },
          data: {
            labels: date,
            datasets: [
              {
                type: 'line',
                label: 'Users:',
                data: res.last7daysUsers,
                backgroundColor: '#9cc5e7',
                borderColor: '#0aa0e7',
                fill: true,
              },
            ]
          }
        });
        this.dashboardData = res;

        this.animateValue("completedOrders", 0, this.dashboardData.totalCompletedOrders);
        this.animateValue("totalProducts", 0, this.dashboardData.totalProducts);
        this.animateValue("totalUsers", 0, this.dashboardData.totalUsers);
      }
    );
  }
}
