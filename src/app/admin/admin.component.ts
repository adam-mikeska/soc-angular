import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ApiService} from '../Service/api.service';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';
import {distinctUntilChanged, filter} from 'rxjs/operators';
import {User} from '../Models/User';

export interface IBreadCrumb {
  label: string;
  url: string;
}

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css'],

})
export class adminComponent implements OnInit {

  url: string;
  user: User;
  isExpanded: boolean = false;
  breadcrumbs;
  constructor( public route: ActivatedRoute,private apiService: ApiService,private router: Router) {
    this.breadcrumbs = this.buildBreadCrumb(this.route.root);
  }

  ngOnInit(): void {
    this.router.events.pipe(
      filter((event) => event instanceof NavigationEnd),
      distinctUntilChanged(),
    ).subscribe(() => {
      this.breadcrumbs = this.buildBreadCrumb(this.route.root);
    })


    this.apiService.cast.subscribe(
      res=>{
        this.user=res;
      }
    )
  };

  buildBreadCrumb(route: ActivatedRoute, url: string = '', breadcrumbs: IBreadCrumb[] = []): IBreadCrumb[] {
    let label ;
    if(route.routeConfig===null || route.routeConfig===undefined){
       label = route.routeConfig ? route.routeConfig.data[ 'comp' ] : 'Home';
    }else {
       label = route.routeConfig && route.routeConfig.data ? route.routeConfig.data.comp.replace("Admin/","") : '';
    }

    let path = route.routeConfig && route.routeConfig.data ? route.routeConfig.path.replace("Admin/","") : '';

    const nextUrl = path ? `${url}/${path}` : url;

    const breadcrumb: IBreadCrumb = {
      label: label,
      url: nextUrl,
    };

    const newBreadcrumbs = breadcrumb.label ? [ ...breadcrumbs, breadcrumb ] : [ ...breadcrumbs];
    if (route.firstChild) {

      return this.buildBreadCrumb(route.firstChild, nextUrl, newBreadcrumbs);
    }
    return newBreadcrumbs;
  }
}
