import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmUpdateOrderitemComponent } from './confirm-update-orderitem.component';

describe('ConfirmUpdateOrderitemComponent', () => {
  let component: ConfirmUpdateOrderitemComponent;
  let fixture: ComponentFixture<ConfirmUpdateOrderitemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfirmUpdateOrderitemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmUpdateOrderitemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
