import {AfterViewInit, Component, ElementRef, OnInit, QueryList, ViewChild, ViewChildren} from '@angular/core';
import {NestedTreeControl} from '@angular/cdk/tree';
import {MatTreeNestedDataSource} from '@angular/material/tree';
import {ApiService} from '../../Service/api.service';
import {Category} from '../../Models/Product';
import {BehaviorSubject} from 'rxjs';
import * as $ from 'jquery';
import {MatDialog} from '@angular/material/dialog';
import {User} from '../../Models/User';
import {ConfirmDeleteComponent} from '../../confirm-delete/confirm-delete.component';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css']
})

export class CategoriesComponent implements OnInit {
  isExpandedAll: boolean=false;
  TREE_DATA: Category[] = [];
  treeControl = new NestedTreeControl<Category>(node => node.children);
  dataSource = new MatTreeNestedDataSource<Category>();
  @ViewChildren('tagInput') tagNameTextInput: QueryList<ElementRef>;
  bools = [];
  user:User;

  expandedCategories:Category[]=[];

  dragNode: any;

  constructor(private apiService: ApiService,private matDialog: MatDialog) {
  }

  hasChild = (_: number, node: Category) => !!node.children && node.children.length > 0;

  ngOnInit(): void {
    this.apiService.cast.subscribe(
      res=>{
        this.user=res;
      }
    )
    this.getCategories();
  }

  getCategories() {
    this.bools=[];

    if(this.treeControl.dataNodes){
      this.saveExpandedNodes();
    }

    this.apiService.getCategories('').subscribe(
      res => {
        this.TREE_DATA = res;
        for (let i = 0; i < res.length; i++) {
          this.bools.push({id: res[i].id, toggled: false, isNew: false});
        }
        this.treeControl.dataNodes = this.list_to_tree(res);
        this.dataSource.data = this.list_to_tree(res);

        if(this.treeControl.dataNodes){
          this.restoreExpandedNodes();
        }
      }
    );

  }

  addCategory(node: Category, wrd) {
    let request = {
      'parrentId':node.parent? node.parent.id : null,
      'name': wrd.value
    };

    this.apiService.addCategory(request).subscribe(
      res => {
        node.name = wrd.value;

        this.apiService.successSnackBar(res);
        this.getCategories();
        this.toggle(node);
      }
    );
  }

  updateCategory(node: Category, wrd) {
    let request = {
      'parrentId':node.parent? node.parent.id : null,
      'name': wrd.value
    };

    this.apiService.updateCategory(node.id,request).subscribe(
      res => {
        node.name = wrd.value;

        this.apiService.successSnackBar(res);
        this.getCategories();
        this.toggle(node);
      }
    );
  }

  list_to_tree(list) {
    var map = {}, node: Category, roots = [], i;

    for (i = 0; i < list.length; i += 1) {
      map[list[i].id] = i;
      list[i].children = [];
    }

    for (i = 0; i < list.length; i += 1) {
      node = list[i];
      if (node.parent) {
        list[map[node.parent.id]].children.push(node);
      } else {
        roots.push(node);
      }
    }
    return roots;
  }

  saveExpandedNodes() {
    this.expandedCategories = [];

    this.TREE_DATA.forEach(node => {
      if (this.treeControl.isExpanded(node)) {
        this.expandedCategories.push(node);
      }
    });
  }

  restoreExpandedNodes() {
    this.expandedCategories.forEach(node => {
      this.treeControl.expand(this.TREE_DATA.find(n => n.id === node.id));
    });
  }

  expand(){
    if(this.isExpandedAll){
      this.treeControl.collapseAll();
    }else {
      this.treeControl.expandAll();
    }
    this.isExpandedAll=!this.isExpandedAll;
  }

  getDimensionsByFind(id) {
    return this.bools.find(x => x.id === id);
  }

  toggle(category: Category) {
    for (let i = 0; i < this.bools.length; i++) {
      if (this.bools[i].id === category.id) {
        this.focusLast(category.id);
        if (this.bools[i].isNew && this.bools[i].toggled === true) {
          this.TREE_DATA.splice(i, 1);
          this.bools.splice(i, 1);
          this.refreshData();
          break;
        }
        this.refreshValue(category.id, this.TREE_DATA[i].name);
        this.bools[i].toggled = !this.bools[i].toggled;
        break;
      }
    }
  }

  add(node: Category) {

    for (let i = 0; i < this.TREE_DATA.length; i++) {
      if (this.TREE_DATA[i] === node) {
        if (node !== null && !node.name || this.bools[i].isNew) {
          this.apiService.errorSnackBar('Please save current category first!');
          return;
        }
        this.treeControl.expand(this.TREE_DATA[i]);
        break;
      }
    }
    let kk = this.TREE_DATA[this.TREE_DATA.length - 1].id + 1;

    let ff = new class implements Category {
      id: number = kk;
      name: string;
      parent: Category = node;
      children: Category[];
    };

    this.TREE_DATA.push(ff);
    this.refreshData();
    this.bools.push({id: kk, toggled: true, isNew: true});
    this.focusLast(kk);
  }


  focusLast(kk) {
    setTimeout(() => {
      this.tagNameTextInput.toArray().forEach(s => {
        if (Number(s.nativeElement.id) === kk) {
          s.nativeElement.focus();
        }
      });
    }, 1);
  }

  refreshValue(kk, dd) {
    setTimeout(() => {
      this.tagNameTextInput.toArray().forEach(s => {
        if (Number(s.nativeElement.id) === kk) {
          s.nativeElement.value = dd;
        }
      });
    }, 1);
  }

  refreshData() {
    this.dataSource.data = null;
    this.dataSource = new MatTreeNestedDataSource<Category>();

    this.treeControl.dataNodes = this.list_to_tree(this.TREE_DATA);
    this.dataSource.data = this.list_to_tree(this.TREE_DATA);
  }

  confirmDelete(id) {
    this.matDialog.open(ConfirmDeleteComponent, {
      data:{
        case:'category',
        id:id
      },
      width: '450px',
    }).afterClosed().subscribe(
      res => {
        if (res) {
          this.getCategories();
        }
      }
    );
  }

}
