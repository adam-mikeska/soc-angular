import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AsignRoleComponent } from './asign-role.component';

describe('AsignRoleComponent', () => {
  let component: AsignRoleComponent;
  let fixture: ComponentFixture<AsignRoleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AsignRoleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AsignRoleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
