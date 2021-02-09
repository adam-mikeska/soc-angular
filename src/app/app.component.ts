import {Component, OnInit} from '@angular/core';
import {ApiService} from './Service/api.service';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import {Title} from '@angular/platform-browser';
import {filter} from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  ngOnInit(): void {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
    ).subscribe(() => {
      const rt = this.getChild(this.activatedRoute);
      rt.data.subscribe(data => {
        if(data.comp){
          this.titleService.setTitle(data.comp+" | E-SNEAKERS")
        }
        this.dialogRef.closeAll();
        });
    });
  }
  constructor(private apiService: ApiService, private router: Router,private activatedRoute: ActivatedRoute, private dialogRef: MatDialog, private titleService: Title) {


    if (this.apiService.isUserLoggedIn()) {
      this.apiService.retrieveUserInfo().subscribe(
        res => {
          this.apiService.editUser(res);
          this.apiService.editCart(res.cart);
        }
      );
    } else {
      this.apiService.getCart().subscribe(
        res => {
          this.apiService.editCart(res);
        }
      );
    }

  }

  getChild(activatedRoute: ActivatedRoute) {
    if (activatedRoute.firstChild) {
      return this.getChild(activatedRoute.firstChild);
    } else {
      return activatedRoute;
    }

  }

}
