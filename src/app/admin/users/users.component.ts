import {AfterViewInit, ChangeDetectorRef, Component, ElementRef, Inject, OnInit, ViewChild} from '@angular/core';
import {MatTable, MatTableDataSource} from '@angular/material/table';
import {MatPaginator, PageEvent} from '@angular/material/paginator';
import {MatSort, Sort, SortDirection} from '@angular/material/sort';
import {ApiService} from '../../Service/api.service';
import {User} from '../../Models/User';
import {HttpClient} from '@angular/common/http';
import {SelectionModel} from '@angular/cdk/collections';
import {TooltipPosition} from '@angular/material/tooltip';
import {FormControl} from '@angular/forms';
import {merge, Subject} from 'rxjs';
import {MatDialog} from '@angular/material/dialog';
import {LogoutDialogComponent} from '../../navigation/logout-dialog/logout-dialog.component';
import {ViewUserComponent} from './view-user/view-user.component';
import {BlockuserComponent} from './block-user/blockuser.component';
import {EditUserComponent} from './edit-user/edit-user.component';
import {SendEmailComponent} from './send-email/send-email.component';
import {Router} from '@angular/router';
import {DOCUMENT} from '@angular/common';
import {AsignRoleComponent} from './asign-role/asign-role.component';
import {catchError, map, startWith, switchMap, tap} from 'rxjs/operators';
import {environment} from '../../../environments/environment';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})

export class UsersComponent implements OnInit {
  selection = new SelectionModel<User>(true, []);
  displayedColumns: string[] = ['select', 'id', 'name', 'email', 'telNumber', 'role', 'actions'];
  dataSource = new MatTableDataSource<User>();
  selectedFileIds: string[] = [];
  search: string;
  total = 0;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  currUser: User;

  sortActive: string;
  sortDirection: SortDirection;

  apiUrl=environment.baseUrl;

  constructor(private apiService: ApiService, private matDialog: MatDialog, private router: Router, private changeDetectorRefs: ChangeDetectorRef) {

  }

  ngOnInit(): void {
    this.getUsers(0, 10, undefined, undefined, undefined);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.apiService.cast.subscribe(
      data => {
        this.currUser = data;
      }
    );
  }


  sortData(sort: Sort) {
    this.sortDirection = sort.direction;
    this.sortActive = sort.active;
    if (this.sortDirection === '') {
      this.sortActive = undefined;
    }
    this.getUsers(this.paginator.pageIndex, this.paginator.pageSize, this.sortDirection, this.sortActive, this.search);
  }

  update() {
    let wordSearch = this.search;
    setTimeout(() => {
      if (wordSearch == this.search) {
        this.getUsers(this.paginator.pageIndex, this.paginator.pageSize, this.sortDirection, this.sortActive, this.search);
      }
    }, 500);
  }


  nextPage(event: PageEvent) {
    this.getUsers(this.paginator.pageIndex, this.paginator.pageSize, this.sortDirection, this.sortActive, this.search);
  }

  getUsers(page, size, direction, sortBy, search) {
    this.apiService.getUsers(page, size, direction, sortBy, search).subscribe(
      data => {
        this.total = data['totalElements'];
        this.dataSource.data = data['content'];
      });
  }

  isAllSelected() {

    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;

    return numSelected === numRows;
  }

  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row => {
        this.selection.select(row);
      });
  }

  openDialogViewUser(row) {
    this.matDialog.open(ViewUserComponent, {data: row, height: '950px', width: '750px',}).afterClosed().subscribe(
      res => {
      }
    );
  }


  asignRole() {
    this.dataSource.data.forEach(row => {
      if (this.selection.isSelected(row)) {
        this.selectedFileIds.push(row.email);
      }
    });
    this.matDialog.open(AsignRoleComponent, {
      data: {
        selected: this.selectedFileIds,
      },
      width: '900px',
    }).afterClosed().subscribe(
      res => {
        if (res) {
          this.selection.clear();
          this.getUsers(this.paginator.pageIndex, this.paginator.pageSize, this.sortDirection, this.sortActive, this.search);
        }
        this.selectedFileIds.length = 0;
      }
    );
  }

  openDialogBlockUser(user) {
    this.dataSource.data.forEach(row => {
      if (this.selection.isSelected(row)) {
        this.selectedFileIds.push(row.email);
      }
    });
    if (!this.selectedFileIds.includes(user) && user !== null) {
      this.selectedFileIds.push(user);
    }
    this.matDialog.open(BlockuserComponent, {
      data: {
        selected: this.selectedFileIds,
      },
      width: '900px',
    }).afterClosed().subscribe(
      res => {
        if (res) {
          this.selection.clear();
          this.getUsers(this.paginator.pageIndex, this.paginator.pageSize, this.sortDirection, this.sortActive, this.search);
        }
        this.selectedFileIds.length = 0;
      }
    );
  }

  openDialogEditUser(row) {
    this.matDialog.open(EditUserComponent, {data: row, width: '700px'}).afterClosed().subscribe(
      res => {
        if (res) {
          this.selection.clear();
          this.getUsers(this.paginator.pageIndex, this.paginator.pageSize, this.sortDirection, this.sortActive, this.search);
        }
      }
    );
  }

  openDialogSendEmail() {
    this.dataSource.data.forEach(row => {
      if (this.selection.isSelected(row)) {
        this.selectedFileIds.push(row.email);
      }
    });

    this.matDialog.open(SendEmailComponent, {
      data: {
        selected: this.selectedFileIds
      },
      width: '900px',
    }).afterClosed().subscribe(
      res => {
        if (res) {
          this.selection.clear();
        }
        this.selectedFileIds.length = 0;
      }
    );
  }

  checkboxLabel(row?: any): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
  }
}
